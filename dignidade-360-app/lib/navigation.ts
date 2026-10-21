import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAuthorizedUser } from '@/lib/access';
import type { CurrentUser } from '@/lib/access';

export function navigationPersistenceEnabled() {
  const env = process.env.VERCEL_ENV;
  const sandbox = env === 'preview' || (!env && process.env.NODE_ENV === 'development');
  return sandbox &&
    process.env.NAVIGATION_PERSISTENCE_ENABLED === 'true' &&
    process.env.NAVIGATION_DB_VERIFIED === 'true';
}

// Reject browser-initiated cross-origin mutations; no CORS enabled for navigation API.
export function navigationSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; }
  catch { return false; }
}

export async function navigationActor(): Promise<CurrentUser | null> {
  const session = await getServerSession(authOptions);
  const id = (session?.user as {id?:string}|undefined)?.id;
  const user = await getAuthorizedUser(id);
  return user?.role === 'professional' ? user : null;
}

export function navigationBadInput(message: string) {
  return Response.json({error:message},{status:400});
}

export const navigationTaskStatuses = ['open','in_progress','waiting','resolved'] as const;

export function navigationDate(date: unknown): Date | null {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const midday = new Date(date+'T12:00:00Z');
  if (Number.isNaN(midday.getTime()) || midday.toISOString().slice(0,10)!==date) return null;
  // For the initial Fortaleza pilot only; timezone must become organization-specific.
  return new Date(date+'T23:59:59-03:00');
}
