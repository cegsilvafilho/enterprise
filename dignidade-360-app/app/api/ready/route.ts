import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const authSecretConfigured = process.env.NODE_ENV !== 'production' || Boolean(process.env.NEXTAUTH_SECRET);
    await prisma.$queryRaw`SELECT 1`;

    if (!authSecretConfigured) {
      return NextResponse.json(
        {
          status: 'not_ready',
          database: 'ok',
          authSecret: 'missing',
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      status: 'ready',
      database: 'ok',
      authSecret: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: 'not_ready',
        database: 'unavailable',
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
