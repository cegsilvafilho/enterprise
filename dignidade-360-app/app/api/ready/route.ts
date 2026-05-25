import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        {
          status: 503,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        },
      );
    }

    return NextResponse.json(
      {
        status: 'ready',
        database: 'ok',
        authSecret: 'ok',
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  } catch {
    return NextResponse.json(
      {
        status: 'not_ready',
        database: 'unavailable',
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }
}
