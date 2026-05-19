import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canManageUsers, getCurrentUser } from '@/lib/access';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser || !canManageUsers(currentUser.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const targetPatient = await prisma.patient.findFirst({
    where: {
      id: params.id,
      organizationId: currentUser.organizationId,
    },
  });

  if (!targetPatient) {
    return NextResponse.json({ error: 'Paciente nao encontrado.' }, { status: 404 });
  }

  const data = await request.json();
  const action = String(data.action || '');

  if (action !== 'toggle-active') {
    return NextResponse.json({ error: 'Acao invalida.' }, { status: 400 });
  }

  const patient = await prisma.patient.update({
    where: { id: targetPatient.id },
    data: { active: !targetPatient.active },
  });

  await prisma.audit.create({
    data: {
      organizationId: currentUser.organizationId,
      userId: currentUser.id,
      user: currentUser.name,
      action: patient.active ? 'Ativou paciente' : 'Inativou paciente',
      entity: 'patients',
      detail: patient.name,
    },
  });

  return NextResponse.json({ success: true, patient });
}
