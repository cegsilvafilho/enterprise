import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canAccessPatient, canResolveAlerts, getCurrentUser } from '@/lib/access';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser || !canResolveAlerts(currentUser.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const data = await request.json();
  const alert = await prisma.alert.findUnique({ where: { id: params.id } });

  if (!alert || !(await canAccessPatient(currentUser, alert.patientId))) {
    return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
  }

  const conduct = await prisma.conduct.create({
    data: {
      patientId: alert.patientId,
      alertId: alert.id,
      type: data.type,
      description: data.description,
      author: currentUser.name,
    },
  });

  await prisma.alert.update({
    where: { id: params.id },
    data: { status: 'resolved', outcome: data.description, resolvedAt: new Date() },
  });

  await prisma.timelineEvent.create({
    data: {
      patientId: alert.patientId,
      title: `${data.type} registrada`,
      type: 'Conduta',
      description: data.description,
      author: currentUser.name,
    },
  });

  await prisma.audit.create({
    data: {
      organizationId: currentUser.organizationId,
      userId: currentUser.id,
      user: currentUser.name,
      action: 'Resolveu alerta',
      entity: 'alerts',
      detail: alert.title,
    },
  });

  return NextResponse.json({ success: true, conduct });
}
