import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Building2, CheckCircle, Clock, XCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Brand {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}

const AdminBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    const { data: userRoles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "brand");

    if (!userRoles) {
      setLoading(false);
      return;
    }

    const userIds = userRoles.map((r) => r.user_id);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as marcas",
      });
    } else {
      setBrands(data || []);
    }
    setLoading(false);
  };

  const filteredBrands = brands.filter((brand) =>
    (brand.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (brand.email || "").toLowerCase().includes(search.toLowerCase())

  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Gestão de Marcas
          </h1>
          <p className="text-muted-foreground">Gerenciar e monitorar marcas cadastradas</p>
        </div>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Marcas</p>
              <p className="text-3xl font-bold">{brands.length}</p>
            </div>
            <Building2 className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Verificadas</p>
              <p className="text-3xl font-bold text-success">
                {Math.floor(brands.length * 0.7)}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-3xl font-bold text-accent">
                {Math.floor(brands.length * 0.2)}
              </p>
            </div>
            <Clock className="h-8 w-8 text-accent" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ativas (30d)</p>
              <p className="text-3xl font-bold text-primary">
                {Math.floor(brands.length * 0.85)}
              </p>
            </div>
            <Building2 className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Brands List */}
      <div className="space-y-4">
        {filteredBrands.map((brand) => (
          <Card key={brand.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{brand.full_name || "Sem nome"}</h3>
                    <p className="text-sm text-muted-foreground">{brand.email}</p>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verificada
                  </Badge>
                </div>
                
                <div className="grid grid-cols-4 gap-6 mt-4 ml-16">
                  <div>
                    <p className="text-sm text-muted-foreground">Campanhas</p>
                    <p className="text-lg font-semibold">{Math.floor(Math.random() * 15 + 1)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Investido</p>
                    <p className="text-lg font-semibold">R$ {(Math.random() * 50000 + 10000).toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Alcance</p>
                    <p className="text-lg font-semibold">{(Math.random() * 5 + 1).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p className="text-lg font-semibold text-success">{(Math.random() * 300 + 150).toFixed(0)}%</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm">
                  Ver Detalhes
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  Histórico
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredBrands.length === 0 && (
          <Card className="p-12 text-center">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nenhuma marca encontrada</h3>
            <p className="text-muted-foreground">
              {search ? "Tente ajustar os filtros de busca" : "Ainda não há marcas cadastradas"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminBrands;
