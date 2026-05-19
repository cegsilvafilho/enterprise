'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('As novas senhas precisam ser iguais.');
      return;
    }

    setLoading(true);
    const response = await fetch('/api/account/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error || 'Nao foi possivel trocar a senha.');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Senha atual
        <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
      </label>
      <label>
        Nova senha
        <input type="password" minLength={10} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
      </label>
      <label>
        Confirmar nova senha
        <input type="password" minLength={10} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
      </label>
      {message && <p className="form-error">{message}</p>}
      <button type="submit" className="primary" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar nova senha'}
      </button>
    </form>
  );
}
