import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  isPro: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const { data: profile, refetch: refreshProfile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      try {
        const [profileRes, subRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("subscriptions").select("plan").eq("user_id", user.id).eq("status", "active").maybeSingle()
        ]);

        if (profileRes.error && profileRes.error.code !== "PGRST116") {
          console.error("Error fetching profile:", profileRes.error);
        }

        return {
          ...(profileRes.data || {}),
          plan: subRes.data?.plan || "basic"
        };
      } catch (error) {
        console.error("Profile fetch error:", error);
        return null;
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      
      if (event === "SIGNED_OUT") {
        queryClient.setQueryData(["profile", user?.id], null);
        queryClient.clear();
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [queryClient, user?.id]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    queryClient.setQueryData(["profile", user?.id], null);
    queryClient.clear();
  }, [queryClient, user?.id]);

  const value = {
    user,
    profile,
    loading: loading,
    isAdmin: profile?.role === "admin",
    isPro: profile?.plan === "professional" || profile?.plan === "enterprise",
    signOut,
    refreshProfile: async () => {
      await refreshProfile();
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
