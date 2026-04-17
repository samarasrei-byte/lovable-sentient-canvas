-- Performance indexes to reduce DB load on Cloud instance

-- prompt_purchases: filtering by status/created_at (admin dashboards, retry sweeps)
CREATE INDEX IF NOT EXISTS idx_prompt_purchases_status_created
  ON public.prompt_purchases (generation_status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_prompt_purchases_payment_status
  ON public.prompt_purchases (payment_status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_prompt_purchases_prompt_id
  ON public.prompt_purchases (prompt_id);

-- notifications: heavy realtime + unread queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_read
  ON public.notifications (user_id, is_read, created_at DESC);

-- credit_transactions: per-user history
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_created
  ON public.credit_transactions (user_id, created_at DESC);

-- generated_images: gallery queries
CREATE INDEX IF NOT EXISTS idx_generated_images_user_created
  ON public.generated_images (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_generated_images_public_created
  ON public.generated_images (is_public, created_at DESC) WHERE is_public = true;

-- prompts: marketplace listings
CREATE INDEX IF NOT EXISTS idx_prompts_status_featured_order
  ON public.prompts (status, is_featured, display_order);

CREATE INDEX IF NOT EXISTS idx_prompts_category_status
  ON public.prompts (category, status);

-- user_roles: has_role() called everywhere
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role
  ON public.user_roles (user_id, role);

-- live_chat_messages: realtime by session
CREATE INDEX IF NOT EXISTS idx_live_chat_session_created
  ON public.live_chat_messages (session_id, created_at DESC);

-- audit_logs: admin queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_created
  ON public.audit_logs (admin_id, created_at DESC);