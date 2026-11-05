# Roadmap — Produção em Lote (experiência principal do Arcana)

Decisões do usuário: usuários logados · motor = template + dados da marca (sem IA por vídeo) · cobrança em créditos · vídeos de marketing verticais (novo formato).

## Backend / Dados
- [x] Migração: tabelas `batch_clients`, `video_templates`, `batch_jobs`, `batch_videos` (GRANTs + RLS + índices)
- [x] Regenerar types do Supabase
- [x] Edge function `batch-production`: criar job (consome créditos), ações em massa, retry
- [x] Seeds: 4 templates iniciais de marketing vertical
- [x] RPCs `get_homepage_config` / `set_homepage_config` (toggle admin da home)
- [x] Bug crítico corrigido: funções de crédito (`consume_credits_internal`/`add_credits_internal`) falhavam por `balance_after` ausente e tipo `'use'` inválido no CHECK

## Frontend
- [x] Home: hero da Produção em Lote em primeiro (toggle admin) + seção secundária "Outras soluções"
- [x] Navegação: item destacado Produção em Lote + Meus Vídeos, Templates, Clientes, Publicações, Configurações (desktop e mobile)
- [x] Wizard 7 etapas `/app/producao-em-lote/nova` com barra de progresso e acompanhamento em tempo real
- [x] Galeria `/app/meus-videos`: filtros, busca, seleção múltipla, aprovar/excluir/agendar em massa, download individual (WebM) e ZIP
- [x] Páginas: Templates, Clientes (CRUD), Publicações, Configurações
- [x] Renderizador canvas 9:16 (`src/lib/batch-video-renderer.ts`) com variações determinísticas por vídeo
- [x] Rotas lazy em App.tsx

## Qualidade
- [x] Build sem erros
- [x] Teste E2E real: login → cliente → wizard → 50 vídeos gerados → galeria (dados de teste removidos, créditos estornados)

## Aberto
- [ ] Upload de logo do cliente (hoje usa iniciais + cores) — aguardando priorização
