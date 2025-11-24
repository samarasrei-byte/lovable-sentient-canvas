import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Ban, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Influencer {
  id: string;
  stage_name: string;
  category: string;
  followers_count: number;
  engagement_rate: number;
  price_per_post: number;
  is_banned: boolean;
  ban_reason?: string;
}

const AdminInfluencers = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadInfluencers();
  }, []);

  const loadInfluencers = async () => {
    const { data, error } = await supabase
      .from("influencers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os influenciadores",
      });
    } else {
      setInfluencers(data || []);
    }
    setLoading(false);
  };

  const handleBan = async (influencerId: string, reason: string = "Violação dos termos") => {
    const { error } = await supabase
      .from("influencers")
      .update({
        is_banned: true,
        ban_reason: reason,
        banned_at: new Date().toISOString(),
      })
      .eq("id", influencerId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível banir o influenciador",
      });
    } else {
      toast({
        title: "Influenciador banido",
        description: "O influenciador foi banido com sucesso",
      });
      loadInfluencers();
    }
  };

  const handleUnban = async (influencerId: string) => {
    const { error } = await supabase
      .from("influencers")
      .update({
        is_banned: false,
        ban_reason: null,
        banned_at: null,
      })
      .eq("id", influencerId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível desbanir o influenciador",
      });
    } else {
      toast({
        title: "Banimento removido",
        description: "O influenciador foi desbanido com sucesso",
      });
      loadInfluencers();
    }
  };

  const filteredInfluencers = influencers.filter((inf) =>
    inf.stage_name.toLowerCase().includes(search.toLowerCase()) ||
    inf.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestão de Influenciadores</h1>
          <p className="text-muted-foreground">Aprovar, gerenciar e moderar influenciadores</p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <Input
          placeholder="Buscar por nome ou categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{influencers.length}</p>
            </div>
            <Eye className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ativos</p>
              <p className="text-2xl font-bold text-success">
                {influencers.filter((i) => !i.is_banned).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Banidos</p>
              <p className="text-2xl font-bold text-destructive">
                {influencers.filter((i) => i.is_banned).length}
              </p>
            </div>
            <Ban className="h-8 w-8 text-destructive" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Receita/mês</p>
              <p className="text-2xl font-bold text-accent">
                R$ {(influencers.reduce((sum, i) => sum + i.price_per_post, 0) * 0.15).toFixed(0)}
              </p>
            </div>
            <Clock className="h-8 w-8 text-accent" />
          </div>
        </Card>
      </div>

      {/* Influencers List */}
      <div className="space-y-4">
        {filteredInfluencers.map((influencer) => (
          <Card key={influencer.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold">{influencer.stage_name}</h3>
                  {influencer.is_banned ? (
                    <Badge variant="destructive" className="gap-1">
                      <Ban className="h-3 w-3" />
                      Banido
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-success/10 text-success border-success gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Ativo
                    </Badge>
                  )}
                  <Badge variant="outline">{influencer.category}</Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-6 mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Seguidores</p>
                    <p className="text-lg font-semibold">{influencer.followers_count.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Engajamento</p>
                    <p className="text-lg font-semibold">{influencer.engagement_rate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Preço/Post</p>
                    <p className="text-lg font-semibold">R$ {influencer.price_per_post.toFixed(2)}</p>
                  </div>
                </div>

                {influencer.is_banned && influencer.ban_reason && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">
                      <strong>Motivo do banimento:</strong> {influencer.ban_reason}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {influencer.is_banned ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnban(influencer.id)}
                    className="border-success text-success hover:bg-success/10"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Desbanir
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const reason = prompt("Motivo do banimento:");
                      if (reason) handleBan(influencer.id, reason);
                    }}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Banir
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminInfluencers;
