'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AlertClient({
  initialAlerts,
  canResolve,
}: {
  initialAlerts: any[];
  canResolve: boolean;
}) {
  const [selectedAlertId, setSelectedAlertId] = useState(initialAlerts[0]?.id || null);
  const router = useRouter();
  const selectedAlert = initialAlerts.find((alert) => alert.id === selectedAlertId);
  const [formData, setFormData] = useState({ type: 'Orientacao', description: '' });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedAlert) return;

    const response = await fetch(`/api/alerts/${selectedAlert.id}/resolve`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      setFormData({ type: 'Orientacao', description: '' });
      router.refresh();
      setSelectedAlertId(initialAlerts.filter((alert) => alert.id !== selectedAlert.id)[0]?.id || null);
    }
  };

  return (
    <div className="grid-2 wide-left">
      <section className="panel">
        <header className="panel-head">
          <h2>Alertas Ativos</h2>
        </header>
        <div className="card-list">
          {initialAlerts.length === 0 && <p>Nenhum alerta aberto no momento.</p>}
          {initialAlerts.map((alert) => (
            <article
              key={alert.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedAlertId(alert.id)}
              style={{ cursor: 'pointer', background: selectedAlertId === alert.id ? '#eef4f0' : '' }}
            >
              <div>
                <strong>{alert.title}</strong>
                <span>
                  {alert.patient.name} - {alert.severity === 'critical' ? 'Critica' : 'Moderada'}
                </span>
              </div>
              <span className={`pill ${alert.severity === 'critical' ? 'critical' : 'warning'}`}>
                {alert.severity}
              </span>
            </article>
          ))}
        </div>
      </section>

      {selectedAlert && (
        <section className="panel">
          <header className="panel-head">
            <h2>Detalhes do Alerta</h2>
            <span className="pill warning">{selectedAlert.status}</span>
          </header>
          <div className="detail">
            <article>
              <span>Paciente</span>
              <strong>{selectedAlert.patient.name}</strong>
            </article>
            <article>
              <span>Gravidade</span>
              <strong>{selectedAlert.severity}</strong>
            </article>
            <article>
              <span>Responsavel</span>
              <strong>{selectedAlert.responsible}</strong>
            </article>
            <article>
              <span>Descricao</span>
              <strong>{selectedAlert.description}</strong>
            </article>
          </div>

          {canResolve ? (
            <>
              <h2 style={{ marginTop: '20px', marginBottom: '10px' }}>Registrar Conduta</h2>
              <form className="form" onSubmit={handleSubmit}>
                <label>
                  Tipo de Conduta
                  <select value={formData.type} onChange={(event) => setFormData({ ...formData, type: event.target.value })}>
                    <option>Orientacao</option>
                    <option>Ajuste de prescricao</option>
                    <option>Acionamento de emergencia</option>
                    <option>Reuniao familiar</option>
                  </select>
                </label>
                <label>
                  Descricao
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                  />
                </label>
                <button type="submit" className="primary">
                  Resolver Alerta
                </button>
              </form>
            </>
          ) : (
            <div className="notice readonly-note">
              <span>Seu perfil pode acompanhar a fila, mas nao resolver alertas clinicos.</span>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
