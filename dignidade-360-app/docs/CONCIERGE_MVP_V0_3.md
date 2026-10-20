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


## Incremento v0.4 — modernização e segurança (20/10/2026)
- Next.js `15.5.28`, React/React DOM `19.2.9`, next-auth `4.24.15`, lucide-react `0.549.0` com lockfile regenerado.
- Correções transitivas travadas: nanoid `3.3.18`, postcss `8.5.23`, source-map-js `1.2.2`.
- TypeScript e compilação Next 15 aprovados no GitHub Actions run `39515465617`. A auditoria `npm audit --omit=dev --audit-level=critical` retornou **found 0 vulnerabilities** nesse run. Este resultado refere-se **às dependências de execução**, não substitui teste de penetração, análise LGPD ou auditoria abrangente do ambiente.
- Novo `getAuthorizedUser`: endpoints clínicos/operacionais não aceitam sessão com troca obrigatória de senha pendente; `/api/account/change-password` permanece disponível para concluir o primeiro acesso.
- Gestor não consegue criar contas manager/admin nem alterar/resetar contas privilegiadas; somente admin pode gerenciar esses papéis.
- Rotas dinâmicas e dashboard adaptadas aos parâmetros assíncronos de Next 15.
- Resolver alerta: profissional assistencial, tipo de resultado validado, descrição mínima, registro em transação, prevenção de dupla conclusão. Administrativo não encerra condutas.
- Acesso demonstrativo sem senha vetado nos ambientes hospedados. A rota `/demo/concierge` é estática e sintética.
- Workflow temporário de geração de lockfile com permissão de escrita removido após atualização.

## Ponto de atenção para próximos gates
1. Auditar a totalidade dos pacotes incluindo dependências de desenvolvimento e versão do Node; atualizar compatibilidades restantes com a política da equipe.
2. Testar fluxos manualmente e com Playwright (mobile, desktop, teclado, ações inválidas, acesso sem permissão e tentativa de selecionar outro paciente).
3. Ensaiar a autenticação real com dados **fictícios em banco próprio de staging**, sessão encerrada/revogação de usuário, isolamento multi-organização e verificação de MFA.
4. Validar regras de triagem, janela de cobertura, falhas de comunicação, escalonamento e prontuário com RT; `unclassified` não é estado clínico nem substitui urgência.
5. Auditoria do produto legado e privacidade: papéis gestores/admin ainda exigem menor privilégio comprovado; não colocar PHI até isso ser realizado.
6. Disponibilizar Vercel Preview somente para teste com dados fictícios; publicação READY não indica homologação clínica.

## Estado de liberação
- Engenharia: build e TypeScript passam; auditoria runtime 0 vulnerabilidades reportadas no run referenciado.
- Segurança: **em revisão**.
- Fluxo clínico: **em revisão**.
- Integração de prontuário, WhatsApp e Power BI: **não implantada**.
- Produção: **não autorizado**. Pull request permanece em rascunho.
