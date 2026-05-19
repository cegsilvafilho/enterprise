import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canAccessPatient, getCurrentUser, getPreferredPatient } from '@/lib/access';

function calculatePriority(checkin: any) {
  const appetitePenalty = Math.max(0, 10 - Number(checkin.appetite || 0)) * 2;
  const sleepPenalty = checkin.sleep === 'Ruim' ? 10 : checkin.sleep === 'Interrompido' ? 5 : 0;
  const mobilityPenalty = checkin.mobility === 'Restrito ao leito' ? 12 : checkin.mobility === 'Precisa de ajuda' ? 5 : 0;
  const crisisPenalty = checkin.crisis ? 32 : 0;
  const score = Math.min(
    100,
    Math.round(
      Number(checkin.pain || 0) * 5.7 +
        Number(checkin.breath || 0) * 6.5 +
        Number(checkin.anxiety || 0) * 3.4 +
        Number(checkin.fatigue || 0) * 3.2 +
        Number(checkin.burden || 0) * 3.1 +
        appetitePenalty +
        sleepPenalty +
        mobilityPenalty +
        crisisPenalty,
    ),
  );

  if (score >= 80 || checkin.crisis) return { level: 'critical', label: 'Critica', score };
  if (score >= 60) return { level: 'high', label: 'Alta', score };
  if (score >= 35) return { level: 'moderate', label: 'Moderada', score };
  return { level: 'low', label: 'Baixa', score };
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  if (data.patientId && !(await canAccessPatient(currentUser, data.patientId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const patient = data.patientId
    ? await prisma.patient.findUnique({ where: { id: data.patientId } })
    : await getPreferredPatient(currentUser);

  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  const risk = calculatePriority(data);

  await prisma.checkin.create({
    data: {
      patientId: patient.id,
      pain: Number(data.pain),
      breath: Number(data.breath),
      anxiety: Number(data.anxiety),
      fatigue: Number(data.fatigue),
      appetite: Number(data.appetite),
      burden: Number(data.burden),
      sleep: data.sleep,
      mobility: data.mobility,
      crisis: Boolean(data.crisis),
      note: data.note,
      score: risk.score,
      level: risk.level,
    },
  });

  await prisma.timelineEvent.create({
    data: {
      patientId: patient.id,
      title: `Check-in ${risk.label}`,
      type: 'Check-in',
      description: data.note || `Escore ${risk.score}/100`,
      author: currentUser.name,
    },
  });

  await prisma.audit.create({
    data: {
      organizationId: currentUser.organizationId,
      userId: currentUser.id,
      user: currentUser.name,
      action: 'Registrou check-in',
      entity: 'checkins',
      detail: `${patient.name} - prioridade ${risk.label}`,
    },
  });

  if (risk.level !== 'low') {
    const sla = risk.level === 'critical' ? 30 : risk.level === 'high' ? 120 : 1440;
    const alert = await prisma.alert.create({
      data: {
        patientId: patient.id,
        title: risk.level === 'critical' ? 'Crise ou sofrimento intenso' : 'Check-in requer acompanhamento',
        severity: risk.level,
        status: 'new',
        responsible: patient.professionalName || 'Equipe assistencial',
        slaMinutes: sla,
        source: 'Check-in',
        description: `Dor ${data.pain}/10, falta de ar ${data.breath}/10, ansiedade ${data.anxiety}/10, fadiga ${data.fatigue}/10.`,
      },
    });

    await prisma.timelineEvent.create({
      data: {
        patientId: patient.id,
        title: alert.title,
        type: 'Alerta',
        description: alert.description,
        author: 'Sistema',
      },
    });

    await prisma.audit.create({
      data: {
        organizationId: currentUser.organizationId,
        user: 'Sistema',
        action: 'Criou alerta',
        entity: 'alerts',
        detail: `${patient.name} - ${alert.title}`,
      },
    });
  }

  return NextResponse.json({ success: true, risk, patientId: patient.id });
}
