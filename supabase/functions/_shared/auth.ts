import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface AuthResult {
  user: { id: string; email?: string } | null;
  isAdmin: boolean;
  error?: string;
}

export async function requireAuth(req: Request, opts: { requireAdmin?: boolean } = {}): Promise<AuthResult> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return { user: null, isAdmin: false, error: "Missing Authorization header" };

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return { user: null, isAdmin: false, error: "Empty token" };

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return { user: null, isAdmin: false, error: "Invalid token" };

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .eq("role", "admin")
    .maybeSingle();

  const isAdmin = !!roleRow;
  if (opts.requireAdmin && !isAdmin) {
    return { user: { id: data.user.id, email: data.user.email }, isAdmin: false, error: "Admin role required" };
  }

  return { user: { id: data.user.id, email: data.user.email }, isAdmin };
}
