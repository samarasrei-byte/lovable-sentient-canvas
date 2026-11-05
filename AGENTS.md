# AGENTS.md — Decisões técnicas do Arcana

## Produção em Lote (experiência principal)
- O motor de vídeos é "template + dados da marca" renderizado em canvas no cliente (`src/lib/batch-video-renderer.ts`), nunca IA por unidade — por decisão de custo/velocidade; variações são determinísticas por `variation_index` (seed PRNG), então re-renderizações são idênticas.
- Toda mutação de lote (criar job, ações em massa) passa exclusivamente pela edge function `batch-production`; o frontend nunca escreve em `batch_jobs`/`batch_videos` diretamente, pois o consumo de créditos precisa ser server-side.
- Exportação de vídeo (WebM/ZIP) é feita no navegador via MediaRecorder a partir do mesmo renderer — não existe render server-side.
- A configuração da home (destaque e seção secundária) é lida via RPC `get_homepage_config` (pública) e escrita via `set_homepage_config` (admin-only) — nunca ler `admin_settings` direto do cliente.

## Créditos
- Consumo e adição de créditos passam sempre pelas RPCs `consume_credits`/`add_credits` (service_role ou admin); os tipos de transação permitidos em `credit_transactions` são credit/debit/refund/bonus/reset e `balance_after` é obrigatório.
