import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getCurrentUser } from '@/lib/access';
import ConciergeDemo from './ConciergeDemo';

export default async function ConciergePage() {
  const session = await getServerSession(authOptions);
  const actor = await getCurrentUser((session?.user as { id?: string } | undefined)?.id);
  if (!actor) redirect('/login');
  if (!['professional', 'manager', 'admin'].includes(actor.role)) redirect('/dashboard');
  if (actor.mustChangePassword) redirect('/change-password');
  // No real patient query: this workspace is a synthetic training prototype only.
  return <ConciergeDemo />;
}
