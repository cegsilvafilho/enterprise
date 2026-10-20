import ConciergeDemo from '../../(app)/concierge/ConciergeDemo';

export const metadata = {
  title: 'Dignare 360 | Concierge — Demonstração sintética',
  description: 'Protótipo interativo apenas com cenários fictícios, sem prontuário, autenticação ou envio de mensagens.',
};

export default function ConciergePublicDemo() {
  // Public DEMO ONLY: this route does not use auth, Prisma, APIs, or real care data.
  // The component uses React state in the current browser tab; nothing is persisted.
  return (
    <main style={{ minHeight: '100vh', background:'#FAF7F2', padding:'clamp(14px, 3vw, 32px)' }}>
      <div style={{maxWidth:1460,margin:'0 auto 18px',padding:'12px 0',fontSize:13,color:'#1B4F72'}}>
        <strong>DIGNARE · LABORATÓRIO DE EXPERIÊNCIA</strong>
        <span style={{marginLeft:12,color:'#596c79'}}>Protótipo interativo · dados exclusivamente fictícios</span>
      </div>
      <ConciergeDemo />
    </main>
  );
}
