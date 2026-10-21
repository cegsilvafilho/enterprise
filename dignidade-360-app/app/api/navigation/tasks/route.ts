import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { validIdempotencyKey } from '@/lib/navigation-policy';
import { canAccessPatient } from '@/lib/access';
import { navigationActor,navigationBadInput,navigationDate,navigationPersistenceEnabled,navigationSameOrigin } from '@/lib/navigation';

export async function POST(request: Request) {
  if (!navigationPersistenceEnabled()) return Response.json({error:'Módulo persistente não habilitado.'},{status:503});
  if (!navigationSameOrigin(request)) return Response.json({error:'Origem inválida.'},{status:403});
  const actor=await navigationActor();
  if(!actor) return Response.json({error:'Acesso negado.'},{status:403});
  let payload:unknown;
  try{payload=await request.json();}catch{return navigationBadInput('JSON inválido.');}
  if(!payload||typeof payload!=='object'||Array.isArray(payload)) return navigationBadInput('Dados inválidos.');
  const d=payload as Record<string,unknown>;
  const patientId=typeof d.patientId==='string'?d.patientId:'';
  const title=typeof d.title==='string'?d.title.trim():'';
  const ownerUserId=typeof d.ownerUserId==='string'?d.ownerUserId:'';
  const originContactId=typeof d.originContactId==='string'?d.originContactId:undefined;
  const idempotencyKey=typeof d.idempotencyKey==='string'?d.idempotencyKey:'';
  if(!validIdempotencyKey(idempotencyKey))return navigationBadInput('Identificador de envio inválido.');
  const dueAt=navigationDate(d.dueDate);
  if(title.length<12||title.length>160||!dueAt) return navigationBadInput('Ação (12–160 caracteres) e data válida são obrigatórias.');
  if(!patientId || !(await canAccessPatient(actor,patientId))) return Response.json({error:'Paciente inacessível.'},{status:404});
  // Assignment is not merely a label: owner must have an ACTIVE clinical assignment.
  const owner=await prisma.user.findFirst({where:{
    id:ownerUserId,organizationId:actor.organizationId,role:'professional',active:true,
    mustChangePassword:false,assignments:{some:{patientId,active:true}}
  },select:{id:true}});
  if(!owner) return navigationBadInput('Responsável deve ser profissional ativo vinculado à pessoa.');
  if(originContactId){
    const belongs=await prisma.navigationContact.findFirst({where:{id:originContactId,patientId,organizationId:actor.organizationId},select:{id:true}});
    if(!belongs) return navigationBadInput('Contato de origem não pertence ao paciente.');
  }
  try {
    const task=await prisma.$transaction(async tx=>{
      const item=await tx.navigationTask.create({data:{
        organizationId:actor.organizationId,patientId,title,ownerUserId,creatorUserId:actor.id,
        originContactId,idempotencyKey,dueAt,status:'open'
      }});
      await tx.audit.create({data:{organizationId:actor.organizationId,userId:actor.id,user:actor.name,
        action:'navigation_task_created',entity:'NavigationTask',detail:'taskId='+item.id+';patientId='+patientId+';ownerId='+ownerUserId}});
      return item;
    });
    return Response.json({id:task.id,status:task.status},{status:201});
  }catch(error){
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code==='P2002'){
      const prior=await prisma.navigationTask.findUnique({where:{idempotencyKey}});
      if(prior && prior.organizationId===actor.organizationId && prior.patientId===patientId &&
        prior.creatorUserId===actor.id && prior.title===title && prior.ownerUserId===ownerUserId &&
        prior.dueAt.getTime()===dueAt.getTime() && prior.originContactId===(originContactId||null)){
        return Response.json({id:prior.id,status:prior.status,alreadyRecorded:true},{status:200});
      }
      return Response.json({error:'Envio duplicado com dados diferentes.'},{status:409});
    }
    throw error;
  }
}
