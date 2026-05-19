import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.consent.deleteMany();
  await prisma.audit.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.conduct.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.checkin.deleteMany();
  await prisma.patientAssignment.deleteMany();
  await prisma.caregiverGrant.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.careLine.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const defaultPassword = await bcrypt.hash('Teste123!', 10);

  const organization = await prisma.organization.create({
    data: {
      name: 'Hospital Dignidade',
      slug: 'hospital-dignidade',
    },
  });

  const patientUser = await prisma.user.create({
    data: {
      organizationId: organization.id,
      name: 'Helena Duarte',
      role: 'patient',
      email: 'paciente@teste.com',
      password: defaultPassword,
      mustChangePassword: false,
      passwordChangedAt: new Date(),
    },
  });

  const caregiverUser = await prisma.user.create({
    data: {
      organizationId: organization.id,
      name: 'Maria Lopes',
      role: 'caregiver',
      email: 'cuidador@teste.com',
      password: defaultPassword,
      mustChangePassword: false,
      passwordChangedAt: new Date(),
    },
  });

  const professionalUser = await prisma.user.create({
    data: {
      organizationId: organization.id,
      name: 'Dra. Ana Rocha',
      role: 'professional',
      email: 'prof@teste.com',
      password: defaultPassword,
      mustChangePassword: false,
      passwordChangedAt: new Date(),
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      organizationId: organization.id,
      name: 'Gestor da Operacao',
      role: 'manager',
      email: 'gestor@teste.com',
      password: defaultPassword,
      mustChangePassword: false,
      passwordChangedAt: new Date(),
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      organizationId: organization.id,
      name: 'Admin TI',
      role: 'admin',
      email: 'admin@teste.com',
      password: defaultPassword,
      mustChangePassword: false,
      passwordChangedAt: new Date(),
    },
  });

  const p1 = await prisma.patient.create({
    data: {
      organizationId: organization.id,
      portalUserId: patientUser.id,
      name: 'Helena Duarte',
      age: 78,
      condition: 'Doenca pulmonar avancada',
      unit: 'Atencao domiciliar',
      careLine: 'Doenca pulmonar avancada',
      caregiverName: caregiverUser.name,
      professionalName: professionalUser.name,
      goal: 'Conforto em casa, com reavaliacao ativa e plano de crise acessivel.',
      preference: 'Evitar internacao prolongada quando houver alternativa segura.',
    },
  });

  await prisma.caregiverGrant.create({
    data: {
      patientId: p1.id,
      userId: caregiverUser.id,
    },
  });

  await prisma.patientAssignment.create({
    data: {
      patientId: p1.id,
      userId: professionalUser.id,
      role: 'primary',
    },
  });

  await prisma.patient.createMany({
    data: [
      {
        organizationId: organization.id,
        name: 'Joao Silva',
        age: 82,
        condition: 'Demencia avancada',
        unit: 'Ambulatorio',
        careLine: 'Demencia avancada',
        professionalName: professionalUser.name,
      },
      {
        organizationId: organization.id,
        name: 'Roberto Carlos',
        age: 65,
        condition: 'Oncologia paliativa',
        unit: 'Unidade Norte',
        careLine: 'Oncologia',
        professionalName: professionalUser.name,
      },
    ],
  });

  const patients = await prisma.patient.findMany({
    where: { organizationId: organization.id },
    orderBy: { createdAt: 'asc' },
  });

  for (const patient of patients.slice(1)) {
    await prisma.patientAssignment.create({
      data: {
        patientId: patient.id,
        userId: professionalUser.id,
        role: 'primary',
      },
    });
  }

  await prisma.careLine.createMany({
    data: [
      {
        organizationId: organization.id,
        name: 'Doenca pulmonar avancada',
        criteria: 'Dispneia persistente, reinternacoes',
        sla: 2,
        team: 'Atencao domiciliar',
      },
      {
        organizationId: organization.id,
        name: 'Alta hospitalar responsavel',
        criteria: 'Paciente fragil com necessidade de seguimento',
        sla: 4,
        team: 'Equipe hospitalar',
      },
      {
        organizationId: organization.id,
        name: 'Demencia avancada',
        criteria: 'Declinio funcional, disfagia',
        sla: 8,
        team: 'Ambulatorio paliativo',
      },
    ],
  });

  const checkins = [
    {
      pain: 3,
      breath: 5,
      anxiety: 6,
      fatigue: 5,
      appetite: 4,
      burden: 5,
      sleep: 'Interrompido',
      mobility: 'Precisa de ajuda',
      crisis: false,
      note: 'Dor controlada pela manha.',
      score: 35,
      level: 'moderate',
    },
    {
      pain: 4,
      breath: 6,
      anxiety: 7,
      fatigue: 4,
      appetite: 5,
      burden: 6,
      sleep: 'Interrompido',
      mobility: 'Precisa de ajuda',
      crisis: false,
      note: 'Falta de ar ao caminhar.',
      score: 55,
      level: 'moderate',
    },
    {
      pain: 5,
      breath: 8,
      anxiety: 8,
      fatigue: 6,
      appetite: 3,
      burden: 8,
      sleep: 'Ruim',
      mobility: 'Restrito ao leito',
      crisis: true,
      note: 'Piora importante da falta de ar.',
      score: 85,
      level: 'critical',
    },
  ];

  for (let i = 0; i < checkins.length; i += 1) {
    await prisma.checkin.create({
      data: {
        patientId: p1.id,
        ...checkins[i],
        createdAt: new Date(Date.now() - (3 - i) * 86400000),
      },
    });
  }

  const a1 = await prisma.alert.create({
    data: {
      patientId: p1.id,
      title: 'Falta de ar em piora',
      severity: 'critical',
      status: 'in_progress',
      responsible: professionalUser.name,
      slaMinutes: 120,
      source: 'Check-in',
      description: 'Falta de ar 8/10 e crise relatada. Revisar plano de crise.',
      createdAt: new Date(Date.now() - 82 * 60000),
    },
  });

  await prisma.conduct.create({
    data: {
      patientId: p1.id,
      alertId: a1.id,
      type: 'Orientacao',
      description: 'Revisado posicionamento e sinais de alerta com cuidadora. Reavaliar em 2h.',
      author: professionalUser.name,
      createdAt: new Date(Date.now() - 30 * 60000),
    },
  });

  await prisma.timelineEvent.createMany({
    data: [
      {
        patientId: p1.id,
        title: 'Plano de crise revisado',
        type: 'Plano',
        description: 'Equipe confirmou sinais de alerta.',
        author: 'Dignidade 360',
        createdAt: new Date(Date.now() - 4 * 86400000),
      },
      {
        patientId: p1.id,
        title: 'Check-in enviado',
        type: 'Check-in',
        description: 'Crise relatada.',
        author: patientUser.name,
        createdAt: new Date(Date.now() - 85 * 60000),
      },
      {
        patientId: p1.id,
        title: 'Alerta criado',
        type: 'Alerta',
        description: 'Falta de ar em piora.',
        author: 'Sistema',
        createdAt: new Date(Date.now() - 82 * 60000),
      },
      {
        patientId: p1.id,
        title: 'Conduta registrada',
        type: 'Conduta',
        description: 'Orientacao por telefone.',
        author: professionalUser.name,
        createdAt: new Date(Date.now() - 30 * 60000),
      },
    ],
  });

  await prisma.audit.createMany({
    data: [
      {
        organizationId: organization.id,
        userId: managerUser.id,
        user: managerUser.name,
        action: 'Inicializou ambiente',
        entity: 'organization',
        detail: organization.name,
      },
      {
        organizationId: organization.id,
        userId: adminUser.id,
        user: adminUser.name,
        action: 'Criou usuarios iniciais',
        entity: 'users',
        detail: 'Perfis base do piloto',
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
