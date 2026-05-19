import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getCurrentUser, getPreferredPatient } from '@/lib/access';

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams?: { patientId?: string };
}) {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser) {
    redirect('/login');
  }

  const preferredPatient = await getPreferredPatient(currentUser, searchParams?.patientId);

  if (!preferredPatient) {
    return (
      <section className="panel empty-state">
        <h1>Nenhum paciente disponivel</h1>
        <p>Este usuario ainda nao possui paciente vinculado.</p>
      </section>
    );
  }

  const patient = await prisma.patient.findUnique({
    where: { id: preferredPatient.id },
    include: {
      checkins: { orderBy: { createdAt: 'desc' }, take: 1 },
      alerts: { where: { status: { not: 'resolved' } } },
      timeline: { orderBy: { createdAt: 'desc' }, take: 8 },
    },
  });

  if (!patient) {
    return <div>Carregando paciente...</div>;
  }

  const latestCheckin = patient.checkins[0];
  const riskLabel = latestCheckin
    ? latestCheckin.level === 'critical'
      ? 'Critica'
      : latestCheckin.level === 'high'
        ? 'Alta'
        : latestCheckin.level === 'moderate'
          ? 'Moderada'
          : 'Baixa'
    : 'N/A';
  const riskScore = latestCheckin ? latestCheckin.score : 0;
  const criticalAlertsCount = patient.alerts.filter((alert) => alert.severity === 'critical').length;

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Paciente 360</h1>
          <span className="view-kicker">Visao geral do cuidado</span>
        </div>
      </header>

      <section className="metrics" id="overviewMetrics">
        <article className="metric">
          <span>Paciente</span>
          <strong>{patient.name}</strong>
          <small>
            {patient.condition} - {patient.unit}
          </small>
        </article>
        <article className="metric">
          <span>Prioridade atual</span>
          <strong>{riskLabel}</strong>
          <small>Escore {riskScore}/100</small>
        </article>
        <article className="metric">
          <span>Alertas abertos</span>
          <strong>{patient.alerts.length}</strong>
          <small>{criticalAlertsCount} criticos</small>
        </article>
        <article className="metric">
          <span>Plano de crise</span>
          <strong>{patient.goal ? 'Ativo' : 'Pendente'}</strong>
          <small>{patient.careLine}</small>
        </article>
      </section>

      <div className="grid-2 wide-left">
        <section className="panel">
          <header className="panel-head">
            <h2>Timeline Longitudinal</h2>
            <span className="pill" id="timelineCount">
              {patient.timeline.length} eventos
            </span>
          </header>
          <div className="timeline" id="timeline">
            {patient.timeline.map((event) => (
              <article key={event.id}>
                <div>
                  <strong>{event.title}</strong>
                  <span>
                    {event.type} - {event.description}
                  </span>
                </div>
                <span className="pill">{formatDate(event.createdAt)}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <header className="panel-head">
            <h2>Plano de cuidado</h2>
          </header>
          <div className="plan-box" id="carePlan">
            <article>
              <span>Objetivo</span>
              <strong>{patient.goal || 'Ainda nao definido'}</strong>
            </article>
            <article>
              <span>Preferencia</span>
              <strong>{patient.preference || 'Ainda nao definida'}</strong>
            </article>
            <article>
              <span>Cuidador autorizado</span>
              <strong>{patient.caregiverName || 'Nao informado'}</strong>
            </article>
            <article>
              <span>Profissional responsavel</span>
              <strong>{patient.professionalName || 'Nao informado'}</strong>
            </article>
          </div>
        </section>
      </div>
    </>
  );
}
