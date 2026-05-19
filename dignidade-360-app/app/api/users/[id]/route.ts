import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
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

  const targetUser = await prisma.user.findFirst({
    where: {
      id: params.id,
      organizationId: currentUser.organizationId,
    },
  });

  if (!targetUser) {
    return NextResponse.json({ error: 'Usuario nao encontrado.' }, { status: 404 });
  }

  const data = await request.json();
  const action = String(data.action || '');

  if (action === 'toggle-active') {
    if (targetUser.id === currentUser.id) {
      return NextResponse.json({ error: 'Voce nao pode desativar a propria conta.' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: targetUser.id },
      data: { active: !targetUser.active },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        mustChangePassword: true,
      },
    });

    await prisma.audit.create({
      data: {
        organizationId: currentUser.organizationId,
        userId: currentUser.id,
        user: currentUser.name,
        action: user.active ? 'Ativou usuario' : 'Desativou usuario',
        entity: 'users',
        detail: user.name,
      },
    });

    return NextResponse.json({ success: true, user });
  }

  if (action === 'reset-password') {
    const temporaryPassword = `D360-${randomBytes(4).toString('hex')}`;
    const user = await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        password: await bcrypt.hash(temporaryPassword, 10),
        mustChangePassword: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
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
      },
    });

    await prisma.audit.create({
      data: {
        organizationId: currentUser.organizationId,
        userId: currentUser.id,
        user: currentUser.name,
        action: 'Redefiniu senha',
        entity: 'users',
        detail: user.name,
      },
    });

    return NextResponse.json({ success: true, user, temporaryPassword });
  }

  return NextResponse.json({ error: 'Acao invalida.' }, { status: 400 });
}
