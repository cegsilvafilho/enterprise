'use client';

import { FormEvent, useState } from 'react';
import { Activity, BarChart, HeartHandshake, Settings, ShieldCheck, UserRound } from 'lucide-react';
import { signIn } from 'next-auth/react';

const demoLoginToken = '__dignidade360_demo_login__';
const demoLoginEnabled =
  process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_DEMO_LOGIN_ENABLED === 'true';

const demoUsers = [
  { email: 'paciente@teste.com', label: 'Paciente', icon: Activity },
  { email: 'cuidador@teste.com', label: 'Cuidador', icon: HeartHandshake },
  { email: 'prof@teste.com', label: 'Profissional', icon: UserRound },
  { email: 'gestor@teste.com', label: 'Gestor', icon: BarChart },
  { email: 'admin@teste.com', label: 'Admin', icon: Settings },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function authenticate(nextEmail: string, nextPassword: string) {
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email: nextEmail,
      password: nextPassword,
      redirect: false,
      callbackUrl: '/dashboard',
    });

    setLoading(false);

    if (result?.error) {
      setError('Email ou senha invalidos.');
      return;
    }

    window.location.href = '/dashboard';
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await authenticate(email, password);
  }

  async function handleDemoLogin(nextEmail: string) {
    await authenticate(nextEmail, demoLoginToken);
  }

  return (
    <div className="login">
      <main className="login-main">
        <div className="brand">
          <div className="brand-mark">360</div>
          <div>
            <strong>Dignidade</strong>
            <small>Acesso seguro</small>
          </div>
        </div>

        <h1>Entre na plataforma.</h1>
        <p>Entre com sua conta autorizada. Este aplicativo nao e um canal de emergencia.</p>

        <form className="form login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Senha
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="notice">
          <ShieldCheck />
          <span>
            Acesso sem senha bloqueado em ambientes hospedados. Demonstracoes devem usar ambiente isolado e dados sinteticos.
          </span>
        </div>
      </main>

      <aside className="login-panel">
        <h2 className="eyebrow">Acessos de teste</h2>
        <p>Os perfis sem senha estao disponiveis somente em desenvolvimento local explicitamente habilitado.</p>
        {demoLoginEnabled ? (
          <div className="role-grid compact-grid">
            {demoUsers.map((user) => (
              <button key={user.email} onClick={() => handleDemoLogin(user.email)} disabled={loading}>
                <user.icon />
                <div>
                  <strong>{user.label}</strong>
                  <span>Entrar sem senha</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="notice">
            <ShieldCheck />
            <span>Modo demonstracao desativado neste ambiente.</span>
          </div>
        )}
      </aside>
    </div>
  );
}
