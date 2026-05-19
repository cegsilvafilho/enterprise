'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {

  async function handleLogout() {
    await signOut({ callbackUrl: '/login' });
  }

  return (
    <button className="logout" onClick={handleLogout}>
      <LogOut />
      Sair
    </button>
  );
}
