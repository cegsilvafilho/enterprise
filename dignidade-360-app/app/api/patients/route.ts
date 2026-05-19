import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canManageUsers, getAccessiblePatients, getCurrentUser } from '@/lib/access';

export async function GET() {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const patients = await getAccessiblePatients(currentUser);

  return NextResponse.json({ patients });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser || !canManageUsers(currentUser.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const data = await request.json();
  const name = String(data.name || '').trim();
  const age = Number(data.age);
  const condition = String(data.condition || '').trim();
  const unit = String(data.unit || '').trim();
  const careLine = String(data.careLine || '').trim();
  const portalUserId = data.portalUserId ? String(data.portalUserId) : undefined;
  const caregiverUserId = data.caregiverUserId ? String(data.caregiverUserId) : undefined;
  const professionalUserId = data.professionalUserId ? String(data.professionalUserId) : undefined;

  if (!name || !Number.isFinite(age) || age <= 0 || !condition || !unit || !careLine) {
    return NextResponse.json(
      { error: 'Preencha nome, idade, condicao, unidade e linha de cuidado.' },
      { status: 400 },
    );
  }

  const linkedUserIds = [portalUserId, caregiverUserId, professionalUserId].filter(Boolean) as string[];
  const users = linkedUserIds.length
    ? await prisma.user.findMany({
        where: {
          organizationId: currentUser.organizationId,
          id: { in: linkedUserIds },
        },
      })
    : [];

  const portalUser = users.find((user) => user.id === portalUserId);
  const caregiverUser = users.find((user) => user.id === caregiverUserId);
  const professionalUser = users.find((user) => user.id === professionalUserId);

  if (portalUserId && portalUser?.role !== 'patient') {
    return NextResponse.json({ error: 'A conta de portal precisa ser de um paciente.' }, { status: 400 });
  }

  if (portalUserId) {
    const linkedPatient = await prisma.patient.findUnique({
      where: { portalUserId },
      select: { id: true },
    });

    if (linkedPatient) {
      return NextResponse.json({ error: 'Esta conta de paciente ja esta vinculada.' }, { status: 409 });
    }
  }

  if (caregiverUserId && caregiverUser?.role !== 'caregiver') {
    return NextResponse.json({ error: 'O cuidador selecionado precisa ter perfil caregiver.' }, { status: 400 });
  }

  if (professionalUserId && professionalUser?.role !== 'professional') {
    return NextResponse.json({ error: 'O profissional selecionado precisa ter perfil professional.' }, { status: 400 });
  }

  const patient = await prisma.patient.create({
    data: {
      organizationId: currentUser.organizationId,
      portalUserId,
      name,
      age,
      condition,
      unit,
      careLine,
      caregiverName: caregiverUser?.name,
      professionalName: professionalUser?.name,
      goal: data.goal ? String(data.goal) : undefined,
      preference: data.preference ? String(data.preference) : undefined,
    },
  });

  if (caregiverUser) {
    await prisma.caregiverGrant.create({
      data: {
        patientId: patient.id,
        userId: caregiverUser.id,
      },
    });
  }

  if (professionalUser) {
    await prisma.patientAssignment.create({
      data: {
        patientId: patient.id,
        userId: professionalUser.id,
        role: 'primary',
      },
    });
  }

  await prisma.audit.create({
    data: {
      organizationId: currentUser.organizationId,
      userId: currentUser.id,
      user: currentUser.name,
      action: 'Criou paciente',
      entity: 'patients',
      detail: patient.name,
    },
  });

  return NextResponse.json({ success: true, patient });
}
