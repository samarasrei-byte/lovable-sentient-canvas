UPDATE public.prompt_purchases
SET custom_fields = COALESCE(custom_fields, '{}'::jsonb) || jsonb_build_object(
  'needs_refund', true,
  'flagged_for_refund_at', NOW()::text,
  'refund_reason', 'Falha de geração após pagamento - bug de URL privada (corrigido)'
)
WHERE payment_status = 'paid'
  AND generation_status = 'failed'
  AND NOT (custom_fields ? 'needs_refund');

ANALYZE public.prompt_purchases;
ANALYZE public.prompt_test_results;
ANALYZE public.generated_images;
ANALYZE public.prompts;
ANALYZE public.notifications;
ANALYZE public.user_roles;