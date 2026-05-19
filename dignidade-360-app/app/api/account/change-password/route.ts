import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/access';
import { validatePassword } from '@/lib/password';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const currentPassword = String(data.currentPassword || '');
  const newPassword = String(data.newPassword || '');
  const passwordValidation = validatePassword(newPassword);

  if (!passwordValidation.valid) {
    return NextResponse.json({ error: passwordValidation.message }, { status: 400 });
  }

  if (currentPassword === newPassword) {
    return NextResponse.json({ error: 'A nova senha precisa ser diferente da senha atual.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: currentUser.id } });
  if (!user) {
    return NextResponse.json({ error: 'Usuario nao encontrado.' }, { status: 404 });
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Senha atual invalida.' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      password: await bcrypt.hash(newPassword, 10),
      mustChangePassword: false,
      failedLoginAttempts: 0,
      lockedUntil: null,
      passwordChangedAt: new Date(),
    },
  });

  await prisma.audit.create({
    data: {
      organizationId: currentUser.organizationId,
      userId: currentUser.id,
      user: currentUser.name,
      action: 'Trocou senha',
      entity: 'users',
      detail: 'Primeiro acesso concluido',
    },
  });

  return NextResponse.json({ success: true });
}
