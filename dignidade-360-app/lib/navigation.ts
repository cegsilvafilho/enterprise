import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAuthorizedUser } from '@/lib/access';
import type { CurrentUser } from '@/lib/access';
import { navigationPersistenceAllowed, canWriteNavigation, parseNavigationDate } from './navigation-policy';

export function navigationPersistenceEnabled() {
  return navigationPersistenceAllowed({
    vercelEnv:process.env.VERCEL_ENV,nodeEnv:process.env.NODE_ENV,
    enabled:process.env.NAVIGATION_PERSISTENCE_ENABLED,
    dbVerified:process.env.NAVIGATION_DB_VERIFIED
  });
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
  return user && canWriteNavigation(user.role) ? user : null;
}

export function navigationBadInput(message: string) {
  return Response.json({error:message},{status:400});
}

export const navigationTaskStatuses = ['open','in_progress','waiting','resolved'] as const;

export function navigationDate(value:unknown){return parseNavigationDate(value);}
