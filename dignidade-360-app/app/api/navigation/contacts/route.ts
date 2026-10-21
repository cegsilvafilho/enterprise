import { Prisma } from '@prisma/client';
import { validContact,validIdempotencyKey } from '@/lib/navigation-policy';
import { prisma } from '@/lib/prisma';
import { canAccessPatient } from '@/lib/access';
import { navigationActor, navigationBadInput, navigationPersistenceEnabled, navigationSameOrigin } from '@/lib/navigation';

export async function POST(request: Request) {
  if (!navigationPersistenceEnabled()) return Response.json({error:'Módulo persistente não habilitado neste ambiente.'},{status:503});
  if (!navigationSameOrigin(request)) return Response.json({error:'Origem inválida.'},{status:403});
  const actor = await navigationActor();
  if (!actor) return Response.json({error:'Apenas profissional autorizado pode registrar contatos.'},{status:403});

  let payload: unknown;
  try { payload = await request.json(); } catch { return navigationBadInput('JSON inválido.'); }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return navigationBadInput('Dados inválidos.');
  const data = payload as Record<string,unknown>;
  const patientId = typeof data.patientId==='string' ? data.patientId : '';
  const channel = typeof data.channel==='string' ? data.channel : '';
  const result = typeof data.result==='string' ? data.result : '';
  const reportedChange = typeof data.reportedChange==='string' ? data.reportedChange : '';
  const summary = typeof data.summary==='string' ? data.summary.trim() : '';
  const key = typeof data.idempotencyKey==='string' ? data.idempotencyKey : '';
  if (!validIdempotencyKey(key)) return navigationBadInput('Chave de registro inválida.');
  if (!['phone','video','in_person'].includes(channel)) return navigationBadInput('Canal inválido.');
  if (!validContact(result,reportedChange,summary)) return navigationBadInput('Resultado e escuta inconsistentes; sem resposta implica condição não avaliada.');
  if (!patientId || !(await canAccessPatient(actor,patientId))) return Response.json({error:'Paciente inacessível.'},{status:404});

  try {
    const contact = await prisma.$transaction(async tx=>{
      const item=await tx.navigationContact.create({data:{
        organizationId:actor.organizationId,patientId,authorUserId:actor.id,idempotencyKey:key,
        channel,result,reportedChange,summary:summary||'Tentativa sem resposta; estado não avaliado.'
      }});
      await tx.audit.create({data:{organizationId:actor.organizationId,userId:actor.id,user:actor.name,
        action:'navigation_contact_created',entity:'NavigationContact',detail:'contactId='+item.id+';patientId='+patientId}});
      return item;
    });
    return Response.json({id:contact.id,result:contact.result,reportedChange:contact.reportedChange},{status:201});
  }catch(error){
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code==='P2002'){
      const found=await prisma.navigationContact.findUnique({where:{idempotencyKey:key}});
      if(found && found.patientId===patientId && found.organizationId===actor.organizationId && found.authorUserId===actor.id){
        return Response.json({id:found.id,alreadyRecorded:true,result:found.result},{status:200});
      }
      return Response.json({error:'Conflito de identificador de solicitação.'},{status:409});
    }
    throw error;
  }
}
