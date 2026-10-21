# Dignare 360 · Navegação longitudinal persistente v0.5 — ESPECIFICAÇÃO E CÓDIGO CANDIDATO

**Status:** não migrado; **desativado por padrão**; somente profissionais; staging com pacientes estritamente fictícios.

## Estrutura entregue
- Prisma `NavigationContact`: organização, paciente, autor, canal, resultado, mudança relatada, nota, chave única de idempotência e data.
- Prisma `NavigationTask`: organização, paciente, autor, responsável real, prazo, estado, versão para atualização concorrente, resultado e autor do encerramento. Vínculo opcional ao contato de origem.
- APIs protegidas `POST /api/navigation/contacts`, `POST /api/navigation/tasks` e `PATCH /api/navigation/tasks/[id]`.
- Aplicação interna `/navigation`, somente profissional com carteira assistencial ativa. Menu profissional contém link.
- Rota `/demo/concierge` permanece apenas fictícia, sem persistência ou integração.

## Regras centrais
- Não confundir urgência clínica com prioridade operacional. Não classificar gravidade automaticamente.
- Contato sem resposta implica **estado não avaliado**; nunca concluir que a pessoa está estável.
- Responsável por tarefa deve ser profissional ativo da mesma organização e vinculado ao paciente.
- Só o responsável muda o estado; encerramento exige desfecho verificável e gera auditoria na mesma transação; versão bloqueia atualização simultânea.
- Restrições por organização, paciente e papel são feitas no servidor. APIs mutantes também exigem mesma origem.
- Histórico operacional NÃO é prontuário, evolução assinada nem PAD. Integração com iClinic/MVSOUL requer acordo e validação.
- Não há integração com WhatsApp ou Power BI.

## Ativação proibida até gate de staging
Por segurança, `navigationPersistenceEnabled()` exige simultaneamente: Vercel Preview ou desenvolvimento local + `NAVIGATION_PERSISTENCE_ENABLED=true` + `NAVIGATION_DB_VERIFIED=true`. O código rejeita produção mesmo que a flag seja configurada inadvertidamente.

**Nenhuma flag deve ser habilitada antes de:** cópia isolada do esquema em banco PostgreSQL EXCLUSIVO de staging (sem dados reais), backup comprovado, revisão do modelo, migração testada sem `db push` automático e implantação controlada. Existe schema no Prisma, mas não foi aplicada migração no banco; é esperado que a rota interna apresente uma mensagem de bloqueio.

## Migração controlada
1. Estabelecer baseline de migrações Prisma do banco de staging (instalação existente não possui histórico de migrações formalizado).
2. Gerar script com `prisma migrate diff --from-url STAGING_URL --to-schema-datamodel prisma/schema.prisma --script` em ambiente isolado, inspecionar SQL e FKs; nunca apontar essa ferramenta ao banco de produção.
3. Validar primeiro em cópia descartável, aprovar SQL, executar exclusivamente no staging com janela de manutenção e verificar integridade e rollback. Para estratégia de produção, requer change management adicional.
4. Só então liberar duas flags no ambiente Preview, com autenticação de usuários fictícios e controle de acesso.

## Testes exigidos antes da liberação
- Prisma `validate`, build Next, TypeScript, auditoria npm, testes de autorização e acesso cruzado (organização/profissional/paciente), tentativa duplicada por idempotência e concorrência na tarefa.
- Jornada sem resposta, contato realizado, criação com responsável vinculado, fechamento com resultado, erro 409 por versão divergente, bloqueio do perfil admin/manager, bloqueio da produção.
- Responsividade, teclado, leitores de tela, sessão expirada, auditoria e métricas de operação com dados fictícios.

**Nunca ativar esse módulo para pacientes reais nem migrar o banco de produção antes dos gates clínicos, LGPD, segurança e contratos.**

### Incremento de idempotência em ações
- Criação de tarefa recebe UUID v4 único no navegador e no modelo Prisma; repetição do mesmo envio retorna o mesmo ID sem duplicar a ação nem o log.
- Reutilização da chave com outro conteúdo retorna 409; em falha de rede o navegador mantém a chave de envio até confirmação.
- Exige migração aprovada **somente no staging** para a nova coluna e índice único. Não foram aplicadas migrações automaticamente.


## Relatório técnico do incremento — 20/10/2026
**Evidência CI (7dd8f4f7 e 54c33e51):** GitHub Actions compilou Next/TypeScript, executou `prisma validate`, os testes unitários de política de navegação e a auditoria de dependências runtime; no commit 54c33e51, o PostgreSQL efêmero aceitou os modelos e passou o teste de integração.

**Segurança de dados:** foram acrescentadas restrições relacionais compostas entre `organizationId`, `patientId` e `userId` nas entidades de navegação. O banco rejeita paciente de organização diferente e tarefa vinculada a contato de outra pessoa/organização. O teste cria duas instituições e confirma o bloqueio via FK.

**Correções de concorrência:** `idempotencyKey` UUID v4 evita gravação dupla de contatos e de novas ações. Atualizações de estado de tarefas usam versão otimista e impedem um processo defasado de sobrescrever tarefa encerrada.

**Limites da evidência:** o CI opera exclusivamente em PostgreSQL temporário criado no runner do GitHub, sem credenciais ou dados da instituição; valida schema, consultas e constraints, mas **não é teste end-to-end HTTP, teste de login real ou prova de segurança da infraestrutura**. O banco da Vercel não foi migrado. A rota persistente continua desabilitada por falta de flags de staging verificadas.

**Sequência requerida:** (1) homologação da interface com cinco perfis simulados, (2) banco de staging dedicado e baseline de migrações, (3) fluxos HTTP e isolamento multi-organização com contas fictícias, (4) trilhas de auditoria e recuperação, (5) teste de integração com prontuário autorizado. Não usar pacientes reais antes dos gates.
