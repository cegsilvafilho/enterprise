'use client';

import { useState } from 'react';

export default function ConsentPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/consent', { method: 'POST', body: JSON.stringify({}) });
    setSaved(true);
    setLoading(false);
  }

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Consentimentos</h1>
          <span className="view-kicker">Governança e Permissões (LGPD)</span>
        </div>
      </header>
      
      <section className="panel">
        <form className="form" onSubmit={handleSubmit}>
          <div className="notice" style={{ marginBottom: '20px' }}>
            <span>Ao salvar, seu consentimento e IP serão registrados de forma imutável no banco de dados.</span>
          </div>

          <label className="checkline">
            <input type="checkbox" defaultChecked />
            <div>
              <strong>Compartilhamento com a equipe de cuidado</strong>
              <span>Permito que médicos e enfermeiros acessem meus registros e sintomas.</span>
            </div>
          </label>
          <label className="checkline">
            <input type="checkbox" defaultChecked />
            <div>
              <strong>Acesso do cuidador familiar</strong>
              <span>Autorizo o compartilhamento seguro para cuidadores registrados.</span>
            </div>
          </label>
          <label className="checkline">
            <input type="checkbox" />
            <div>
              <strong>Dados anonimizados para analytics</strong>
              <span>Autorizo o uso de dados sem identificação para melhoria contínua da instituição.</span>
            </div>
          </label>

          <div className="actions" style={{ marginTop: '20px' }}>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Salvando...' : saved ? 'Permissões Salvas ✓' : 'Salvar Permissões'}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
