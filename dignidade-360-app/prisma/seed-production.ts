import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const organizationSlug = process.env.INITIAL_ORG_SLUG || 'hospital-dignidade';
const organizationName = process.env.INITIAL_ORG_NAME || 'Hospital Dignidade';
const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@dignidade360.com';
const initialPassword = process.env.INITIAL_ADMIN_PASSWORD;
const seedDemoData = process.env.SEED_DEMO_DATA === 'true';

async function ensureUser(params: {
  organizationId: string;
  name: string;
  role: string;
  email: string;
  passwordHash: string;
  mustChangePassword?: boolean;
}) {
  const mustChangePassword = params.mustChangePassword ?? true;
  const existing = await prisma.user.findUnique({
    where: { email: params.email },
  });

  if (existing) {
    if (!mustChangePassword && existing.mustChangePassword) {
      return prisma.user.update({
        where: { id: existing.id },
        data: {
          mustChangePassword: false,
          passwordChangedAt: new Date(),
        },
      });
    }

    return existing;
  }

  return prisma.user.create({
    data: {
      organizationId: params.organizationId,
      name: params.name,
      role: params.role,
      email: params.email,
      password: params.passwordHash,
      mustChangePassword,
      passwordChangedAt: mustChangePassword ? null : new Date(),
    },
  });
}

async function main() {
  if (!initialPassword || initialPassword.length < 10) {
    throw new Error('Configure INITIAL_ADMIN_PASSWORD com pelo menos 10 caracteres antes do deploy.');
  }

  const passwordHash = await bcrypt.hash(initialPassword, 10);

  const organization = await prisma.organization.upsert({
    where: { slug: organizationSlug },
    create: {
      name: organizationName,
      slug: organizationSlug,
    },
    update: {
      name: organizationName,
    },
  });

  await ensureUser({
    organizationId: organization.id,
    name: 'Administrador Dignidade 360',
    role: 'admin',
    email: adminEmail,
    passwordHash,
  });

  if (!seedDemoData) {
    return;
  }

  const manager = await ensureUser({
    organizationId: organization.id,
    name: 'Gestor da Operacao',
    role: 'manager',
    email: 'gestor@teste.com',
    passwordHash,
    mustChangePassword: false,
  });

  const professional = await ensureUser({
    organizationId: organization.id,
    name: 'Dra. Ana Rocha',
    role: 'professional',
    email: 'prof@teste.com',
    passwordHash,
    mustChangePassword: false,
  });

  const caregiver = await ensureUser({
    organizationId: organization.id,
    name: 'Maria Lopes',
    role: 'caregiver',
    email: 'cuidador@teste.com',
    passwordHash,
    mustChangePassword: false,
  });

  const patientUser = await ensureUser({
    organizationId: organization.id,
    name: 'Helena Duarte',
    role: 'patient',
    email: 'paciente@teste.com',
    passwordHash,
    mustChangePassword: false,
  });

  await ensureUser({
    organizationId: organization.id,
    name: 'Admin Demonstracao',
    role: 'admin',
    email: 'admin@teste.com',
    passwordHash,
    mustChangePassword: false,
  });

  const patient = await prisma.patient.upsert({
    where: { portalUserId: patientUser.id },
    create: {
      organizationId: organization.id,
      portalUserId: patientUser.id,
      name: 'Helena Duarte',
      age: 78,
      condition: 'Doenca pulmonar avancada',
      unit: 'Atencao domiciliar',
      careLine: 'Doenca pulmonar avancada',
      caregiverName: caregiver.name,
      professionalName: professional.name,
      goal: 'Conforto em casa, com reavaliacao ativa e plano de crise acessivel.',
      preference: 'Evitar internacao prolongada quando houver alternativa segura.',
    },
    update: {},
  });

  await prisma.caregiverGrant.upsert({
    where: {
      patientId_userId: {
        patientId: patient.id,
        userId: caregiver.id,
      },
    },
    create: {
      patientId: patient.id,
      userId: caregiver.id,
    },
    update: {},
  });

  await prisma.patientAssignment.upsert({
    where: {
      patientId_userId_role: {
        patientId: patient.id,
        userId: professional.id,
        role: 'primary',
      },
    },
    create: {
      patientId: patient.id,
      userId: professional.id,
      role: 'primary',
    },
    update: {},
  });

  const existingCareLine = await prisma.careLine.findFirst({
    where: {
      organizationId: organization.id,
      name: 'Doenca pulmonar avancada',
    },
  });

  if (!existingCareLine) {
    await prisma.careLine.create({
      data: {
        organizationId: organization.id,
        name: 'Doenca pulmonar avancada',
        criteria: 'Dispneia persistente, reinternacoes e necessidade de plano de crise.',
        sla: 2,
        team: 'Atencao domiciliar',
      },
    });
  }

  await prisma.audit.create({
    data: {
      organizationId: organization.id,
      userId: manager.id,
      user: manager.name,
      action: 'production_seed_ready',
      entity: 'System',
      detail: 'Dados iniciais de validacao criados sem sobrescrever usuarios existentes.',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
