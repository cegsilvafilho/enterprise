'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  mustChangePassword: boolean;
  lockedUntil: string | null;
  lastLoginAt: string | null;
};

type Patient = {
  id: string;
  name: string;
  age: number;
  condition: string;
  unit: string;
  careLine: string;
  caregiverName: string | null;
  professionalName: string | null;
  active: boolean;
};

type CareLine = {
  id: string;
  name: string;
};

const initialUserForm = {
  name: '',
  email: '',
  role: 'patient',
  password: '',
};

const initialPatientForm = {
  name: '',
  age: '',
  condition: '',
  unit: '',
  careLine: '',
  portalUserId: '',
  caregiverUserId: '',
  professionalUserId: '',
  goal: '',
  preference: '',
};

export default function ManagerClient({
  users,
  patients,
  careLines,
}: {
  users: User[];
  patients: Patient[];
  careLines: CareLine[];
}) {
  const router = useRouter();
  const [userForm, setUserForm] = useState(initialUserForm);
  const [patientForm, setPatientForm] = useState({
    ...initialPatientForm,
    careLine: careLines[0]?.name || '',
  });
  const [userMessage, setUserMessage] = useState('');
  const [patientMessage, setPatientMessage] = useState('');
  const [tableMessage, setTableMessage] = useState('');
  const [savingUser, setSavingUser] = useState(false);
  const [savingPatient, setSavingPatient] = useState(false);

  const patientUsers = useMemo(() => users.filter((user) => user.role === 'patient'), [users]);
  const caregiverUsers = useMemo(() => users.filter((user) => user.role === 'caregiver'), [users]);
  const professionalUsers = useMemo(() => users.filter((user) => user.role === 'professional'), [users]);

  function getUserStatus(user: User) {
    if (!user.active) return 'Inativo';
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) return 'Bloqueado';
    if (user.mustChangePassword) return 'Troca pendente';
    return 'Ativo';
  }

  async function createUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingUser(true);
    setUserMessage('');

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm),
    });
    const data = await response.json();
    setSavingUser(false);

    if (!response.ok) {
      setUserMessage(data.error || 'Nao foi possivel criar o usuario.');
      return;
    }

    setUserForm(initialUserForm);
    setUserMessage('Usuario criado com sucesso.');
    router.refresh();
  }

  async function createPatient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPatient(true);
    setPatientMessage('');

    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientForm),
    });
    const data = await response.json();
    setSavingPatient(false);

    if (!response.ok) {
      setPatientMessage(data.error || 'Nao foi possivel criar o paciente.');
      return;
    }

    setPatientForm({
      ...initialPatientForm,
      careLine: careLines[0]?.name || '',
    });
    setPatientMessage('Paciente criado com sucesso.');
    router.refresh();
  }

  async function updateUser(userId: string, action: 'toggle-active' | 'reset-password') {
    setTableMessage('');
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const data = await response.json();

    if (!response.ok) {
      setTableMessage(data.error || 'Nao foi possivel atualizar o usuario.');
      return;
    }

    if (action === 'reset-password') {
      setTableMessage(`Senha temporaria de ${data.user.name}: ${data.temporaryPassword}`);
    } else {
      setTableMessage('Usuario atualizado com sucesso.');
    }
    router.refresh();
  }

  async function togglePatient(patientId: string) {
    setTableMessage('');
    const response = await fetch(`/api/patients/${patientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle-active' }),
    });
    const data = await response.json();

    if (!response.ok) {
      setTableMessage(data.error || 'Nao foi possivel atualizar o paciente.');
      return;
    }

    setTableMessage('Paciente atualizado com sucesso.');
    router.refresh();
  }

  return (
    <>
      <div className="grid-2 manager-grid">
        <section className="panel">
          <header className="panel-head">
            <h2>Cadastrar usuario</h2>
          </header>
          <form className="form" onSubmit={createUser}>
            <div className="form-row">
              <label>
                Nome
                <input value={userForm.name} onChange={(event) => setUserForm({ ...userForm, name: event.target.value })} required />
              </label>
              <label>
                Email
                <input type="email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} required />
              </label>
            </div>
            <div className="form-row">
              <label>
                Perfil
                <select value={userForm.role} onChange={(event) => setUserForm({ ...userForm, role: event.target.value })}>
                  <option value="patient">Paciente</option>
                  <option value="caregiver">Cuidador</option>
                  <option value="professional">Profissional</option>
                  <option value="manager">Gestor</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label>
                Senha inicial
                <input
                  type="password"
                  minLength={10}
                  value={userForm.password}
                  onChange={(event) => setUserForm({ ...userForm, password: event.target.value })}
                  required
                />
              </label>
            </div>
            {userMessage && <p className="form-feedback">{userMessage}</p>}
            <button type="submit" className="primary" disabled={savingUser}>
              {savingUser ? 'Salvando...' : 'Criar usuario'}
            </button>
          </form>
        </section>

        <section className="panel">
          <header className="panel-head">
            <h2>Cadastrar paciente</h2>
          </header>
          <form className="form" onSubmit={createPatient}>
            <div className="form-row">
              <label>
                Nome
                <input value={patientForm.name} onChange={(event) => setPatientForm({ ...patientForm, name: event.target.value })} required />
              </label>
              <label>
                Idade
                <input type="number" min="1" value={patientForm.age} onChange={(event) => setPatientForm({ ...patientForm, age: event.target.value })} required />
              </label>
            </div>
            <div className="form-row">
              <label>
                Condicao
                <input value={patientForm.condition} onChange={(event) => setPatientForm({ ...patientForm, condition: event.target.value })} required />
              </label>
              <label>
                Unidade
                <input value={patientForm.unit} onChange={(event) => setPatientForm({ ...patientForm, unit: event.target.value })} required />
              </label>
            </div>
            <div className="form-row">
              <label>
                Linha de cuidado
                <select value={patientForm.careLine} onChange={(event) => setPatientForm({ ...patientForm, careLine: event.target.value })}>
                  {careLines.map((line) => (
                    <option key={line.id} value={line.name}>
                      {line.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Conta do paciente
                <select value={patientForm.portalUserId} onChange={(event) => setPatientForm({ ...patientForm, portalUserId: event.target.value })}>
                  <option value="">Sem conta de portal</option>
                  {patientUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-row">
              <label>
                Cuidador autorizado
                <select value={patientForm.caregiverUserId} onChange={(event) => setPatientForm({ ...patientForm, caregiverUserId: event.target.value })}>
                  <option value="">Sem cuidador</option>
                  {caregiverUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Profissional responsavel
                <select value={patientForm.professionalUserId} onChange={(event) => setPatientForm({ ...patientForm, professionalUserId: event.target.value })}>
                  <option value="">Sem profissional</option>
                  {professionalUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Objetivo de cuidado
              <textarea rows={2} value={patientForm.goal} onChange={(event) => setPatientForm({ ...patientForm, goal: event.target.value })} />
            </label>
            <label>
              Preferencias relevantes
              <textarea rows={2} value={patientForm.preference} onChange={(event) => setPatientForm({ ...patientForm, preference: event.target.value })} />
            </label>
            {patientMessage && <p className="form-feedback">{patientMessage}</p>}
            <button type="submit" className="primary" disabled={savingPatient}>
              {savingPatient ? 'Salvando...' : 'Criar paciente'}
            </button>
          </form>
        </section>
      </div>

      <div className="grid-2 manager-grid">
        <section className="panel">
          <header className="panel-head">
            <h2>Usuarios cadastrados</h2>
          </header>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Perfil</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.role}</td>
                    <td>{user.email}</td>
                    <td>{getUserStatus(user)}</td>
                    <td>
                      <div className="table-actions">
                        <button type="button" className="soft" onClick={() => updateUser(user.id, 'toggle-active')}>
                          {user.active ? 'Desativar' : 'Ativar'}
                        </button>
                        <button type="button" className="soft" onClick={() => updateUser(user.id, 'reset-password')}>
                          Redefinir senha
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <header className="panel-head">
            <h2>Pacientes cadastrados</h2>
          </header>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Unidade</th>
                  <th>Responsavel</th>
                  <th>Status</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>{patient.unit}</td>
                    <td>{patient.professionalName || 'Nao informado'}</td>
                    <td>{patient.active ? 'Ativo' : 'Inativo'}</td>
                    <td>
                      <button type="button" className="soft" onClick={() => togglePatient(patient.id)}>
                        {patient.active ? 'Inativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {tableMessage && <p className="form-feedback operation-feedback">{tableMessage}</p>}
    </>
  );
}
