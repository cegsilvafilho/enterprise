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
