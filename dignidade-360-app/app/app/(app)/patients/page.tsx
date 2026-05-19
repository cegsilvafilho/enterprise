import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAccessiblePatients, getCurrentUser } from '@/lib/access';

export default async function PatientsPage() {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser((session?.user as any)?.id);

  if (!currentUser) {
    redirect('/login');
  }

  const patients = await getAccessiblePatients(currentUser);

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Pacientes</h1>
          <span className="view-kicker">Carteira acessivel ao perfil atual</span>
        </div>
      </header>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Condicao</th>
                <th>Unidade</th>
                <th>Linha</th>
                <th>Acesso</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.condition}</td>
                  <td>{patient.unit}</td>
                  <td>{patient.careLine}</td>
                  <td>
                    <Link href={`/dashboard?patientId=${patient.id}`} className="soft table-link">
                      Abrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
