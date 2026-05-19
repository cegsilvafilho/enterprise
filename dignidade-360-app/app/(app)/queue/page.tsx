import { prisma } from '@/lib/prisma';
import AlertClient from './AlertClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { canResolveAlerts, canViewQueue, getAccessiblePatients, getCurrentUser } from '@/lib/access';

export default async function QueuePage() {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser || !canViewQueue(currentUser.role)) {
    redirect('/dashboard');
  }

  const patients = await getAccessiblePatients(currentUser);
  const patientIds = patients.map((patient) => patient.id);
  const alerts = await prisma.alert.findMany({
    where: {
      patientId: { in: patientIds },
      status: { not: 'resolved' },
    },
    include: { patient: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Fila Assistencial</h1>
          <span className="view-kicker">Gestao de prioridades</span>
        </div>
      </header>

      <AlertClient initialAlerts={alerts} canResolve={canResolveAlerts(currentUser.role)} />
    </>
  );
}
