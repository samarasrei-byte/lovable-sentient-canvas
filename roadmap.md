# Roadmap — Produção em Lote (experiência principal do Arcana)

Decisões do usuário: usuários logados · motor = template + dados da marca (sem IA por vídeo) · cobrança em créditos · vídeos de marketing verticais (novo formato).

## Backend / Dados
- [ ] Migração: tabelas `batch_clients`, `video_templates`, `batch_jobs`, `batch_videos` (GRANTs + RLS + índices)
- [ ] Regenerar types do Supabase
- [ ] Edge function `batch-production`: criar job (valida créditos, consome via consume_credits, gera registros de vídeos), retry de vídeos com erro, ações em massa (aprovar/excluir)
- [ ] Seeds: templates iniciais de marketing vertical

## Frontend
- [ ] Home: hero "Produza centenas de vídeos personalizados em poucos minutos" com CTA "Começar produção" / "Ver como funciona", indicadores (Templates editáveis, Dados personalizados, Download em lote); demais funcionalidades em seção secundária com toggle admin
- [ ] Navegação: adicionar itens Produção em Lote (destaque), Meus Vídeos, Templates, Clientes, Publicações, Configurações
- [ ] Wizard `/producao-em-lote/nova`: 7 etapas (segmento → tema → quantidade → cliente → template → dados da marca → gerar) com barra de progresso e status em tempo real
- [ ] Galeria `/meus-videos`: miniaturas, filtros (status/tema/cliente), busca, seleção múltipla, aprovação/exclusão em massa, download individual e ZIP, agendamento
- [ ] Páginas: Templates (galeria), Clientes (CRUD), Publicações (agendados/publicados), Configurações (toggle de destaque da home)
- [ ] Renderizador de template (canvas) para preview e exportação de vídeo
- [ ] Rotas + lazy loading em App.tsx

## Qualidade
- [ ] Verificar build sem erros
- [ ] Teste E2E do fluxo principal (login → wizard → job → galeria)
