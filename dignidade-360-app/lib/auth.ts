import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const loginLockThreshold = 5;
const loginLockMinutes = 15;
const demoLoginToken = '__dignidade360_demo_login__';
const demoLoginEnabled = process.env.NODE_ENV !== 'production' || process.env.DEMO_LOGIN_ENABLED === 'true';
const demoLoginEmails = new Set([
  'paciente@teste.com',
  'cuidador@teste.com',
  'prof@teste.com',
  'gestor@teste.com',
  'admin@teste.com',
]);
const nextAuthSecret =
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === 'production' ? undefined : 'fallback_secret_for_local_dev_only');

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'seu@email.com' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const isDemoLogin = credentials.password === demoLoginToken;

        if (isDemoLogin && (!demoLoginEnabled || !demoLoginEmails.has(email))) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password || !user.active) {
          return null;
        }

        if (!isDemoLogin && user.lockedUntil && user.lockedUntil > new Date()) {
          return null;
        }

        const isPasswordValid = isDemoLogin || (await bcrypt.compare(credentials.password, user.password));

        if (!isPasswordValid) {
          const failedLoginAttempts = user.failedLoginAttempts + 1;
          const shouldLock = failedLoginAttempts >= loginLockThreshold;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts,
              lockedUntil: shouldLock ? new Date(Date.now() + loginLockMinutes * 60000) : user.lockedUntil,
            },
          });

          if (shouldLock) {
            await prisma.audit.create({
              data: {
                organizationId: user.organizationId,
                userId: user.id,
                user: user.name,
                action: 'Bloqueou login',
                entity: 'users',
                detail: `Conta bloqueada por ${loginLockMinutes} minutos apos tentativas invalidas`,
              },
            });
          }

          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
            mustChangePassword: isDemoLogin ? false : user.mustChangePassword,
          },
        });

        if (isDemoLogin) {
          await prisma.audit.create({
            data: {
              organizationId: user.organizationId,
              userId: user.id,
              user: user.name,
              action: 'Login demonstracao',
              entity: 'users',
              detail: `Acesso publico de demonstracao para ${user.email}`,
            },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.organizationId = (user as any).organizationId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).organizationId = token.organizationId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 8,
    updateAge: 60 * 30,
  },
  useSecureCookies: process.env.NEXTAUTH_URL
    ? process.env.NEXTAUTH_URL.startsWith('https://')
    : process.env.NODE_ENV === 'production',
  secret: nextAuthSecret,
};
