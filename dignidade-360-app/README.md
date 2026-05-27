# Dignidade 360 - MVP funcional

Esta pasta contem a versao dinamica do sistema, com:

- login real por email e senha;
- perfis `patient`, `caregiver`, `professional`, `manager` e `admin`;
- organizacao, usuarios, pacientes, cuidador autorizado e profissional vinculado;
- cadastro de usuarios e pacientes pelo painel gestor;
- troca obrigatoria de senha no primeiro acesso;
- politica de senha forte e bloqueio temporario apos tentativas invalidas;
- ativacao, desativacao e redefinicao de senha pelo gestor;
- check-ins, alertas, fila assistencial, condutas, consentimento e auditoria;
- banco PostgreSQL gerenciado para teste publicado e primeira validacao de fluxo.

## Requisitos

- Node.js 18 ou superior.

## Como rodar

1. Abra o terminal nesta pasta (`dignidade-360-app`).
2. Copie `.env.example` para `.env.local` e troque o valor de `NEXTAUTH_SECRET`.
3. Instale dependencias, se ainda nao estiverem instaladas:

   ```bash
   npm install
   ```

4. Para teste local com PostgreSQL configurado, recrie o banco e carregue os dados iniciais:

   ```bash
   npm run db:setup
   ```

5. Inicie o servidor:

   ```bash
   npm run dev
   ```

6. Abra `http://localhost:3000`.

## Acessos iniciais

Todos usam a senha `Teste123!` apenas no ambiente local:

| Perfil | Email |
|---|---|
| Paciente | `paciente@teste.com` |
| Cuidador | `cuidador@teste.com` |
| Profissional | `prof@teste.com` |
| Gestor | `gestor@teste.com` |
| Admin | `admin@teste.com` |

## Fluxo recomendado de teste

1. Entre como `gestor@teste.com`.
2. Abra `Gestao` e cadastre um novo usuario.
3. Ainda em `Gestao`, cadastre um novo paciente e vincule paciente, cuidador e profissional.
4. Entre como paciente e envie um check-in.
5. Entre como profissional e acompanhe a fila assistencial.
6. Resolva um alerta com uma conduta.
7. Entre como gestor e confira os indicadores e a auditoria.

## Preparacao para Vercel

- `.env.example`: variaveis locais.
- `.env.production.example`: modelo de configuracao hospedada.
- `prisma/schema.prisma`: PostgreSQL para Vercel/staging/producao.
- `prisma/schema.postgres.prisma`: copia de referencia do esquema PostgreSQL.
- `npm run build`: cria/atualiza tabelas com `prisma db push`, cria usuarios iniciais sem apagar dados existentes e compila o Next.js.

Variaveis obrigatorias na Vercel:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `INITIAL_ADMIN_EMAIL`
- `INITIAL_ADMIN_PASSWORD`
- `SEED_DEMO_DATA`
- `DEMO_LOGIN_ENABLED`
- `NEXT_PUBLIC_DEMO_LOGIN_ENABLED`

Para demonstracoes publicas, deixe `DEMO_LOGIN_ENABLED=true` e `NEXT_PUBLIC_DEMO_LOGIN_ENABLED=true`. Isso libera botoes de acesso sem senha para contas ficticias (`paciente@teste.com`, `cuidador@teste.com`, `prof@teste.com`, `gestor@teste.com`, `admin@teste.com`). Antes de usar dados reais de pacientes, desative essas duas variaveis.

## Endpoints operacionais

- `GET /api/health`: confirma que a aplicacao esta no ar.
- `GET /api/ready`: confirma que a aplicacao consegue acessar o banco.

## Limite desta versao

Este MVP ja funciona localmente, mas ainda nao substitui uma versao de producao hospitalar. Antes de usar pacientes reais, ainda faltam itens como MFA, recuperacao de senha, banco gerenciado, backups, observabilidade, revisao LGPD e validacao clinica formal.
