import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  CalendarIcon, 
  Target, 
  DollarSign, 
  Users, 
  FileText,
  Sparkles,
  TrendingUp,
  Eye,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import influencerTech from "@/assets/influencer-tech.jpg";
import influencerFashion from "@/assets/influencer-fashion.jpg";
import influencerFitness from "@/assets/influencer-fitness.jpg";
import influencerBusiness from "@/assets/influencer-business.jpg";

const campaignSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter no mínimo 3 caracteres").max(100, "Nome muito longo"),
  objective: z.enum(["awareness", "engagement", "conversion", "traffic"], {
    required_error: "Selecione um objetivo"
  }),
  briefing: z.string().trim().min(50, "Briefing deve ter no mínimo 50 caracteres").max(2000, "Briefing muito longo"),
  budget: z.number().min(1000, "Budget mínimo de R$ 1.000").max(1000000, "Budget máximo de R$ 1.000.000"),
  startDate: z.date({ required_error: "Selecione a data de início" }),
  endDate: z.date({ required_error: "Selecione a data de término" }),
  influencers: z.array(z.number()).min(1, "Selecione pelo menos 1 influenciador"),
  expectedReach: z.number().min(1000, "Alcance esperado mínimo de 1.000"),
  expectedEngagement: z.number().min(0.1, "Engajamento esperado mínimo de 0.1%").max(100, "Engajamento máximo de 100%")
}).refine((data) => data.endDate > data.startDate, {
  message: "Data de término deve ser após a data de início",
  path: ["endDate"]
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const influencers = [
  { 
    id: 1, 
    name: "Rafael Costa", 
    category: "Tecnologia & IA", 
    followers: "2.5M", 
    engagement: "12.4%",
    image: influencerTech,
    pricePerPost: 8500
  },
  { 
    id: 2, 
    name: "Camila Rodrigues", 
    category: "Moda & Lifestyle", 
    followers: "4.8M", 
    engagement: "15.2%",
    image: influencerFashion,
    pricePerPost: 15000
  },
  { 
    id: 3, 
    name: "Bruno Almeida", 
    category: "Fitness & Saúde", 
    followers: "3.2M", 
    engagement: "18.5%",
    image: influencerFitness,
    pricePerPost: 12000
  },
  { 
    id: 4, 
    name: "Juliana Santos", 
    category: "Business & Empreendedorismo", 
    followers: "1.8M", 
    engagement: "14.2%",
    image: influencerBusiness,
    pricePerPost: 7000
  }
];

export const CreateCampaignModal = ({ open, onOpenChange }: CreateCampaignModalProps) => {
  const [selectedInfluencers, setSelectedInfluencers] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      influencers: [],
      budget: 25000,
      expectedReach: 100000,
      expectedEngagement: 10
    }
  });

  const objective = watch("objective");

  const toggleInfluencer = (id: number) => {
    const newSelection = selectedInfluencers.includes(id)
      ? selectedInfluencers.filter(i => i !== id)
      : [...selectedInfluencers, id];
    
    setSelectedInfluencers(newSelection);
    setValue("influencers", newSelection, { shouldValidate: true });
  };

  const calculateEstimatedCost = () => {
    return selectedInfluencers.reduce((total, id) => {
      const influencer = influencers.find(i => i.id === id);
      return total + (influencer?.pricePerPost || 0);
    }, 0);
  };

  const onSubmit = async (data: CampaignFormData) => {
    try {
      // Aqui você implementaria a lógica de criação da campanha
      console.log("Campaign data:", data);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Campanha criada com sucesso!");
      reset();
      setSelectedInfluencers([]);
      setStartDate(undefined);
      setEndDate(undefined);
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao criar campanha. Tente novamente.");
    }
  };

  const objectiveOptions = [
    { value: "awareness", label: "Reconhecimento de Marca", icon: Eye },
    { value: "engagement", label: "Engajamento", icon: TrendingUp },
    { value: "conversion", label: "Conversão de Vendas", icon: Target },
    { value: "traffic", label: "Tráfego para Site", icon: Users }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Nova Campanha
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha os detalhes da sua campanha e selecione os influenciadores ideais
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome da Campanha */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Nome da Campanha
              </Label>
              <Input
                id="name"
                placeholder="Ex: Lançamento Produto X - Verão 2024"
                {...register("name")}
                className="bg-background/50 border-primary/30 focus:border-primary"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Objetivo */}
            <div className="space-y-2">
              <Label htmlFor="objective" className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Objetivo Principal
              </Label>
              <Select
                value={objective}
                onValueChange={(value) => setValue("objective", value as any, { shouldValidate: true })}
              >
                <SelectTrigger className="bg-background/50 border-primary/30 focus:border-primary">
                  <SelectValue placeholder="Selecione o objetivo" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-primary/20">
                  {objectiveOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.objective && (
                <p className="text-sm text-destructive">{errors.objective.message}</p>
              )}
            </div>

            {/* Briefing */}
            <div className="space-y-2">
              <Label htmlFor="briefing" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Briefing Detalhado
              </Label>
              <Textarea
                id="briefing"
                placeholder="Descreva os objetivos, público-alvo, mensagens-chave, tom de voz, deliverables esperados..."
                {...register("briefing")}
                className="min-h-[120px] bg-background/50 border-primary/30 focus:border-primary resize-none"
              />
              {errors.briefing && (
                <p className="text-sm text-destructive">{errors.briefing.message}</p>
              )}
            </div>

            {/* Budget e Datas */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Budget (R$)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  step="1000"
                  {...register("budget", { valueAsNumber: true })}
                  className="bg-background/50 border-primary/30 focus:border-primary"
                />
                {errors.budget && (
                  <p className="text-sm text-destructive">{errors.budget.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  Data de Início
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background/50 border-primary/30",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card/95 backdrop-blur-xl border-primary/20">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        setValue("startDate", date as Date, { shouldValidate: true });
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  Data de Término
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background/50 border-primary/30",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card/95 backdrop-blur-xl border-primary/20">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        setValue("endDate", date as Date, { shouldValidate: true });
                      }}
                      initialFocus
                      disabled={(date) => startDate ? date < startDate : false}
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* KPIs Esperados */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expectedReach">Alcance Esperado</Label>
                <Input
                  id="expectedReach"
                  type="number"
                  step="1000"
                  {...register("expectedReach", { valueAsNumber: true })}
                  className="bg-background/50 border-primary/30 focus:border-primary"
                />
                {errors.expectedReach && (
                  <p className="text-sm text-destructive">{errors.expectedReach.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedEngagement">Engajamento Esperado (%)</Label>
                <Input
                  id="expectedEngagement"
                  type="number"
                  step="0.1"
                  {...register("expectedEngagement", { valueAsNumber: true })}
                  className="bg-background/50 border-primary/30 focus:border-primary"
                />
                {errors.expectedEngagement && (
                  <p className="text-sm text-destructive">{errors.expectedEngagement.message}</p>
                )}
              </div>
            </div>

            {/* Seleção de Influenciadores */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Selecionar Influenciadores ({selectedInfluencers.length})
              </Label>
              
              <div className="grid md:grid-cols-2 gap-4">
                {influencers.map((influencer) => {
                  const isSelected = selectedInfluencers.includes(influencer.id);
                  
                  return (
                    <div
                      key={influencer.id}
                      onClick={() => toggleInfluencer(influencer.id)}
                      className={cn(
                        "relative group cursor-pointer transition-all",
                        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      )}
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-300" />
                      
                      <div className="relative bg-card/60 backdrop-blur border border-border/50 rounded-2xl p-4 hover:border-primary/50 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <img
                              src={influencer.image}
                              alt={influencer.name}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                            <Checkbox
                              checked={isSelected}
                              className="absolute -top-2 -right-2 bg-background"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm mb-1">{influencer.name}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{influencer.category}</p>
                            
                            <div className="flex items-center gap-3 text-xs">
                              <span className="text-muted-foreground">{influencer.followers}</span>
                              <Badge variant="secondary" className="text-xs">
                                {influencer.engagement} eng.
                              </Badge>
                            </div>
                            
                            <p className="text-xs font-semibold text-primary mt-2">
                              R$ {influencer.pricePerPost.toLocaleString('pt-BR')} / post
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {errors.influencers && (
                <p className="text-sm text-destructive">{errors.influencers.message}</p>
              )}

              {/* Resumo da Seleção */}
              {selectedInfluencers.length > 0 && (
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold mb-1">Custo Estimado por Post</p>
                      <p className="text-2xl font-bold text-primary">
                        R$ {calculateEstimatedCost().toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Taxa Arcana (10%)</p>
                      <p className="text-lg font-bold">
                        R$ {(calculateEstimatedCost() * 0.1).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-border/30">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {isSubmitting ? "Criando..." : "Criar Campanha"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};