'use client';

import { useMemo, useState } from 'react';

type State = 'aberta' | 'em_andamento' | 'aguardando_terceiro' | 'resolvida';
type Task = { id: string; personId: string; title: string; owner: string; due: string; state: State; outcome?: string };
type Person = { id: string; label: string; program: string; contact: string; last: string; next: string; baseline: string; emphasis: string; reach: string };
type Event = { id: number; text: string; at: string };
const people: Person[] = [
  { id:'SIM-001',label:'Pessoa A · cenário estável',program:'Essencial',contact:'Contato semanal',last:'13/10/2026',next:'20/10/2026',baseline:'Sem mudança relatada na última revisão',emphasis:'Continuar atividades com autonomia',reach:'Contato pactuado' },
  { id:'SIM-002',label:'Pessoa B · mudança clínica',program:'Acolhida',contact:'Contato semanal',last:'16/10/2026',next:'20/10/2026',baseline:'Mudança recente ainda sem revisão neste cenário',emphasis:'Alívio de desconfortos',reach:'Avaliação profissional pendente' },
  { id:'SIM-003',label:'Pessoa C · cuidador',program:'Essencial',contact:'Contato semanal',last:'14/10/2026',next:'21/10/2026',baseline:'Sem mudança clínica conhecida',emphasis:'Apoio à pessoa cuidadora',reach:'Família autorizada no cenário' },
  { id:'SIM-004',label:'Pessoa D · sem resposta',program:'Essencial',contact:'Contato semanal',last:'09/10/2026',next:'20/10/2026',baseline:'Estado atual NÃO AVALIADO',emphasis:'Retomar contato',reach:'Não localizado' }
];
const initialTasks: Task[] = [
  {id:'T-001',personId:'SIM-002',title:'Solicitar revisão profissional do relato de piora',owner:'Enfermagem de referência',due:'2026-10-20',state:'aberta'},
  {id:'T-002',personId:'SIM-003',title:'Organizar orientação sobre apoio ao cuidador',owner:'Navegação',due:'2026-10-22',state:'em_andamento'},
  {id:'T-003',personId:'SIM-004',title:'Repetir tentativa conforme plano pactuado',owner:'Navegação',due:'2026-10-20',state:'aberta'}
];
const labels: Record<State,string> = { aberta:'Aberta',em_andamento:'Em andamento',aguardando_terceiro:'Aguardando terceiro',resolvida:'Resolvida' };
const nowLocal = () => new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'medium',timeZone:'America/Fortaleza'}).format(new Date());
export default function ConciergeDemo() {
  const [selected,setSelected] = useState('SIM-001');
  const [tasks,setTasks] = useState(initialTasks);
  const [events,setEvents] = useState<Event[]>([]);
  const [contacts,setContacts] = useState<Record<string,string>>({});
  const [topic,setTopic] = useState('');
  const [change,setChange] = useState('nao_avaliado');
  const [note,setNote] = useState('');
  const [owner,setOwner] = useState('Navegação');
  const [due,setDue] = useState('2026-10-21');
  const [error,setError] = useState('');
  const [outcomes,setOutcomes] = useState<Record<string,string>>({});
  const patient = people.find(p=>p.id===selected)!;
  const perTasks = tasks.filter(t=>t.personId===selected);
  const counts = useMemo(()=>({open:tasks.filter(t=>t.state!=='resolvida').length,missed:people.filter(p=>p.reach==='Não localizado').length,review:people.filter(p=>p.reach==='Avaliação profissional pendente').length}),[tasks]);
  function audit(message:string) { setEvents(list=>[{id:Date.now()+Math.random(),at:nowLocal(),text:message},...list]); }
  function contact(outcome:string) {
    setError('');
    if(outcome==='sem_resposta'){
      setContacts(old=>({...old,[selected]:'Contato não realizado · estado atual não avaliado'}));
      audit(patient.id+' · tentativa sem resposta; condição clínica não avaliada');
      return;
    }
    if(!note.trim()){setError('Para registrar o contato, descreva a escuta e o encaminhamento.');return;}
    if(change==='nao_avaliado'){setError('Assinale se houve mudança relatada ou se não foi possível avaliar.');return;}
    setContacts(old=>({...old,[selected]:'Contato realizado · relato documentado em simulação'}));
    audit(patient.id+' · contato demonstrativo · '+(change==='mudou'?'mudança relatada; revisão humana necessária':'sem mudança relatada')+' · '+note.trim().slice(0,160));
    setNote('');
  }
  function createTask(){
    setError('');
    if(!topic.trim() || !owner.trim() || !due){setError('Toda ação precisa de descrição, responsável e prazo.');return;}
    setTasks(list=>[{id:'T-'+(Date.now()),personId:selected,title:topic.trim(),owner:owner.trim(),due,state:'aberta'},...list]);
    audit(patient.id+' · nova ação atribuída a '+owner.trim()+' com prazo '+due);
    setTopic('');
  }
  function changeTask(id:string,value:State){
    if(value==='resolvida'){setError('O fechamento exige desfecho verificável; use o campo de resultado.');return;}
    setTasks(list=>list.map(t=>t.id===id?{...t,state:value}:t));
    audit(patient.id+' · ação '+id+' atualizada: '+labels[value]);
    setError('');
  }
  function closeTask(id:string){
    const outcome=(outcomes[id]||'').trim();
    if(outcome.length<8){setError('Descreva o resultado alcançado antes de concluir (mínimo de 8 caracteres).');return;}
    setTasks(list=>list.map(t=>t.id===id?{...t,state:'resolvida',outcome}:t));
    audit(patient.id+' · ação '+id+' concluída com resultado documentado na simulação');
    setOutcomes(list=>({...list,[id]:''}));
    setError('');
  }
  const future = 'https://business.whatsapp.com/';
  return <div className="concierge">
    <div className="concierge-head"><div><span className="concierge-eyebrow">DIGNARE 360 / NAVEGAÇÃO INTEGRADA</span><h1>Concierge de cuidado</h1><p>Carteira, escuta, ações e histórico em uma jornada demonstrativa.</p></div><strong className="concierge-watermark">AMBIENTE FICTÍCIO · SEM CONEXÃO CLÍNICA</strong></div>
    <div className="concierge-kpis">
      <article><small>Pessoas simuladas</small><strong>{people.length}</strong></article>
      <article><small>Ações pendentes</small><strong>{counts.open}</strong></article>
      <article><small>Contatos sem resposta</small><strong>{counts.missed}</strong></article>
      <article><small>Avaliações pendentes</small><strong>{counts.review}</strong></article>
    </div>
    <div className="concierge-workspace">
      <aside className="concierge-list"><h2>Carteira de acompanhamento</h2><p>Selecione um cenário.</p>{people.map(p=><button type="button" key={p.id} className={selected===p.id?'selected':''} onClick={()=>{setSelected(p.id);setError('');setNote('');setChange('nao_avaliado')}}><strong>{p.label}</strong><small>{p.program} · próximo: {p.next}</small><span>{contacts[p.id]||p.reach}</span></button>)}</aside>
      <div className="concierge-main">
        <section className="concierge-section">
          <div className="concierge-row"><div><small>{patient.id} · {patient.program}</small><h2>{patient.label}</h2></div><span className="concierge-pill">{patient.contact}</span></div>
          <div className="concierge-facts"><div><small>Referência de acompanhamento</small><p>{patient.baseline}</p></div><div><small>Prioridade expressa</small><p>{patient.emphasis}</p></div><div><small>Último contato</small><p>{patient.last}</p></div><div><small>Próximo contato</small><p>{patient.next}</p></div></div>
          <p className="concierge-warning">Simulação: não existe PAD, consentimento real ou dado de paciente nesta tela. O registro assistencial verdadeiro pertence ao prontuário oficial. Qualquer prioridade clínica deve ser classificada por profissional conforme o protocolo aplicável. Em emergência real: SAMU 192.</p>
        </section>
        <section className="concierge-section"><div className="concierge-row"><h2>Registrar contato</h2><span className="concierge-pill">Escuta humana</span></div>
          <label>Resultado da avaliação do estado relatado<select value={change} onChange={e=>setChange(e.target.value)}><option value="nao_avaliado">Não avaliado</option><option value="sem_mudanca">Sem mudança relatada</option><option value="mudou">Mudança relatada — encaminhar à revisão humana</option></select></label>
          <label>Escuta, prioridades e encaminhamento<textarea rows={3} value={note} onChange={e=>setNote(e.target.value)} placeholder="Somente texto fictício. Não inserir dados identificáveis." /></label>
          <div className="concierge-actions"><button type="button" onClick={()=>contact('realizado')}>Registrar contato simulado</button><button type="button" className="concierge-secondary" onClick={()=>contact('sem_resposta')}>Registrar tentativa sem resposta</button></div>
          {contacts[selected]&&<p className="concierge-feedback">{contacts[selected]}</p>}
        </section>
        <section className="concierge-section"><h2>Ações e pendências</h2>{perTasks.length===0&&<p>Sem ação cadastrada neste cenário.</p>}
          {perTasks.map(t=><article className="concierge-task" key={t.id}><div><strong>{t.title}</strong><small>{t.owner} · prazo {t.due} · {t.id}</small>{t.outcome&&<small>Resultado: {t.outcome}</small>}</div><div className="concierge-actions"><select aria-label={'Estado da ação '+t.id} value={t.state} disabled={t.state==='resolvida'} onChange={e=>changeTask(t.id,e.target.value as State)}>{Object.entries(labels).filter(([v])=>v!=='resolvida'||t.state==='resolvida').map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>{t.state!=='resolvida'&&<><input aria-label={'Resultado alcançado para ação '+t.id} value={outcomes[t.id]||''} maxLength={500} placeholder="Descreva o resultado verificável" onChange={e=>setOutcomes(list=>({...list,[t.id]:e.target.value}))}/><button type="button" onClick={()=>closeTask(t.id)}>Concluir com resultado</button></>}</div></article>)}
          <h3>Nova ação</h3><label>O que deve ser resolvido?<input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Ex.: confirmar retorno da equipe" /></label><div className="concierge-two"><label>Responsável<input value={owner} onChange={e=>setOwner(e.target.value)}/></label><label>Prazo<input type="date" value={due} onChange={e=>setDue(e.target.value)}/></label></div><button type="button" onClick={createTask}>Adicionar ação</button>
        </section>
        <section className="concierge-section"><h2>Comunicação e inteligência</h2><div className="concierge-facts"><div><small>WhatsApp</small><p>Integração simulada, sem envio ou webhook.</p></div><div><small>Power BI</small><p>Indicadores locais de demonstração; sem publicação de dados.</p></div></div><small>Preparação técnica: <a href={future} target="_blank" rel="noreferrer">WhatsApp Business Platform</a>. A futura integração exigirá autorização, privacidade e fluxo de retaguarda.</small></section>
        <section className="concierge-section"><h2>Histórico da sessão (não persistente)</h2><p>Eventos abaixo são gerados nesta sessão para avaliação da experiência. Não constituem trilha de auditoria clínica.</p>{events.filter(e=>e.text.startsWith(selected)).length===0?<small>Nenhum evento nesta sessão para este cenário.</small>:events.filter(e=>e.text.startsWith(selected)).map(e=><div className="concierge-event" key={e.id}><time>{e.at}</time><p>{e.text}</p></div>)}</section>
        {error&&<p role="alert" className="concierge-error">{error}</p>}
      </div>
    </div>
    <style jsx>{`
      .concierge{--blue:#1B4F72;--accent:#2E86C1;--cream:#FAF7F2;--ink:#2E2E2E;color:var(--ink);display:grid;gap:18px;max-width:1460px;margin:auto}
      .concierge-head{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;flex-wrap:wrap}.concierge h1{font-size:clamp(1.8rem,3vw,2.6rem);color:var(--blue);margin:6px 0}.concierge h2{font-size:1.08rem;margin:0 0 10px}.concierge h3{font-size:1rem;margin:22px 0 8px}.concierge p{line-height:1.5}.concierge-eyebrow{color:var(--blue);letter-spacing:.13em;font-size:.72rem;font-weight:750}.concierge-watermark{background:#fff3e9;color:#94502f;border:1px solid #d9b29b;border-radius:6px;padding:10px;font-size:.72rem}
      .concierge-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.concierge-kpis article,.concierge-section,.concierge-list{padding:20px;border:1px solid #d6e1e8;border-radius:10px;background:#fff}.concierge-kpis small{display:block;color:#596c79}.concierge-kpis strong{display:block;font-size:1.9rem;color:var(--blue);margin-top:8px}
      .concierge-workspace{display:grid;grid-template-columns:minmax(225px,295px) minmax(0,1fr);gap:14px;align-items:start}.concierge-list{display:grid;gap:9px}.concierge-list p{margin:0 0 7px;color:#596c79;font-size:.87rem}.concierge-list button{display:grid;text-align:left;gap:7px;border:1px solid #dce5ea;background:#fff;border-radius:8px;padding:12px;color:var(--ink)}.concierge-list button.selected{background:#eff6fa;border-color:var(--accent);box-shadow:inset 3px 0 var(--accent)}.concierge-list small,.concierge-list span{font-size:.76rem;color:#60727e}.concierge-main{display:grid;gap:14px;min-width:0}.concierge-row{display:flex;align-items:center;justify-content:space-between;gap:15px;flex-wrap:wrap}.concierge-row small{color:#60727e}.concierge-pill{border-radius:100px;border:1px solid #a8c6da;color:var(--blue);padding:5px 12px;font-size:.74rem}.concierge-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:14px 0}.concierge-facts>div{background:var(--cream);padding:13px;border-radius:7px}.concierge-facts small{display:block;color:#596c79;margin-bottom:7px}.concierge-facts p{margin:0;font-weight:600}.concierge-warning{border-left:4px solid #C0603A;background:#fff7ef;padding:12px;font-size:.85rem}.concierge label{display:grid;gap:6px;margin:10px 0;font-size:.87rem;font-weight:600}.concierge input,.concierge textarea,.concierge select{width:100%;border:1px solid #bacbd6;border-radius:7px;background:#fff;color:var(--ink);padding:10px;font:inherit;min-width:0}.concierge button{cursor:pointer}.concierge-actions{display:flex;flex-wrap:wrap;gap:9px;align-items:center}.concierge-actions button,.concierge-section>button{border:0;border-radius:7px;background:var(--blue);color:white;padding:10px 14px;font-weight:700}.concierge-actions .concierge-secondary{background:#eaf3f8;color:var(--blue)}.concierge-task{display:flex;align-items:start;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:13px 0;border-bottom:1px solid #e1e8ed}.concierge-task small{display:block;color:#596c79;margin-top:5px}.concierge-task .concierge-actions{max-width:300px}.concierge-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}.concierge-event{border-left:2px solid #a8c6da;padding:6px 12px;margin-top:10px}.concierge-event p{margin:4px 0}.concierge-event time{color:#596c79;font-size:.78rem}.concierge-error{color:#973e27;border:1px solid #C0603A;padding:12px;border-radius:7px}.concierge-feedback{color:var(--blue);font-weight:650}.concierge a{color:var(--blue)}.concierge button:focus-visible,.concierge input:focus-visible,.concierge select:focus-visible,.concierge textarea:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
      @media(max-width:950px){.concierge-workspace{grid-template-columns:1fr}.concierge-list{grid-template-columns:repeat(2,minmax(0,1fr))}.concierge-list h2,.concierge-list p{grid-column:1/-1}}@media(max-width:620px){.concierge-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.concierge-list{grid-template-columns:1fr}.concierge-facts,.concierge-two{grid-template-columns:1fr}.concierge-kpis article,.concierge-section,.concierge-list{padding:14px}}
    `}</style>
  </div>;
}
