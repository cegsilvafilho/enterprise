# Backend seguro para primeira validação clínica

Este documento define a arquitetura recomendada para transformar o front-end demonstrativo do Dignidade 360 em uma primeira validação clínica controlada.

## Princípio

A versão estática atual valida experiência, fluxo, papéis, telas e lógica demonstrativa. Para inserir dados reais de pacientes, o sistema deve operar com backend seguro, banco de dados auditável, autenticação real, controle de acesso e governança clínica formal.

## Perfis e acesso

### Paciente

- Acessa apenas sua própria jornada.
- Pode registrar check-in, ler plano, consultar agenda, enviar mensagens e gerenciar consentimento.
- Não acessa indicadores agregados nem dados de outros pacientes.

### Profissional

- Acessa pacientes vinculados à unidade, equipe ou linha de cuidado.
- Pode criar e editar cadastro assistencial, registrar condutas, resolver alertas, criar tarefas, enviar mensagens e atualizar plano de cuidado.
- Deve ter trilha de auditoria em cada ação clínica.

### Gestor

- Acessa indicadores agregados, operação por unidade, fila, SLA, linhas de cuidado, relatórios e auditoria.
- Não deve visualizar dados sensíveis individualizados quando o indicador agregado for suficiente.
- Deve ter permissão explícita para exportação de relatórios.

## Autenticação recomendada

- Login com provedor de identidade institucional.
- MFA obrigatório para profissionais e gestores.
- Sessão curta com refresh token seguro.
- Cookies `HttpOnly`, `Secure` e `SameSite=Lax` ou `Strict`.
- Política de senha apenas se não houver SSO institucional.
- Bloqueio por tentativas de login.
- Logs de autenticação e sessão.

## Autorização

Modelo recomendado: RBAC com escopo clínico.

Campos mínimos por sessão:

- `user_id`
- `role`
- `organization_id`
- `unit_ids`
- `team_ids`
- `patient_scope`
- `permissions`
- `session_id`

Exemplos de permissões:

- `patient:self:read`
- `patient:self:checkin:create`
- `patient:assigned:read`
- `patient:assigned:update`
- `alert:assigned:resolve`
- `care_plan:assigned:update`
- `metrics:aggregate:read`
- `audit:read`
- `export:restricted`

## APIs mínimas

### Autenticação

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /auth/me`

### Pacientes

- `GET /patients`
- `POST /patients`
- `GET /patients/{id}`
- `PATCH /patients/{id}`
- `POST /patients/{id}/invite`

### Check-ins e alertas

- `POST /patients/{id}/checkins`
- `GET /patients/{id}/checkins`
- `GET /alerts`
- `PATCH /alerts/{id}`
- `POST /alerts/{id}/actions`

### Plano e jornada

- `GET /patients/{id}/care-plan`
- `PUT /patients/{id}/care-plan`
- `GET /patients/{id}/timeline`
- `POST /patients/{id}/notes`
- `POST /patients/{id}/tasks`
- `PATCH /tasks/{id}`

### Agenda e mensagens

- `GET /appointments`
- `POST /appointments`
- `GET /patients/{id}/messages`
- `POST /patients/{id}/messages`

### Gestão

- `GET /metrics/overview`
- `GET /metrics/units`
- `GET /care-lines`
- `POST /care-lines`
- `GET /audit`

## Banco de dados recomendado

PostgreSQL com criptografia em repouso e backup.

Tabelas principais:

- `organizations`
- `units`
- `teams`
- `users`
- `roles`
- `permissions`
- `patients`
- `patient_assignments`
- `consents`
- `checkins`
- `alerts`
- `alert_actions`
- `care_plans`
- `appointments`
- `messages`
- `notes`
- `tasks`
- `care_lines`
- `audit_logs`

## Auditoria

Cada evento sensível deve gravar:

- usuário
- perfil
- organização
- paciente afetado
- ação
- data/hora
- IP
- user agent
- antes/depois quando houver alteração
- justificativa clínica quando aplicável

O log deve ser append-only.

## Segurança e LGPD

- Criptografia em trânsito via HTTPS.
- Criptografia em repouso.
- Controle de acesso por menor privilégio.
- Consentimento versionado.
- Termo de uso para validação clínica.
- Política de retenção e descarte.
- Registro de bases legais.
- Mascaramento de dados em indicadores.
- Rotina de resposta a incidente.
- Ambiente separado para teste, homologação e produção.

## Critérios mínimos para primeira validação clínica

Antes de usar com pacientes reais:

1. Comitê clínico aprova fluxos, textos e condutas.
2. Jurídico/DPO aprova LGPD, consentimento e termos.
3. Backend real implementa autenticação e RBAC.
4. Banco de dados tem backup, criptografia e logs.
5. Auditoria está ativa e testada.
6. Profissionais recebem treinamento.
7. Existe protocolo de crise e escalonamento fora da plataforma.
8. O sistema deixa claro que não substitui emergência.
9. Ambiente de validação usa número limitado de pacientes.
10. Há plano de suporte e canal de incidente.

## Recomendação de stack inicial

- Front-end: aplicação atual evoluída em React/Next.js ou mantida como SPA até a validação.
- Backend: Node.js/NestJS ou Python/FastAPI.
- Banco: PostgreSQL.
- Autenticação: Auth0, Keycloak, Supabase Auth Enterprise, Azure AD B2C ou provedor institucional.
- Hospedagem: Vercel para front-end e API inicial; infraestrutura hospitalar ou cloud com requisitos de compliance para produção.
- Observabilidade: logs estruturados, métricas, tracing e alertas.

## Observação

O front-end atual já simula papéis e permissões. A próxima etapa técnica é trocar `localStorage` por APIs reais e mover todas as regras sensíveis para o backend.
