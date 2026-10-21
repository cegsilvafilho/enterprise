'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Person={id:string;name:string;careLine:string};
type Contact={id:string;channel:string;result:string;reportedChange:string;summary:string;author:string;createdAt:string};
type Task={id:string;title:string;status:string;dueAt:string;version:number;ownerUserId:string;owner:string;outcome:string|null;closedAt:string|null};
type Owner={id:string;name:string};
type Props={
  actorId:string;patients:Person[];patient:Person&{goal:string;preference:string};
  contacts:Contact[];tasks:Task[];owners:Owner[];
};
const stateNames:Record<string,string>={open:'Aberta',in_progress:'Em andamento',waiting:'Aguardando terceiro',resolved:'Concluída'};
const dateOnly=(v:string)=>v.slice(0,10);
function fmt(value:string){return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Fortaleza',dateStyle:'short',timeStyle:'short'}).format(new Date(value));}
async function send(url:string,method:string,payload:object){
  const response=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),credentials:'same-origin'});
  let answer: {error?:string}|null=null;
  try{answer=await response.json();}catch{}
  if(!response.ok)throw new Error(answer?.error||'Não foi possível concluir. Confirme com a equipe antes de repetir.');
  return answer;
}

export default function NavigationWorkspace({actorId,patients,patient,contacts,tasks,owners}:Props){
  const router=useRouter();
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState('');
  const [error,setError]=useState('');
  const [channel,setChannel]=useState('phone');
  const [result,setResult]=useState('reached');
  const [change,setChange]=useState('not_assessed');
  const [summary,setSummary]=useState('');
  const [title,setTitle]=useState('');
  const [dueDate,setDueDate]=useState('');
  const [owner,setOwner]=useState(actorId);
  const [origin,setOrigin]=useState('');
  const [taskStatus,setTaskStatus]=useState<Record<string,string>>({});
  const [taskOutcomes,setTaskOutcomes]=useState<Record<string,string>>({});
  const key=useRef<string|null>(null);
  function feedback(){setError('');setNotice('');}
  async function recordContact(event:React.FormEvent){
    event.preventDefault();feedback();setBusy(true);
    if(!key.current)key.current=crypto.randomUUID();
    try{
      await send('/api/navigation/contacts','POST',{
        patientId:patient.id,channel,result,reportedChange:result==='no_answer'?'not_assessed':change,
        summary,idempotencyKey:key.current
      });
      key.current=null;
      setSummary('');
      setNotice(result==='no_answer'?'Tentativa registrada: estado clínico não avaliado.':'Contato registrado. A avaliação clínica cabe à equipe.');
      router.refresh();
    }catch(e){setError(e instanceof Error?e.message:'Falha ao registrar contato.');}
    finally{setBusy(false);}
  }
  async function addTask(event:React.FormEvent){
    event.preventDefault();feedback();setBusy(true);
    try{
      await send('/api/navigation/tasks','POST',{patientId:patient.id,title,ownerUserId:owner,dueDate,originContactId:origin||undefined});
      setTitle('');setDueDate('');setOrigin('');setNotice('Ação atribuída. A responsabilidade ficará registrada na trilha de auditoria.');
      router.refresh();
    }catch(e){setError(e instanceof Error?e.message:'Falha ao cadastrar ação.');}
    finally{setBusy(false);}
  }
  async function updateTask(task:Task){
    feedback();setBusy(true);
    const next=taskStatus[task.id]||task.status;
    try{
      await send('/api/navigation/tasks/'+encodeURIComponent(task.id),'PATCH',{
        version:task.version,status:next,outcome:next==='resolved'?taskOutcomes[task.id]||'':''
      });
      setNotice('Ação atualizada com rastreabilidade.');router.refresh();
    }catch(e){setError(e instanceof Error?e.message:'Falha ao atualizar.');}
    finally{setBusy(false);}
  }
  return <div className="nv-wrap">
    <header className="topbar"><div><h1>Navegação longitudinal</h1><span className="view-kicker">Contato → ação → responsável → desfecho</span></div></header>
    <p className="nv-gate">STAGING RESTRITO · Registros operacionais auditáveis · Prontuário oficial não conectado. Não utilizar dados reais até homologação. Em emergência: SAMU 192.</p>
    <div className="nv-layout">
      <aside className="panel nv-panel nv-sidebar" aria-label="Pacientes vinculados">
        <h2>Minha carteira</h2><p className="nv-muted">Somente pessoas com vínculo assistencial ativo.</p>
        <nav>{patients.map(p=><Link key={p.id} aria-current={p.id===patient.id?'page':undefined} href={'/navigation?patientId='+encodeURIComponent(p.id)} className={p.id===patient.id?'nv-active':''}>
          <strong>{p.name}</strong><small>{p.careLine}</small>
        </Link>)}</nav>
      </aside>
      <div className="nv-main">
        <section className="panel nv-panel">
          <div className="nv-between"><h2>{patient.name}</h2><span className="nv-chip">{patient.careLine}</span></div>
          <div className="nv-cols"><article><small>Objetivos informados</small><p>{patient.goal||'Não documentado'}</p></article><article><small>Preferências informadas</small><p>{patient.preference||'Não documentado'}</p></article></div>
          <p className="nv-muted">Estes campos são um resumo existente na aplicação e não demonstram que existe um PAD vigente. Confirme informações clínicas no prontuário oficial.</p>
        </section>
        <section className="panel nv-panel">
          <h2>Registrar contato</h2>
          <form onSubmit={recordContact}>
            <div className="nv-cols">
              <label>Canal<select value={channel} onChange={e=>setChannel(e.target.value)}><option value="phone">Telefone</option><option value="video">Vídeo</option><option value="in_person">Presencial</option></select></label>
              <label>Resultado<select value={result} onChange={e=>{setResult(e.target.value);if(e.target.value==='no_answer')setChange('not_assessed');}}>
                <option value="reached">Contato realizado</option><option value="no_answer">Tentativa sem resposta</option>
              </select></label>
            </div>
            <label>Mudança relatada<select value={result==='no_answer'?'not_assessed':change} disabled={result==='no_answer'} onChange={e=>setChange(e.target.value)}>
              <option value="not_assessed">Não avaliada</option><option value="unchanged">Sem mudança relatada</option><option value="changed">Mudança relatada; revisão humana necessária</option>
            </select></label>
            <label>Registro da escuta e dos encaminhamentos<textarea rows={3} maxLength={1200} value={summary} onChange={e=>setSummary(e.target.value)} placeholder="Descreva o contato de forma objetiva. Não use esta tela antes da homologação."/></label>
            <button disabled={busy||result==='reached'&&summary.trim().length<12} type="submit">{busy?'Registrando…':'Registrar contato'}</button>
          </form>
          <h3>Contatos registrados</h3>
          {!contacts.length&&<p className="nv-muted">Ainda não há contatos registrados nesta jornada.</p>}
          <div className="nv-feed">{contacts.map(c=><article key={c.id}>
            <div className="nv-between"><strong>{c.result==='no_answer'?'Tentativa sem resposta':'Contato realizado'}</strong><small>{fmt(c.createdAt)}</small></div>
            <p>{c.summary}</p><small>{c.author} · {c.channel} · {c.reportedChange==='changed'?'Mudança relatada':c.reportedChange==='unchanged'?'Sem mudança relatada':'Não avaliado'}</small>
          </article>)}</div>
        </section>
        <section className="panel nv-panel">
          <h2>Ações acompanhadas</h2>
          {!tasks.length&&<p className="nv-muted">Nenhuma ação operacional atribuída.</p>}
          {tasks.map(t=><article className="nv-task" key={t.id}>
            <div className="nv-between"><strong>{t.title}</strong><span className="nv-chip">{stateNames[t.status]||t.status}</span></div>
            <p className="nv-muted">Responsável: {t.owner} · Prazo: {fmt(t.dueAt)} · Versão {t.version}</p>
            {t.outcome&&<p><strong>Desfecho: </strong>{t.outcome}</p>}
            {t.status!=='resolved'&&t.ownerUserId===actorId&&<div className="nv-task-actions">
              <label>Situação<select value={taskStatus[t.id]||t.status} onChange={e=>setTaskStatus(a=>({...a,[t.id]:e.target.value}))}>
                {Object.entries(stateNames).map(([v,n])=><option key={v} value={v}>{n}</option>)}
              </select></label>
              {(taskStatus[t.id]||t.status)==='resolved'&&<label>Resultado verificável<textarea value={taskOutcomes[t.id]||''} maxLength={2000} rows={2} onChange={e=>setTaskOutcomes(a=>({...a,[t.id]:e.target.value}))}/></label>}
              <button disabled={busy||(taskStatus[t.id]||t.status)===t.status||((taskStatus[t.id]||t.status)==='resolved'&&(taskOutcomes[t.id]||'').trim().length<12)} onClick={()=>updateTask(t)} type="button">Salvar mudança</button>
            </div>}
          </article>)}
          <h3>Nova ação</h3>
          <form onSubmit={addTask}>
            <label>Ação e resultado esperado<input value={title} onChange={e=>setTitle(e.target.value)} minLength={12} maxLength={160} required placeholder="Ex.: confirmar devolutiva da equipe de referência"/></label>
            <div className="nv-cols">
              <label>Responsável vinculado<select value={owner} onChange={e=>setOwner(e.target.value)}>
                {owners.map(o=><option value={o.id} key={o.id}>{o.name}</option>)}
              </select></label>
              <label>Prazo acordado<input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} required/></label>
            </div>
            <label>Contato de origem (opcional)<select value={origin} onChange={e=>setOrigin(e.target.value)}>
              <option value="">Sem vínculo a contato</option>{contacts.map(c=><option key={c.id} value={c.id}>{fmt(c.createdAt)} — {c.result==='reached'?'Realizado':'Sem resposta'}</option>)}
            </select></label>
            <button disabled={busy||title.trim().length<12||!dueDate||!owner} type="submit">Criar ação com responsável</button>
          </form>
        </section>
        <p role={error?'alert':'status'} aria-live="polite" className={error?'nv-error':'nv-success'}>{error||notice}</p>
      </div>
    </div>
    <style jsx>{`
      .nv-wrap{max-width:1500px;margin:auto;display:grid;gap:12px}.nv-gate{padding:12px 16px;border:1px solid #ddc6ac;background:#fff8eb;border-radius:8px;color:#6e4c2d;font-size:13px}.nv-layout{display:grid;grid-template-columns:minmax(220px,280px) minmax(0,1fr);gap:16px;align-items:start}.nv-main{display:grid;gap:14px;min-width:0}.nv-panel{padding:22px;border-radius:12px}.nv-panel h2{margin:0 0 12px;color:#1B4F72}.nv-panel h3{margin:22px 0 10px;font-size:1rem;color:#1B4F72}.nv-muted{font-size:13px;color:#667276;line-height:1.55}.nv-sidebar nav{display:grid;gap:8px}.nv-sidebar nav a{display:grid;gap:6px;padding:12px;border:1px solid #d9e3df;border-radius:8px;text-decoration:none;color:#23333b}.nv-sidebar nav a.nv-active{border-color:#2f6f8f;background:#edf4f8}.nv-sidebar nav a small{color:#667276}.nv-between{display:flex;gap:12px;align-items:start;justify-content:space-between;flex-wrap:wrap}.nv-cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.nv-cols article{background:#faf7f2;border-radius:8px;padding:14px}.nv-cols article p{margin:5px 0 0}.nv-cols small{color:#667276}.nv-chip{border:1px solid #b7ccda;color:#1B4F72;padding:5px 10px;border-radius:100px;font-size:12px}.nv-panel form{display:grid;gap:12px;margin-top:12px}.nv-panel label{display:grid;gap:6px;font-size:13px;font-weight:650}.nv-panel input,.nv-panel textarea,.nv-panel select{padding:11px;border:1px solid #b7cbd8;border-radius:8px;background:#fff;color:#27333c;font:inherit;max-width:100%;min-width:0}.nv-panel button{background:#1B4F72;color:#fff;border:0;border-radius:8px;padding:11px 16px;font-weight:750;justify-self:start}.nv-panel button:disabled{background:#98a9b4;cursor:not-allowed}.nv-feed{display:grid;gap:8px}.nv-feed article,.nv-task{padding:14px 0;border-bottom:1px solid #dfe8eb}.nv-feed p{margin:8px 0}.nv-feed small{color:#667276}.nv-task-actions{display:grid;gap:10px;padding-top:8px}.nv-error{color:#8e251c;font-weight:700}.nv-success{color:#225d48;font-weight:700}.nv-panel :is(a,button,input,select,textarea):focus-visible{outline:3px solid #2179b1;outline-offset:2px}
      @media(max-width:900px){.nv-layout{grid-template-columns:1fr}.nv-sidebar nav{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr))}}@media(max-width:580px){.nv-cols{grid-template-columns:1fr}.nv-panel{padding:15px}}
    `}</style>
  </div>;
}
