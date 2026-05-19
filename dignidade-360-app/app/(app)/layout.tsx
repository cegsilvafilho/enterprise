import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  BarChart,
  BellRing,
  HeartHandshake,
  LayoutDashboard,
  ListChecks,
  History,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
} from 'lucide-react';
import LogoutButton from './LogoutButton';
import { getCurrentUser } from '@/lib/access';

const roleConfig = {
  patient: {
    label: 'Paciente',
    nav: [
      { path: '/dashboard', label: 'Painel', icon: LayoutDashboard },
      { path: '/checkin', label: 'Check-in', icon: Activity },
      { path: '/consent', label: 'Consentimento', icon: ShieldCheck },
    ],
  },
  caregiver: {
    label: 'Cuidador',
    nav: [
      { path: '/dashboard', label: 'Painel', icon: LayoutDashboard },
      { path: '/checkin', label: 'Check-in assistido', icon: HeartHandshake },
      { path: '/consent', label: 'Permissoes', icon: ShieldCheck },
    ],
  },
  professional: {
    label: 'Profissional',
    nav: [
      { path: '/dashboard', label: 'Paciente 360', icon: UserRound },
      { path: '/patients', label: 'Pacientes', icon: UsersRound },
      { path: '/queue', label: 'Fila', icon: ListChecks },
    ],
  },
  manager: {
    label: 'Gestor',
    nav: [
      { path: '/manager', label: 'Gestao', icon: BarChart },
      { path: '/patients', label: 'Pacientes', icon: UsersRound },
      { path: '/queue', label: 'Fila', icon: ListChecks },
      { path: '/audit', label: 'Auditoria', icon: History },
    ],
  },
  admin: {
    label: 'Admin',
    nav: [
      { path: '/manager', label: 'Operacao', icon: Settings },
      { path: '/patients', label: 'Pacientes', icon: UsersRound },
      { path: '/queue', label: 'Alertas', icon: BellRing },
      { path: '/consent', label: 'Governanca', icon: ShieldCheck },
      { path: '/audit', label: 'Auditoria', icon: History },
    ],
  },
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser || !roleConfig[currentUser.role]) {
    redirect('/login');
  }

  if (currentUser.mustChangePassword) {
    redirect('/change-password');
  }

  const config = roleConfig[currentUser.role];

  return (
    <>
      <div className="demo-banner">Ambiente de validacao clinica inicial</div>
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">360</div>
            <div>
              <strong>Dignidade</strong>
              <small id="currentRole">{config.label}</small>
            </div>
          </div>
          <nav className="nav">
            {config.nav.map((item) => (
              <Link key={item.path} href={item.path}>
                <item.icon />
                {item.label}
              </Link>
            ))}
          </nav>
          <LogoutButton />
        </aside>
        <main className="workspace">{children}</main>
      </div>
    </>
  );
}
