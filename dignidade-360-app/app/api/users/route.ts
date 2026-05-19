import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { appRoles, canManageUsers, getCurrentUser, isAppRole } from '@/lib/access';
import { validatePassword } from '@/lib/password';

export async function GET() {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser || !canManageUsers(currentUser.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { organizationId: currentUser.organizationId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      mustChangePassword: true,
      failedLoginAttempts: true,
      lockedUntil: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser || !canManageUsers(currentUser.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const data = await request.json();
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim().toLowerCase();
  const role = String(data.role || '').trim();
  const password = String(data.password || '');
  const passwordValidation = validatePassword(password);

  if (!name || !email || !isAppRole(role) || !passwordValidation.valid) {
    return NextResponse.json(
      { error: `Informe nome, email, perfil valido. ${passwordValidation.message}` },
      { status: 400 },
    );
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: 'Ja existe um usuario com este email.' }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      organizationId: currentUser.organizationId,
      name,
      email,
      role,
      password: await bcrypt.hash(password, 10),
      mustChangePassword: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
    },
  });

  await prisma.audit.create({
    data: {
      organizationId: currentUser.organizationId,
      userId: currentUser.id,
      user: currentUser.name,
      action: 'Criou usuario',
      entity: 'users',
      detail: `${user.name} (${user.role})`,
    },
  });

  return NextResponse.json({ success: true, user, availableRoles: appRoles });
}
