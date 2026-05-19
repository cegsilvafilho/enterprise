import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { canViewAudit, getCurrentUser } from '@/lib/access';

function formatDate(value: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

export default async function AuditPage() {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser || !canViewAudit(currentUser.role)) {
    redirect('/dashboard');
  }

  const logs = await prisma.audit.findMany({
    where: { organizationId: currentUser.organizationId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Auditoria</h1>
          <span className="view-kicker">Ultimos 100 eventos da organizacao</span>
        </div>
      </header>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Quando</th>
                <th>Usuario</th>
                <th>Acao</th>
                <th>Entidade</th>
                <th>Detalhe</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{formatDate(log.createdAt)}</td>
                  <td>{log.user}</td>
                  <td>{log.action}</td>
                  <td>{log.entity}</td>
                  <td>{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
