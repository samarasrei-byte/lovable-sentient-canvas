import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ADMIN_EMAIL = "admin@arcana.com.br";
const ADMIN_PASSWORD = "arcana2026";
const ADMIN_NAME = "Admin Arcana";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));

    if (
      (body.email && body.email !== ADMIN_EMAIL) ||
      (body.password && body.password !== ADMIN_PASSWORD)
    ) {
      return new Response(JSON.stringify({ error: "Invalid admin bootstrap credentials" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    let user = listData.users.find(
      (candidate) => candidate.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    );
    let created = false;

    if (!user) {
      const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: ADMIN_NAME,
          user_type: "admin",
        },
      });

      if (createError) throw createError;
      user = createdUser.user;
      created = true;
    } else {
      const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        {
          password: ADMIN_PASSWORD,
          email_confirm: true,
          user_metadata: {
            ...(user.user_metadata ?? {}),
            full_name: ADMIN_NAME,
            user_type: "admin",
          },
        }
      );

      if (updateError) throw updateError;
      user = updatedUser.user;
    }

    if (!user) {
      throw new Error("Admin user could not be provisioned");
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: ADMIN_EMAIL,
          full_name: ADMIN_NAME,
        },
        { onConflict: "id" }
      );

    if (profileError) throw profileError;

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        {
          user_id: user.id,
          role: "admin",
        },
        { onConflict: "user_id,role" }
      );

    if (roleError) throw roleError;

    await supabaseAdmin
      .from("bans")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("is_active", true);

    return new Response(
      JSON.stringify({
        success: true,
        created,
        userId: user.id,
        email: ADMIN_EMAIL,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error ensuring admin user:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});