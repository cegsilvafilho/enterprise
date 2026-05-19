import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getCurrentUser } from '@/lib/access';
import ChangePasswordForm from './ChangePasswordForm';

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser) {
    redirect('/login');
  }

  if (!currentUser.mustChangePassword) {
    redirect('/dashboard');
  }

  return (
    <main className="account-shell">
      <section className="panel account-panel">
        <div className="brand">
          <div className="brand-mark">360</div>
          <div>
            <strong>Dignidade</strong>
            <small>Primeiro acesso</small>
          </div>
        </div>
        <h1>Defina sua nova senha</h1>
        <p>Antes de continuar, troque a senha inicial recebida no cadastro.</p>
        <ChangePasswordForm />
      </section>
    </main>
  );
}
