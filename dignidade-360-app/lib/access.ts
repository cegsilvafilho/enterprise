import { prisma } from '@/lib/prisma';

export const appRoles = ['patient', 'caregiver', 'professional', 'manager', 'admin'] as const;
export type AppRole = (typeof appRoles)[number];

export type CurrentUser = {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: AppRole;
  active: boolean;
  mustChangePassword: boolean;
};

export function isAppRole(value: string): value is AppRole {
  return appRoles.includes(value as AppRole);
}

export function canManageUsers(role: AppRole) {
  return role === 'manager' || role === 'admin';
}

export function canResolveAlerts(role: AppRole) {
  return role === 'professional' || role === 'admin';
}

export function canViewQueue(role: AppRole) {
  return role === 'professional' || role === 'manager' || role === 'admin';
}

export function canViewAudit(role: AppRole) {
  return role === 'manager' || role === 'admin';
}

export async function getCurrentUser(userId: string | undefined) {
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      organizationId: true,
      name: true,
      email: true,
      role: true,
      active: true,
      mustChangePassword: true,
    },
  });

  if (!user || !user.active || !isAppRole(user.role)) return null;
  return user as CurrentUser;
}

export async function getAccessiblePatients(user: CurrentUser) {
  if (user.role === 'manager' || user.role === 'admin') {
    return prisma.patient.findMany({
      where: { organizationId: user.organizationId, active: true },
      orderBy: { name: 'asc' },
    });
  }

  if (user.role === 'patient') {
    return prisma.patient.findMany({
      where: {
        organizationId: user.organizationId,
        portalUserId: user.id,
        active: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  if (user.role === 'caregiver') {
    return prisma.patient.findMany({
      where: {
        organizationId: user.organizationId,
        active: true,
        caregiverGrants: {
          some: {
            userId: user.id,
            revokedAt: null,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  return prisma.patient.findMany({
    where: {
      organizationId: user.organizationId,
      active: true,
      assignments: {
        some: {
          userId: user.id,
          active: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}

export async function canAccessPatient(user: CurrentUser, patientId: string) {
  const patient = await prisma.patient.findFirst({
    where: {
      id: patientId,
      organizationId: user.organizationId,
      active: true,
    },
    select: {
      id: true,
      portalUserId: true,
      caregiverGrants: {
        where: { userId: user.id, revokedAt: null },
        select: { id: true },
      },
      assignments: {
        where: { userId: user.id, active: true },
        select: { id: true },
      },
    },
  });

  if (!patient) return false;
  if (user.role === 'manager' || user.role === 'admin') return true;
  if (user.role === 'patient') return patient.portalUserId === user.id;
  if (user.role === 'caregiver') return patient.caregiverGrants.length > 0;
  return patient.assignments.length > 0;
}

export async function getPreferredPatient(user: CurrentUser, requestedPatientId?: string | null) {
  if (requestedPatientId && (await canAccessPatient(user, requestedPatientId))) {
    return prisma.patient.findUnique({ where: { id: requestedPatientId } });
  }

  const patients = await getAccessiblePatients(user);
  return patients[0] ?? null;
}
