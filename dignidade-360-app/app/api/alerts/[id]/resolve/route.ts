import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canAccessPatient, canResolveAlerts, getCurrentUser } from '@/lib/access';

const permittedOutcomes = new Set([
  'Orientacao',
  'Encaminhamento para avaliacao de prescricao',
  'Orientacao para procurar urgencia conforme protocolo',
  'Reuniao familiar',
]);
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const actor = await getCurrentUser((session?.user as { id?: string } | undefined)?.id);
  if (!actor || !canResolveAlerts(actor.role)) {
    return NextResponse.json({error:'A resolução exige profissional assistencial autorizado.'},{status:403});
  }

  let body: unknown;
  try {body = await request.json();} catch {
    return NextResponse.json({error:'Formato inválido.'},{status:400});
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({error:'Dados inválidos.'},{status:400});
  }
  const data = body as {type?:unknown;description?:unknown};
  const type = typeof data.type === 'string' ? data.type.trim() : '';
  const description = typeof data.description === 'string' ? data.description.trim() : '';
  if (!permittedOutcomes.has(type) || description.length < 12 || description.length > 2000) {
    return NextResponse.json({error:'Selecione uma ação permitida e descreva o resultado (12 a 2000 caracteres).'},{status:400});
  }
  const alert = await prisma.alert.findUnique({where:{id}});
  if (!alert || !(await canAccessPatient(actor,alert.patientId))) {
    return NextResponse.json({error:'Alerta não encontrado.'},{status:404});
  }
  if (alert.status === 'resolved') {
    return NextResponse.json({error:'Alerta já encerrado. Não será gravada segunda conduta.'},{status:409});
  }
  // Update and clinical trace are atomic. CAS prevents duplicate close on concurrent submissions.
  try {
    const outcome = await prisma.$transaction(async tx => {
      const changed = await tx.alert.updateMany({
        where:{id:alert.id, status:{not:'resolved'}},
        data:{status:'resolved',outcome:description,resolvedAt:new Date()}
      });
      if (changed.count!==1) throw new Error('ALREADY_RESOLVED');
      const conduct = await tx.conduct.create({data:{
        patientId:alert.patientId,alertId:alert.id,type,description,author:actor.name
      }});
      await tx.timelineEvent.create({data:{
        patientId:alert.patientId,title:type+' registrada',type:'Conduta documentada',
        description,author:actor.name
      }});
      await tx.audit.create({data:{
        organizationId:actor.organizationId,userId:actor.id,user:actor.name,
        action:'Resolveu alerta com desfecho',entity:'alerts',
        detail:'alertId='+alert.id+'; patientId='+alert.patientId
      }});
      return conduct;
    });
    return NextResponse.json({success:true,conduct:outcome});
  } catch(error) {
    if (error instanceof Error && error.message==='ALREADY_RESOLVED') {
      return NextResponse.json({error:'Alerta já encerrado em outra sessão.'},{status:409});
    }
    throw error;
  }
}
