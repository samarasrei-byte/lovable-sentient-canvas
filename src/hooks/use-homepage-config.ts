import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface HomepageConfig {
  highlight: "batch" | "photos";
  show_secondary_features: boolean;
}

const DEFAULT_CONFIG: HomepageConfig = {
  highlight: "batch",
  show_secondary_features: true,
};

export function useHomepageConfig() {
  return useQuery({
    queryKey: ["homepage-config"],
    staleTime: 1000 * 60 * 10,
    queryFn: async (): Promise<HomepageConfig> => {
      const { data, error } = await supabase.rpc("get_homepage_config");
      if (error || !data) return DEFAULT_CONFIG;
      return { ...DEFAULT_CONFIG, ...(data as Partial<HomepageConfig>) };
    },
  });
}

export function useSetHomepageConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (config: HomepageConfig) => {
      const { error } = await supabase.rpc("set_homepage_config", {
        p_value: config as unknown as Json,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["homepage-config"] });
    },
  });
}
