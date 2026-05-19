import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCurrentUser } from '@/lib/access';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const consent = await prisma.consent.create({
    data: {
      organizationId: currentUser.organizationId,
      userId: currentUser.id,
      version: 'v1.0 (LGPD)',
      scopes: 'care-team,caregiver,analytics',
      ipAddress: request.headers.get('x-forwarded-for') || 'local',
    },
  });

  await prisma.audit.create({
    data: {
      organizationId: currentUser.organizationId,
      userId: currentUser.id,
      user: currentUser.name,
      action: 'Aceite de Termos e LGPD',
      entity: 'consents',
      detail: 'Versao v1.0',
    },
  });

  return NextResponse.json({ success: true, consent });
}
