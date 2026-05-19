import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { canManageUsers, getCurrentUser } from '@/lib/access';
import ManagerClient from './ManagerClient';

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

export default async function ManagerPage() {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser || !canManageUsers(currentUser.role)) {
    redirect('/dashboard');
  }

  const [patientsCount, openAlertsCount, lines, auditLogs, users, patients] = await Promise.all([
    prisma.patient.count({ where: { organizationId: currentUser.organizationId, active: true } }),
    prisma.alert.count({
      where: {
        status: { not: 'resolved' },
        patient: { organizationId: currentUser.organizationId },
      },
    }),
    prisma.careLine.findMany({
      where: { organizationId: currentUser.organizationId },
      orderBy: { name: 'asc' },
    }),
    prisma.audit.findMany({
      where: { organizationId: currentUser.organizationId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.user.findMany({
      where: { organizationId: currentUser.organizationId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        mustChangePassword: true,
        lockedUntil: true,
        lastLoginAt: true,
      },
      orderBy: { name: 'asc' },
    }),
    prisma.patient.findMany({
      where: { organizationId: currentUser.organizationId },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Gestao Operacional</h1>
          <span className="view-kicker">Indicadores, usuarios e pacientes</span>
        </div>
      </header>

      <section className="metrics">
        <article className="metric">
          <span>Pacientes ativos</span>
          <strong>{patientsCount}</strong>
          <small>Total cadastrado</small>
        </article>
        <article className="metric">
          <span>Alertas abertos</span>
          <strong>{openAlertsCount}</strong>
          <small>Na fila assistencial</small>
        </article>
        <article className="metric">
          <span>Usuarios ativos</span>
          <strong>{users.filter((user) => user.active).length}</strong>
          <small>Na organizacao</small>
        </article>
        <article className="metric">
          <span>Linhas de cuidado</span>
          <strong>{lines.length}</strong>
          <small>Configuradas</small>
        </article>
      </section>

      <ManagerClient
        users={users.map((user) => ({
          ...user,
          lockedUntil: user.lockedUntil?.toISOString() || null,
          lastLoginAt: user.lastLoginAt?.toISOString() || null,
        }))}
        patients={patients}
        careLines={lines}
      />

      <div className="grid-2 manager-grid">
        <section className="panel">
          <header className="panel-head">
            <h2>Linhas de Cuidado</h2>
          </header>
          <div className="card-list">
            {lines.map((line) => (
              <article key={line.id}>
                <div>
                  <strong>{line.name}</strong>
                  <span>{line.criteria}</span>
                </div>
                <span className="pill">SLA {line.sla}h</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <header className="panel-head">
            <h2>Ultimas Auditorias</h2>
          </header>
          <div className="card-list">
            {auditLogs.map((log) => (
              <article key={log.id}>
                <div>
                  <strong>{log.action}</strong>
                  <span>
                    {log.user} - {log.entity} - {log.detail}
                  </span>
                </div>
                <span className="pill">{formatDate(log.createdAt)}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
