// ============================================
// QA ENVIRONMENT CONFIGURATION
// ============================================
// Este arquivo contém todas as configurações do ambiente de testes
// NÃO MODIFICAR em produção

export const QA_CONFIG = {
  // Email do usuário de teste
  QA_USER_EMAIL: "qa-tester@arcana.internal",
  QA_USER_PASSWORD: "QA_Test_2024!",
  
  // Flags de teste (apenas para QA_USER)
  flags: {
    QA_MODE: true,
    BYPASS_PAYWALL: true,
    DISABLE_BILLING: true,
    SKIP_EMAILS: true,
    SKIP_METRICS: true,
  },
  
  // Tipo de usuário
  USER_TYPE: "QA_USER" as const,
  
  // Estados forçados para QA_USER
  forcedState: {
    plan: null,
    subscription: null,
    billing_status: "disabled",
    trial_active: false,
  }
};

// Verificar se é usuário QA
export const isQAUser = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return email.toLowerCase() === QA_CONFIG.QA_USER_EMAIL.toLowerCase();
};

// Verificar se QA Mode está ativo para o usuário
export const isQAModeActive = (email: string | null | undefined): boolean => {
  return isQAUser(email) && QA_CONFIG.flags.QA_MODE;
};

// Obter estado forçado para QA_USER
export const getQAForcedState = () => {
  return QA_CONFIG.forcedState;
};

// Lista completa de rotas do sistema para o QA Dashboard
export const SYSTEM_ROUTES = {
  public: [
    { path: "/", name: "Landing Page", description: "Página inicial pública" },
    { path: "/login", name: "Login", description: "Página de autenticação" },
  ],
  private: [
    { path: "/app/dashboard", name: "Dashboard", description: "Painel principal", requiresAuth: true },
    { path: "/app/talentos", name: "Talentos", description: "Explorar influenciadores", requiresAuth: true },
    { path: "/app/campanhas", name: "Campanhas", description: "Gerenciar campanhas", requiresAuth: true },
    { path: "/app/contratos", name: "Contratos", description: "Contratos ativos", requiresAuth: true },
    { path: "/app/pagamentos", name: "Pagamentos", description: "Histórico financeiro", requiresAuth: true },
    { path: "/app/monitoramento", name: "Monitoramento", description: "Analytics em tempo real", requiresAuth: true },
    { path: "/app/ia-insights", name: "IA Insights", description: "Insights de IA", requiresAuth: true },
    { path: "/app/avatar-studio", name: "Avatar Studio", description: "Criar avatares", requiresAuth: true },
    { path: "/app/ai-studio", name: "AI Studio", description: "Estúdio de IA", requiresAuth: true },
    { path: "/app/liveshop", name: "Live Shop", description: "Vendas ao vivo", requiresAuth: true },
    { path: "/app/consultoria", name: "Consultoria", description: "Consultor IA", requiresAuth: true },
    { path: "/app/planos", name: "Planos", description: "Assinaturas", requiresAuth: true },
    { path: "/app/perfil", name: "Perfil", description: "Configurações do usuário", requiresAuth: true },
    { path: "/app/chat", name: "Chat", description: "Mensagens", requiresAuth: true },
    { path: "/app/analytics", name: "Analytics", description: "Métricas detalhadas", requiresAuth: true },
  ],
  influencer: [
    { path: "/app/influencer/contratos", name: "Contratos (Influencer)", description: "Contratos do influencer", requiresAuth: true, role: "influencer" },
    { path: "/app/influencer/pagamentos", name: "Pagamentos (Influencer)", description: "Recebimentos", requiresAuth: true, role: "influencer" },
    { path: "/app/influencer/monitoramento", name: "Monitoramento (Influencer)", description: "Métricas", requiresAuth: true, role: "influencer" },
    { path: "/app/influencer/analytics", name: "Analytics (Influencer)", description: "Performance", requiresAuth: true, role: "influencer" },
  ],
  admin: [
    { path: "/admin", name: "Admin Dashboard", description: "Painel administrativo", requiresAuth: true, role: "admin" },
    { path: "/admin/influencers", name: "Gerenciar Influencers", description: "Administrar influenciadores", requiresAuth: true, role: "admin" },
    { path: "/admin/brands", name: "Gerenciar Marcas", description: "Administrar marcas", requiresAuth: true, role: "admin" },
    { path: "/admin/campaigns", name: "Gerenciar Campanhas", description: "Todas campanhas", requiresAuth: true, role: "admin" },
    { path: "/admin/financial", name: "Financeiro", description: "Gestão financeira", requiresAuth: true, role: "admin" },
    { path: "/admin/whitelabel", name: "White Label", description: "Configurar white labels", requiresAuth: true, role: "admin" },
    { path: "/admin/support", name: "Suporte", description: "Tickets de suporte", requiresAuth: true, role: "admin" },
    { path: "/admin/logs", name: "Logs", description: "Logs do sistema", requiresAuth: true, role: "admin" },
    { path: "/admin/settings", name: "Configurações", description: "Settings do sistema", requiresAuth: true, role: "admin" },
  ],
  agency: [
    { path: "/app/agency/dashboard", name: "Agency Dashboard", description: "Painel da agência", requiresAuth: true },
  ],
  qa: [
    { path: "/test-login", name: "Test Login", description: "Login automático QA", isQAOnly: true },
    { path: "/qa-dashboard", name: "QA Dashboard", description: "Painel de testes", isQAOnly: true },
  ]
};

// Obter todas as rotas
export const getAllRoutes = () => {
  return [
    ...SYSTEM_ROUTES.public,
    ...SYSTEM_ROUTES.private,
    ...SYSTEM_ROUTES.influencer,
    ...SYSTEM_ROUTES.admin,
    ...SYSTEM_ROUTES.agency,
    ...SYSTEM_ROUTES.qa,
  ];
};
