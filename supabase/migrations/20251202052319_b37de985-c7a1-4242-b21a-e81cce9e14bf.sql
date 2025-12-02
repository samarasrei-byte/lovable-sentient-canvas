-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create function to send notification on contract creation
CREATE OR REPLACE FUNCTION public.notify_on_contract_created()
RETURNS TRIGGER AS $$
DECLARE
  influencer_user_id UUID;
  brand_name TEXT;
BEGIN
  -- Get influencer's user_id
  SELECT user_id INTO influencer_user_id 
  FROM public.influencers 
  WHERE id = NEW.influencer_id;
  
  -- Get brand name
  SELECT full_name INTO brand_name 
  FROM public.profiles 
  WHERE id = NEW.brand_id;
  
  -- Create notification for influencer
  IF influencer_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, type, action_url, metadata)
    VALUES (
      influencer_user_id,
      'Novo Contrato Recebido!',
      'Você recebeu uma proposta de contrato de ' || COALESCE(brand_name, 'uma marca') || ' no valor de R$ ' || NEW.amount::TEXT,
      'contract',
      '/app/contratos',
      jsonb_build_object('contract_id', NEW.id, 'amount', NEW.amount)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to send notification on payment processed
CREATE OR REPLACE FUNCTION public.notify_on_payment_processed()
RETURNS TRIGGER AS $$
DECLARE
  influencer_user_id UUID;
  contract_info RECORD;
BEGIN
  -- Only notify when payment is completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Get contract and influencer info
    SELECT c.influencer_id, c.amount, i.user_id 
    INTO contract_info
    FROM public.contracts c
    JOIN public.influencers i ON i.id = c.influencer_id
    WHERE c.id = NEW.contract_id;
    
    -- Create notification for influencer
    IF contract_info.user_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, title, message, type, action_url, metadata)
      VALUES (
        contract_info.user_id,
        'Pagamento Recebido!',
        'O pagamento de R$ ' || NEW.amount::TEXT || ' foi processado com sucesso!',
        'payment',
        '/app/pagamentos',
        jsonb_build_object('payment_id', NEW.id, 'amount', NEW.amount, 'contract_id', NEW.contract_id)
      );
    END IF;
    
    -- Create notification for brand
    INSERT INTO public.notifications (user_id, title, message, type, action_url, metadata)
    VALUES (
      NEW.brand_id,
      'Pagamento Confirmado',
      'Seu pagamento de R$ ' || NEW.amount::TEXT || ' foi processado com sucesso!',
      'payment',
      '/app/pagamentos',
      jsonb_build_object('payment_id', NEW.id, 'amount', NEW.amount)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_notify_contract_created ON public.contracts;
CREATE TRIGGER trigger_notify_contract_created
  AFTER INSERT ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_contract_created();

DROP TRIGGER IF EXISTS trigger_notify_payment_processed ON public.payments;
CREATE TRIGGER trigger_notify_payment_processed
  AFTER INSERT OR UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_payment_processed();