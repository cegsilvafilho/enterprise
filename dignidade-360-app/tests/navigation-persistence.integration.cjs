// CI uses PostgreSQL service on the ephemeral GitHub runner.
// No application, Vercel, institutional or patient databases are accessed.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {randomUUID}=require('node:crypto');
const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();

test('synthetic longitudinal contact/task records survive writes with traceability',async()=>{
  try{
    const orgA=await prisma.organization.create({data:{name:'CI Dignare A',slug:'ci-a-'+randomUUID()}});
    const orgB=await prisma.organization.create({data:{name:'CI Dignare B',slug:'ci-b-'+randomUUID()}});
    const professionalA=await prisma.user.create({data:{
      organizationId:orgA.id,name:'Profissional fictício A',role:'professional',email:randomUUID()+'@invalid.example',password:'never-used-ci',active:true,mustChangePassword:false
    }});
    const professionalB=await prisma.user.create({data:{
      organizationId:orgB.id,name:'Profissional fictício B',role:'professional',email:randomUUID()+'@invalid.example',password:'never-used-ci',active:true,mustChangePassword:false
    }});
    const personA=await prisma.patient.create({data:{organizationId:orgA.id,name:'Pessoa sintética A',age:60,condition:'Cenário de simulação',unit:'CI',careLine:'Testes'}});
    const personB=await prisma.patient.create({data:{organizationId:orgB.id,name:'Pessoa sintética B',age:60,condition:'Cenário de simulação',unit:'CI',careLine:'Testes'}});
    await prisma.patientAssignment.create({data:{patientId:personA.id,userId:professionalA.id,role:'primary',active:true}});
    await prisma.patientAssignment.create({data:{patientId:personB.id,userId:professionalB.id,role:'primary',active:true}});

    const contactKey=randomUUID();
    const contact=await prisma.$transaction(async tx=>{
      const saved=await tx.navigationContact.create({data:{
        organizationId:orgA.id,patientId:personA.id,authorUserId:professionalA.id,
        idempotencyKey:contactKey,channel:'phone',result:'no_answer',reportedChange:'not_assessed',
        summary:'Tentativa sem resposta; estado clínico não avaliado.'
      }});
      await tx.audit.create({data:{organizationId:orgA.id,userId:professionalA.id,user:professionalA.name,action:'test_contact_created',entity:'NavigationContact',detail:'contactId='+saved.id}});
      return saved;
    });
    assert.equal(contact.result,'no_answer');
    assert.equal(contact.reportedChange,'not_assessed');
    assert.equal((await prisma.navigationContact.findMany({where:{organizationId:orgB.id}})).length,0);
    // Mismatched patient/organization and author/organization must fail in PostgreSQL
    // even if a future application route accidentally omits its tenant filter.
    await assert.rejects(()=>prisma.navigationContact.create({data:{
      organizationId:orgB.id,patientId:personA.id,authorUserId:professionalB.id,
      idempotencyKey:randomUUID(),channel:'phone',result:'no_answer',
      reportedChange:'not_assessed',summary:'Teste de conflito de organização.'
    }}),e=>e.code==='P2003');

    await assert.rejects(()=>prisma.navigationContact.create({data:{
      organizationId:orgA.id,patientId:personA.id,authorUserId:professionalA.id,
      idempotencyKey:contactKey,channel:'phone',result:'reached',reportedChange:'changed',summary:'Duplicata intencional no teste.'
    }}),e=>e.code==='P2002');

    const actionKey=randomUUID();
    const task=await prisma.navigationTask.create({data:{
      organizationId:orgA.id,patientId:personA.id,creatorUserId:professionalA.id,
      ownerUserId:professionalA.id,originContactId:contact.id,idempotencyKey:actionKey,
      title:'Confirmar retorno da equipe fictícia',status:'open',dueAt:new Date('2026-10-25T02:59:59Z')
    }});
    assert.equal(task.version,1);
    assert.equal((await prisma.navigationTask.findMany({where:{organizationId:orgB.id}})).length,0);
    // Contact of one patient may not be linked to another patient's task.
    await assert.rejects(()=>prisma.navigationTask.create({data:{
      organizationId:orgB.id,patientId:personB.id,creatorUserId:professionalB.id,
      ownerUserId:professionalB.id,originContactId:contact.id,idempotencyKey:randomUUID(),
      title:'Ação com contato de outra organização',dueAt:new Date('2026-10-25T02:59:59Z')
    }}),e=>e.code==='P2003');

    const first=await prisma.navigationTask.updateMany({where:{id:task.id,organizationId:orgA.id,version:1,status:{not:'resolved'}},data:{
      status:'resolved',version:{increment:1},outcome:'Retorno confirmado no cenário de teste.',closedByUserId:professionalA.id,closedAt:new Date()
    }});
    assert.equal(first.count,1);
    const stale=await prisma.navigationTask.updateMany({where:{id:task.id,organizationId:orgA.id,version:1,status:{not:'resolved'}},data:{status:'waiting'}});
    assert.equal(stale.count,0,'An outdated version must not overwrite the resolution');
    const stored=await prisma.navigationTask.findUnique({where:{id:task.id},include:{owner:true,creator:true,originContact:true}});
    assert.equal(stored.version,2);
    assert.equal(stored.owner.id,professionalA.id);
    assert.equal(stored.originContact.id,contact.id);
    assert.ok(stored.closedAt);
    assert.equal(stored.outcome,'Retorno confirmado no cenário de teste.');
    await assert.rejects(()=>prisma.navigationTask.create({data:{
      organizationId:orgA.id,patientId:personA.id,creatorUserId:professionalA.id,
      ownerUserId:professionalA.id,idempotencyKey:actionKey,title:'Duplicação proibida',
      dueAt:new Date('2026-10-25T02:59:59Z')
    }}),e=>e.code==='P2002');
    assert.equal(await prisma.audit.count({where:{organizationId:orgA.id,action:'test_contact_created'}}),1);
  } finally {await prisma.$disconnect();}
});
