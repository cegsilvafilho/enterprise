# Dignare 360 · Concierge MVP v0.3 — PROTÓTIPO FICTÍCIO
Status: candidato a validação técnica e clínica. 20/10/2026.

## Base escolhida
Repo: cegsilvafilho/enterprise. Aplicação Next.js 14 + NextAuth + Prisma; usar o subdiretório dignidade-360-app.

## Primeira entrega
- Rota `/concierge` acessível a `professional`, `manager` e `admin`, com autorização feita no servidor.
- Carteira com quatro pacientes e situações **exclusivamente inventados**: estável, piora relatada, sobrecarga familiar e contato sem resposta.
- Estado temporário no React: contato, mudança relatada, tarefas, responsáveis, prazos e histórico da sessão.
- O resultado de um contato não respondido é **não avaliado**, nunca estabilidade clínica.
- Ação só é concluída após registrar desfecho demonstrativo; responsabilidade clínica continua humana.
- Indicadores exibidos são contagens dos quatro casos fictícios, não produção.
- Não existe chamada a APIs de paciente, prontuário, WhatsApp, Power BI nem backend persistente nesta nova rota.

## Correção estrutural
O script de build foi alterado de `prisma db push && seed-production && next build` para `prisma generate && next build`.
**Atenção:** existem scripts manuais de alteração de banco no projeto. Não executar `db:setup` ou `db:push` sem selecionar ambiente e revisar migrações. Verificar posteriormente autenticação demonstrativa e endurecer segurança da aplicação antes de dados reais.

## Dependências bloqueantes
1. Definir prontuário canônico por operação; validar suporte real do iClinic e aprovação do fornecedor.
2. Consolidar esquemas e terminologias: prioridade POP-04 P0–P3 != prioridade de acesso da oncologia.
3. Construir fonte persistente com isolamento por organização, logs verdadeiros, MFA, retenção, backups e rastreabilidade.
4. Implementar gestão de tarefas persistente e tipada com identidade, atribuição, execução, aceitação e escalonamento.
5. Aprovação de RT/POP/PROT/REG, dimensionamento da equipe (REG-09), termos LGPD e testes de usabilidade.
6. Introduzir conectores autenticados para prontuário, BI e WhatsApp apenas após provas técnicas e operacionais.

## Verificação deste incremento
Conferência estática feita: arquivo de rota presente, verificação de sessão/papel, links de navegação para três papéis, nenhuma consulta clínica na nova rota, build sem mutação automática do banco. Ainda NÃO foi executado teste de compilação Next nem teste end-to-end em Vercel para a branch. PR deve permanecer como **rascunho** até isso ocorrer.

## Próximo passo
Preparar preview de branch não produtiva, avaliar renderização/teclado/mobile, testar persona sem autorização, exercício clínico com dados sintéticos e revisão de segurança. Não fazer merge automático para main.
