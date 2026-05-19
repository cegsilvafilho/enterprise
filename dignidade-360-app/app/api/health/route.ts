import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'dignidade-360-app',
    timestamp: new Date().toISOString(),
  });
}
