import { prisma } from '@/lib/prisma';
import { canTransitionNavigationTask,validTaskOutcome } from '@/lib/navigation-policy';
import { canAccessPatient } from '@/lib/access';
import { navigationActor,navigationBadInput,navigationPersistenceEnabled,navigationSameOrigin } from '@/lib/navigation';
const states=new Set(['open','in_progress','waiting','resolved']);

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!navigationPersistenceEnabled()) return Response.json({error:'Módulo persistente não habilitado.'},{status:503});
  if(!navigationSameOrigin(request)) return Response.json({error:'Origem inválida.'},{status:403});
  const actor=await navigationActor();
  if(!actor)return Response.json({error:'Acesso negado.'},{status:403});
  const {id}=await params;
  let payload:unknown;
  try{payload=await request.json();}catch{return navigationBadInput('JSON inválido.');}
  if(!payload||typeof payload!=='object'||Array.isArray(payload))return navigationBadInput('Dados inválidos.');
  const d=payload as Record<string,unknown>;
  const status=typeof d.status==='string'?d.status:'';
  const version=typeof d.version==='number' && Number.isSafeInteger(d.version)?d.version:-1;
  const outcome=typeof d.outcome==='string'?d.outcome.trim():'';
  if(!states.has(status)||version<1)return navigationBadInput('Estado ou versão inválidos.');
  if(status==='resolved' && !validTaskOutcome(outcome))return navigationBadInput('É obrigatório registrar um resultado verificável (12–2000 caracteres).');
  if(status!=='resolved' && outcome) return navigationBadInput('O desfecho é reservado ao encerramento.');
  const item=await prisma.navigationTask.findFirst({where:{id,organizationId:actor.organizationId}});
  if(!item||!(await canAccessPatient(actor,item.patientId)))return Response.json({error:'Ação não encontrada.'},{status:404});
  if(item.ownerUserId!==actor.id)return Response.json({error:'Somente o responsável atribuído pode atualizar esta ação.'},{status:403});
  if(item.status==='resolved')return Response.json({error:'Ação já encerrada.'},{status:409});
  if(!canTransitionNavigationTask(item.status,status))return navigationBadInput('Transição de estado não permitida.');

  const changed=await prisma.$transaction(async tx=>{
    const updated=await tx.navigationTask.updateMany({where:{
      id,organizationId:actor.organizationId,patientId:item.patientId,ownerUserId:actor.id,
      version,status:{not:'resolved'}
    },data:{
      status,version:{increment:1},
      ...(status==='resolved'?{outcome,closedAt:new Date(),closedByUserId:actor.id}:{})
    }});
    if(updated.count!==1)return false;
    await tx.audit.create({data:{organizationId:actor.organizationId,userId:actor.id,user:actor.name,
      action:status==='resolved'?'navigation_task_resolved':'navigation_task_status_changed',
      entity:'NavigationTask',detail:'taskId='+id+';patientId='+item.patientId+';status='+status}});
    return true;
  });
  if(!changed)return Response.json({error:'Esta ação foi modificada em outra sessão. Atualize a tela.'},{status:409});
  return Response.json({id,status,version:version+1});
}
