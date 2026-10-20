import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { canAccessPatient, getAuthorizedUser, getPreferredPatient } from '@/lib/access';

const fields = ['pain','breath','anxiety','fatigue','appetite','burden'] as const;
const sleepOptions = new Set(['Normal','Interrompido','Ruim']);
const mobilityOptions = new Set(['Independente','Precisa de ajuda','Restrito ao leito']);

function parseScale(value: unknown): number | null {
  if (value === '' || value === null || value === undefined) return null;
  const n = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN;
  return Number.isInteger(n) && n >= 0 && n <= 10 ? n : null;
}

// IMPORTANT: these are patient-reported observations, NOT a validated clinical risk score.
// Clinical severity and event priority must be determined by an authorized professional.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const currentUser = await getAuthorizedUser((session?.user as {id?:string}|undefined)?.id);

  if (!currentUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (currentUser.role !== 'patient' && currentUser.role !== 'caregiver') {
    return NextResponse.json({ error: 'Este formulário é reservado a relato de paciente ou cuidador autorizado.' }, { status: 403 });
  }

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return NextResponse.json({ error: 'Estrutura inválida.' }, { status: 400 });
  }

  const observed = {} as Record<typeof fields[number],number>;
  for (const field of fields) {
    const n = parseScale(data[field]);
    if (n === null) return NextResponse.json({ error: 'Escala inválida: '+field+' (0 a 10).' }, { status: 400 });
    observed[field] = n;
  }
  if (!sleepOptions.has(String(data.sleep)) || !mobilityOptions.has(String(data.mobility))) {
    return NextResponse.json({ error: 'Escolhas de sono ou mobilidade inválidas.' }, { status: 400 });
  }
  if (typeof data.crisis !== 'boolean') {
    return NextResponse.json({ error: 'O campo de percepção de sinais de alerta deve ser booleano.' }, { status: 400 });
  }
  if (data.note !== undefined && (typeof data.note !== 'string' || data.note.length > 2000)) {
    return NextResponse.json({ error: 'Observação inválida ou longa demais.' }, { status: 400 });
  }
  const note = typeof data.note === 'string' ? data.note.trim() : '';
  const requestedPatientId = data.patientId === undefined ? undefined : data.patientId;
  if (requestedPatientId !== undefined && (typeof requestedPatientId !== 'string' || requestedPatientId.length > 128)) {
    return NextResponse.json({ error: 'Identificador de paciente inválido.' }, { status: 400 });
  }
  if (requestedPatientId && !(await canAccessPatient(currentUser, requestedPatientId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const patient = requestedPatientId
    ? await prisma.patient.findFirst({where:{id:requestedPatientId,organizationId:currentUser.organizationId,active:true}})
    : await getPreferredPatient(currentUser);

  if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

  // No automated clinical prioritization or urgency SLA. This event only requests human review.
  await prisma.$transaction(async (tx) => {
    await tx.checkin.create({
      data: {
        patientId: patient.id,
        pain: observed.pain,
        breath: observed.breath,
        anxiety: observed.anxiety,
        fatigue: observed.fatigue,
        appetite: observed.appetite,
        burden: observed.burden,
        sleep: String(data.sleep),
        mobility: String(data.mobility),
        crisis: data.crisis as boolean,
        note,
        score: 0, // Legacy non-null DB field: nullability migration is a release prerequisite.
        level: 'unclassified',
      },
    });
    await tx.timelineEvent.create({
      data: {
        patientId: patient.id,
        title: 'Relato recebido — aguardando avaliação humana',
        type: 'Check-in não classificado',
        description: note || 'Relato recebido, sem cálculo de risco ou conclusão clínica.',
        author: currentUser.name,
      },
    });
    await tx.alert.create({
      data: {
        patientId: patient.id,
        title: 'Novo relato: revisão humana pendente',
        severity: 'unclassified',
        status: 'new',
        responsible: 'A atribuir pela equipe',
        slaMinutes: 0, // No automatic SLA; not a promise of response.
        source: 'Relato de paciente/cuidador — sem triagem automática',
        description: 'Relato recebido; a equipe deverá avaliar no fluxo assistencial autorizado.',
      },
    });
    await tx.audit.create({
      data: {
        organizationId: currentUser.organizationId,
        userId: currentUser.id,
        user: currentUser.name,
        action: 'Registrou relato nao classificado',
        entity: 'checkins',
        detail: 'Registro recebido para avaliação humana — '+patient.id,
      },
    });
  });

  return NextResponse.json({success:true, status:'pending_human_review', clinicalRiskClassified:false, patientId:patient.id});
}
