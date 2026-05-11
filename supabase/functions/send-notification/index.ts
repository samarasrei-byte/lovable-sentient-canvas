import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAuth } from "../_shared/auth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  user_id: string;
  title: string;
  message: string;
  type: 'campaign' | 'message' | 'payment' | 'contract' | 'system';
  action_url?: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Require authenticated admin to send notifications via this endpoint.
    const auth = await requireAuth(req, { requireAdmin: true });
    if (auth.error || !auth.user) {
      return new Response(JSON.stringify({ error: auth.error || 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, payload } = await req.json();
    
    console.log(`Processing notification action: ${action}`, payload);

    switch (action) {
      case 'send_single': {
        const notificationData = payload as NotificationPayload;
        
        const { data, error } = await supabase
          .from('notifications')
          .insert({
            user_id: notificationData.user_id,
            title: notificationData.title,
            message: notificationData.message,
            type: notificationData.type,
            action_url: notificationData.action_url,
            metadata: notificationData.metadata,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating notification:', error);
          throw error;
        }

        console.log('Notification created successfully:', data.id);
        
        return new Response(
          JSON.stringify({ success: true, notification: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'send_bulk': {
        const { user_ids, title, message, type, action_url, metadata } = payload;
        
        const notifications = user_ids.map((user_id: string) => ({
          user_id,
          title,
          message,
          type,
          action_url,
          metadata,
        }));

        const { data, error } = await supabase
          .from('notifications')
          .insert(notifications)
          .select();

        if (error) {
          console.error('Error creating bulk notifications:', error);
          throw error;
        }

        console.log(`Created ${data.length} notifications successfully`);
        
        return new Response(
          JSON.stringify({ success: true, count: data.length }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'notify_contract_created': {
        const { contract_id, influencer_id, brand_id, amount } = payload;
        
        // Get influencer's user_id
        const { data: influencer } = await supabase
          .from('influencers')
          .select('user_id, stage_name')
          .eq('id', influencer_id)
          .single();

        // Get brand name
        const { data: brand } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', brand_id)
          .single();

        if (influencer?.user_id) {
          await supabase.from('notifications').insert({
            user_id: influencer.user_id,
            title: 'Novo Contrato Recebido!',
            message: `Você recebeu uma proposta de contrato de ${brand?.full_name || 'uma marca'} no valor de R$ ${amount.toLocaleString()}`,
            type: 'contract',
            action_url: '/app/contratos',
            metadata: { contract_id, amount },
          });
          
          console.log(`Notification sent to influencer ${influencer.stage_name}`);
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'notify_payment_processed': {
        const { payment_id, contract_id, brand_id, amount, status } = payload;
        
        if (status !== 'completed') {
          return new Response(
            JSON.stringify({ success: true, message: 'Payment not completed, no notification sent' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get contract and influencer info
        const { data: contract } = await supabase
          .from('contracts')
          .select('influencer_id')
          .eq('id', contract_id)
          .single();

        if (contract?.influencer_id) {
          const { data: influencer } = await supabase
            .from('influencers')
            .select('user_id')
            .eq('id', contract.influencer_id)
            .single();

          // Notify influencer
          if (influencer?.user_id) {
            await supabase.from('notifications').insert({
              user_id: influencer.user_id,
              title: 'Pagamento Recebido!',
              message: `O pagamento de R$ ${amount.toLocaleString()} foi processado com sucesso!`,
              type: 'payment',
              action_url: '/app/pagamentos',
              metadata: { payment_id, amount, contract_id },
            });
            
            console.log(`Payment notification sent to influencer`);
          }
        }

        // Notify brand
        await supabase.from('notifications').insert({
          user_id: brand_id,
          title: 'Pagamento Confirmado',
          message: `Seu pagamento de R$ ${amount.toLocaleString()} foi processado com sucesso!`,
          type: 'payment',
          action_url: '/app/pagamentos',
          metadata: { payment_id, amount },
        });

        console.log(`Payment notification sent to brand`);

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'notify_new_message': {
        const { contract_id, sender_id, recipient_id, preview } = payload;
        
        // Get sender name
        const { data: sender } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', sender_id)
          .single();

        await supabase.from('notifications').insert({
          user_id: recipient_id,
          title: 'Nova Mensagem',
          message: `${sender?.full_name || 'Alguém'} enviou uma mensagem: "${preview.substring(0, 50)}${preview.length > 50 ? '...' : ''}"`,
          type: 'message',
          action_url: '/app/chat',
          metadata: { contract_id, sender_id },
        });

        console.log(`Message notification sent to ${recipient_id}`);

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in send-notification function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
