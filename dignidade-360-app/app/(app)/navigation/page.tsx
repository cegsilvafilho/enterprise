import Link from 'next/link';
import { redirect } from 'next/navigation';
import { navigationActor, navigationPersistenceEnabled } from '@/lib/navigation';
import { getAccessiblePatients } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import NavigationWorkspace from './NavigationWorkspace';

export default async function NavigationPage({searchParams}:{searchParams?:Promise<{patientId?:string}>}){
  const user=await navigationActor();
  if(!user)redirect('/dashboard');
  if(!navigationPersistenceEnabled()){
    return <div style={{maxWidth:920,margin:'32px auto'}}>
      <header className="topbar"><div><h1>Navegação longitudinal</h1><span className="view-kicker">Persistência protegida por homologação</span></div></header>
      <section className="panel" style={{padding:28}}>
        <h2>Ambiente persistente ainda não liberado</h2>
        <p>O módulo já possui modelos de contato, ações e API, mas está bloqueado até a migração controlada em um banco <strong>exclusivo de staging</strong> e a revisão dos protocolos.</p>
        <p>Para conhecer o fluxo de trabalho, explore os quatro cenários inteiramente fictícios.</p>
        <Link className="soft" href="/demo/concierge">Abrir laboratório Concierge</Link>
        <p style={{marginTop:18,fontSize:13,color:'#667276'}}>Não insira dados clínicos reais no laboratório. Não há integração com prontuário, WhatsApp ou Power BI.</p>
      </section>
    </div>;
  }
  const patients=await getAccessiblePatients(user);
  const query=searchParams ? await searchParams : undefined;
  const selected= query?.patientId
    ? patients.find(p=>p.id===query.patientId)
    : patients[0];
  if(query?.patientId && !selected) {
    return <section className="panel" style={{padding:26}}><h1>Paciente indisponível</h1><p>O registro solicitado não pertence à sua carteira atual.</p><Link href="/navigation">Voltar à carteira</Link></section>;
  }
  if(!selected) {
    return <section className="panel" style={{padding:26}}><h1>Nenhum paciente vinculado</h1><p>Solicite à coordenação uma vinculação formal antes de registrar ações.</p></section>;
  }

  const [contacts,tasks,owners]=await Promise.all([
    prisma.navigationContact.findMany({where:{organizationId:user.organizationId,patientId:selected.id},include:{author:{select:{name:true}}},orderBy:{createdAt:'desc'},take:50}),
    prisma.navigationTask.findMany({where:{organizationId:user.organizationId,patientId:selected.id},include:{owner:{select:{name:true}}},orderBy:[{status:'asc'},{dueAt:'asc'}],take:100}),
    prisma.user.findMany({where:{
      organizationId:user.organizationId,role:'professional',active:true,mustChangePassword:false,
      assignments:{some:{patientId:selected.id,active:true}}
    },select:{id:true,name:true},orderBy:{name:'asc'}})
  ]);

  return <NavigationWorkspace
    actorId={user.id}
    patients={patients.map(p=>({id:p.id,name:p.name,careLine:p.careLine}))}
    patient={{id:selected.id,name:selected.name,careLine:selected.careLine,goal:selected.goal||'',preference:selected.preference||''}}
    owners={owners}
    contacts={contacts.map(c=>({id:c.id,channel:c.channel,result:c.result,reportedChange:c.reportedChange,summary:c.summary,author:c.author.name,createdAt:c.createdAt.toISOString()}))}
    tasks={tasks.map(t=>({id:t.id,title:t.title,status:t.status,dueAt:t.dueAt.toISOString(),version:t.version,ownerUserId:t.ownerUserId,owner:t.owner.name,outcome:t.outcome,closedAt:t.closedAt?.toISOString()||null}))}
  />;
}
