import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LanguageSelector } from "@/components/language-selector";
import { queryClient } from "@/lib/queryClient";
import { API_URL } from "@/lib/config";
import { NovaAIEngineHome } from "@/components/nova-ai-engine-home";
import { TwoFactorSetup } from "@/components/two-factor-setup";
import type { Verification } from "@shared/schema";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  LogOut,
  FileCheck,
  Loader2,
  Home,
  Plus,
  Activity,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Bell,
  User,
  CreditCard,
  Star,
  ArrowUpRight,
  Sparkles,
  Calendar,
  ChevronRight,
  Trophy,
  Lock,
} from "lucide-react";
import { format, formatDistanceToNow, Locale } from "date-fns";
import { fr, nl, de, it, enUS } from "date-fns/locale";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

type TabType = "overview" | "verifications" | "profile" | "security";

const dateLocales = { fr, nl, de, it, en: enUS };

function SidebarNavItem({ 
  item, 
  activeTab, 
  onSelect 
}: { 
  item: { id: TabType; label: string; icon: any }; 
  activeTab: TabType; 
  onSelect: (id: TabType) => void;
}) {
  const { setOpenMobile, isMobile } = useSidebar();
  
  const handleClick = () => {
    onSelect(item.id);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={handleClick}
        className={activeTab === item.id ? "bg-violet-500/20 text-violet-400" : "text-slate-400"}
        data-testid={`button-nav-${item.id}`}
      >
        <item.icon className="h-4 w-4" />
        <span>{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function UserDashboard() {
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const { t, language } = useI18n();
  const [, setLocation] = useLocation();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

  const dateLocale = dateLocales[language] || fr;

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (!token) return;

    const wsUrl = API_URL.replace("http", "ws") + "/ws";
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("[WS] User connected");
      socket.send(JSON.stringify({ type: "auth", token }));
      // Refetch data after WebSocket auth to catch any missed notifications
      queryClient.invalidateQueries({ queryKey: ["/api/verifications"] });
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "verification_created") {
        queryClient.invalidateQueries({ queryKey: ["/api/verifications"] });
        setRecentActivity(prev => [`${t("dashboard.newVerification")} - ${new Date().toLocaleTimeString()}`, ...prev.slice(0, 4)]);
      }
      if (data.type === "verification_status_changed") {
        queryClient.invalidateQueries({ queryKey: ["/api/verifications"] });
        setRecentActivity(prev => [`${t("dashboard.processing")} - ${new Date().toLocaleTimeString()}`, ...prev.slice(0, 4)]);
      }
    };

    socket.onclose = () => console.log("[WS] User disconnected");

    setWs(socket);
    return () => socket.close();
  }, [token, t]);

  const { data: verifications = [], isLoading } = useQuery<Verification[]>({
    queryKey: ["/api/verifications"],
    enabled: !!token,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/verifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case "invalid":
        return <XCircle className="h-5 w-5 text-rose-400" />;
      case "already_used":
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      default:
        return <Clock className="h-5 w-5 text-violet-400 animate-pulse" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{t("status.valid")}</Badge>;
      case "invalid":
        return <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">{t("status.invalid")}</Badge>;
      case "already_used":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{t("status.already_used")}</Badge>;
      default:
        return <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">{t("status.pending")}</Badge>;
    }
  };

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const pendingCount = verifications.filter((v) => v.status === "pending").length;
  const completedCount = verifications.filter((v) => v.status !== "pending").length;
  const validCount = verifications.filter((v) => v.status === "valid").length;
  const invalidCount = verifications.filter((v) => v.status === "invalid").length;
  const totalAmount = verifications.reduce((sum, v) => sum + v.amount, 0);
  const validAmount = verifications.filter(v => v.status === "valid").reduce((sum, v) => sum + v.amount, 0);
  const successRate = verifications.length > 0 ? Math.round((validCount / verifications.length) * 100) : 0;

  const sidebarItems = [
    { id: "overview" as TabType, label: t("dashboard.overview"), icon: BarChart3 },
    { id: "verifications" as TabType, label: t("dashboard.myVerifications"), icon: FileCheck },
    { id: "profile" as TabType, label: t("dashboard.myProfile"), icon: User },
    { id: "security" as TabType, label: t("dashboard.security"), icon: Lock },
  ];

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-gradient-to-r from-violet-600 to-cyan-600 opacity-30 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-violet-500 relative" />
          </div>
          <p className="mt-4 text-slate-400">{t("dashboard.loading")}</p>
        </div>
      </div>
    );
  }

  const sidebarStyle = {
    "--sidebar-width": "280px",
    "--sidebar-width-icon": "60px",
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Sidebar className="border-r border-violet-500/10">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 blur-md bg-gradient-to-r from-violet-600 to-cyan-600 opacity-50" />
                <Avatar className="h-12 w-12 relative border-2 border-violet-500/30">
                  <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-600 text-white font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">{t("dashboard.trustLevel")}</span>
                <Badge className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  {t("dashboard.premium")}
                </Badge>
              </div>
              <Progress value={successRate} className="h-2" />
              <p className="text-xs text-slate-500 mt-1">{successRate}% {t("dashboard.successRate")}</p>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-500 uppercase text-xs tracking-wider">{t("dashboard.navigation")}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarNavItem 
                      key={item.id} 
                      item={item} 
                      activeTab={activeTab} 
                      onSelect={setActiveTab} 
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-500 uppercase text-xs tracking-wider">{t("dashboard.quickActions")}</SidebarGroupLabel>
              <SidebarGroupContent>
                <Button 
                  className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-0"
                  onClick={() => setLocation("/")}
                  data-testid="button-new-verification-sidebar"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("dashboard.newVerification")}
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-slate-800">
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-400"
                onClick={() => setLocation("/")}
                data-testid="button-back-home"
              >
                <Home className="h-4 w-4 mr-2" />
                {t("dashboard.backToHome")}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-rose-400"
                onClick={handleLogout}
                data-testid="button-user-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("dashboard.logout")}
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-50 border-b border-violet-500/10 bg-slate-950/80 backdrop-blur-xl">
            <div className="px-4 md:px-6 h-16 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-slate-400" data-testid="button-sidebar-toggle" />
                <div>
                  <h1 className="text-lg font-bold text-white">{t("dashboard.mySpace")}</h1>
                  <p className="text-xs text-slate-500 hidden sm:block">{t("dashboard.personalDashboard")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <LanguageSelector />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-400 hidden sm:inline">{t("dashboard.online")}</span>
                </div>
                <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                  <Bell className="h-5 w-5 text-slate-400" />
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-violet-500 text-[10px] text-white flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {t("dashboard.welcome")} {user.firstName}
                    </h2>
                    <p className="text-slate-400 mt-1">{t("dashboard.activitySummary")}</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
                    <Sparkles className="h-4 w-4 text-violet-400" />
                    <span className="text-sm text-slate-300">{t("dashboard.aiActive")}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-slate-900/50 border-slate-800 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-slate-400">{t("dashboard.totalVerifications")}</p>
                          <p className="text-3xl font-bold text-white mt-1">{verifications.length}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                            <span className="text-xs text-emerald-400">+{completedCount} {t("dashboard.processed")}</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-violet-500/20">
                          <FileCheck className="h-6 w-6 text-violet-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-slate-400">{t("dashboard.pending")}</p>
                          <p className="text-3xl font-bold text-white mt-1">{pendingCount}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="h-3 w-3 text-amber-400" />
                            <span className="text-xs text-amber-400">{t("dashboard.processing")}</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500/20">
                          <Clock className="h-6 w-6 text-amber-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-slate-400">{t("dashboard.valid")}</p>
                          <p className="text-3xl font-bold text-white mt-1">{validCount}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="h-3 w-3 text-emerald-400" />
                            <span className="text-xs text-emerald-400">{successRate}% {t("dashboard.successRate")}</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/20">
                          <CheckCircle className="h-6 w-6 text-emerald-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-slate-400">{t("dashboard.verifiedAmount")}</p>
                          <p className="text-3xl font-bold text-white mt-1">{validAmount.toFixed(0)}EUR</p>
                          <div className="flex items-center gap-1 mt-2">
                            <CreditCard className="h-3 w-3 text-cyan-400" />
                            <span className="text-xs text-cyan-400">{totalAmount.toFixed(0)} EUR {t("dashboard.total")}</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-cyan-500/20">
                          <CreditCard className="h-6 w-6 text-cyan-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <NovaAIEngineHome />
                  </div>

                  <div className="space-y-6">
                    <Card className="bg-slate-900/50 border-slate-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                          <Activity className="h-4 w-4 text-violet-400" />
                          {t("dashboard.recentActivity")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px]">
                          {verifications.slice(0, 5).map((v, i) => (
                            <div key={v.id} className="flex items-center gap-3 py-3 border-b border-slate-800 last:border-0">
                              {getStatusIcon(v.status)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">{v.couponType}</p>
                                <p className="text-xs text-slate-500">{v.amount} EUR</p>
                              </div>
                              <span className="text-xs text-slate-600">
                                {formatDistanceToNow(new Date(v.createdAt), { addSuffix: true, locale: dateLocale })}
                              </span>
                            </div>
                          ))}
                          {verifications.length === 0 && (
                            <div className="text-center py-8">
                              <p className="text-sm text-slate-500">{t("dashboard.noActivity")}</p>
                            </div>
                          )}
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-violet-900/30 to-cyan-900/30 border-violet-500/20">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600">
                            <Trophy className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{t("dashboard.monthlyGoal")}</p>
                            <p className="text-xs text-slate-400">{t("dashboard.verifyCoupons")}</p>
                          </div>
                        </div>
                        <Progress value={(verifications.length / 10) * 100} className="h-2 mb-2" />
                        <p className="text-xs text-slate-400">{verifications.length}/10 {t("dashboard.verifications")}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "verifications" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{t("dashboard.myVerifications")}</h2>
                    <p className="text-slate-400 mt-1">{t("dashboard.fullHistory")}</p>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-violet-600 to-cyan-600"
                    onClick={() => setLocation("/")}
                    data-testid="button-new-verification"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("dashboard.newVerification")}
                  </Button>
                </div>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="bg-slate-900/50 border border-slate-800">
                    <TabsTrigger value="all" data-testid="tab-all">{t("dashboard.all")} ({verifications.length})</TabsTrigger>
                    <TabsTrigger value="pending" data-testid="tab-pending">{t("dashboard.pending")} ({pendingCount})</TabsTrigger>
                    <TabsTrigger value="valid" data-testid="tab-valid">{t("dashboard.valid")} ({validCount})</TabsTrigger>
                    <TabsTrigger value="invalid" data-testid="tab-invalid">{t("dashboard.invalid")} ({invalidCount})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <VerificationList verifications={verifications} isLoading={isLoading} getStatusIcon={getStatusIcon} getStatusBadge={getStatusBadge} setLocation={setLocation} t={t} dateLocale={dateLocale} />
                  </TabsContent>
                  <TabsContent value="pending" className="mt-4">
                    <VerificationList verifications={verifications.filter(v => v.status === "pending")} isLoading={isLoading} getStatusIcon={getStatusIcon} getStatusBadge={getStatusBadge} setLocation={setLocation} t={t} dateLocale={dateLocale} />
                  </TabsContent>
                  <TabsContent value="valid" className="mt-4">
                    <VerificationList verifications={verifications.filter(v => v.status === "valid")} isLoading={isLoading} getStatusIcon={getStatusIcon} getStatusBadge={getStatusBadge} setLocation={setLocation} t={t} dateLocale={dateLocale} />
                  </TabsContent>
                  <TabsContent value="invalid" className="mt-4">
                    <VerificationList verifications={verifications.filter(v => v.status === "invalid" || v.status === "already_used")} isLoading={isLoading} getStatusIcon={getStatusIcon} getStatusBadge={getStatusBadge} setLocation={setLocation} t={t} dateLocale={dateLocale} />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-white">{t("dashboard.myProfile")}</h2>
                  <p className="text-slate-400 mt-1">{t("dashboard.manageInfo")}</p>
                </div>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">{t("dashboard.personalInfo")}</CardTitle>
                    <CardDescription>{t("dashboard.manageInfo")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 blur-md bg-gradient-to-r from-violet-600 to-cyan-600 opacity-50" />
                        <Avatar className="h-20 w-20 relative border-2 border-violet-500/30">
                          <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-600 text-white text-2xl font-bold">
                            {user.firstName[0]}{user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-white">{user.firstName} {user.lastName}</p>
                        <p className="text-slate-400">{user.email}</p>
                        <Badge className="mt-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white">{t("dashboard.verified")}</Badge>
                      </div>
                    </div>

                    <Separator className="bg-slate-800" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-slate-800/50">
                        <p className="text-sm text-slate-400 mb-1">{t("form.firstName")}</p>
                        <p className="text-white font-medium">{user.firstName}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-800/50">
                        <p className="text-sm text-slate-400 mb-1">{t("form.lastName")}</p>
                        <p className="text-white font-medium">{user.lastName}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-800/50 md:col-span-2">
                        <p className="text-sm text-slate-400 mb-1">{t("dashboard.email")}</p>
                        <p className="text-white font-medium">{user.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">{t("dashboard.statistics")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-lg bg-slate-800/50">
                        <p className="text-2xl font-bold text-violet-400">{verifications.length}</p>
                        <p className="text-xs text-slate-400">{t("dashboard.verifications")}</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-slate-800/50">
                        <p className="text-2xl font-bold text-emerald-400">{successRate}%</p>
                        <p className="text-xs text-slate-400">{t("dashboard.successRate")}</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-slate-800/50">
                        <p className="text-2xl font-bold text-cyan-400">{validAmount.toFixed(0)}</p>
                        <p className="text-xs text-slate-400">EUR {t("dashboard.verified")}</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-slate-800/50">
                        <p className="text-2xl font-bold text-amber-400">{t("dashboard.premium")}</p>
                        <p className="text-xs text-slate-400">{t("dashboard.trustLevel")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-white">{t("dashboard.security")}</h2>
                  <p className="text-slate-400 mt-1">{t("dashboard.manageSecuritySettings")}</p>
                </div>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-emerald-400" />
                      {t("dashboard.securitySettings")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                        <div>
                          <p className="text-white font-medium">{t("dashboard.email")} {t("dashboard.verified")}</p>
                          <p className="text-xs text-slate-400">{t("dashboard.verified")}</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400">{t("dashboard.online")}</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-emerald-400" />
                        <div>
                          <p className="text-white font-medium">SSL/TLS</p>
                          <p className="text-xs text-slate-400">{t("dashboard.verified")}</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400">{t("dashboard.online")}</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-violet-400" />
                        <div>
                          <p className="text-white font-medium">{t("dashboard.aiActive")}</p>
                          <p className="text-xs text-slate-400">{t("dashboard.premium")}</p>
                        </div>
                      </div>
                      <Badge className="bg-violet-500/20 text-violet-400">{t("dashboard.premium")}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">{t("dashboard.activeSessions")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/20">
                          <Activity className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{t("dashboard.online")}</p>
                          <p className="text-xs text-slate-400">{t("dashboard.activeSessions")}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-rose-500/30 text-rose-400"
                        onClick={handleLogout}
                        data-testid="button-logout-security"
                      >
                        {t("dashboard.logout")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <TwoFactorSetup />
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

interface VerificationListProps {
  verifications: Verification[];
  isLoading: boolean;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusBadge: (status: string) => React.ReactNode;
  setLocation: (path: string) => void;
  t: (key: string) => string;
  dateLocale: Locale;
}

function VerificationList({ verifications, isLoading, getStatusIcon, getStatusBadge, setLocation, t, dateLocale }: VerificationListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (verifications.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="py-12 text-center">
          <div className="p-4 rounded-full bg-slate-800/50 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <FileCheck className="h-10 w-10 text-slate-600" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">{t("dashboard.noVerifications")}</h3>
          <p className="text-slate-500 mb-6">{t("dashboard.startFirstVerification")}</p>
          <Button
            className="bg-gradient-to-r from-violet-600 to-cyan-600"
            onClick={() => setLocation("/")}
          >
            <Shield className="h-4 w-4 mr-2" />
            {t("dashboard.newVerification")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {verifications.map((v) => (
        <Card
          key={v.id}
          className="bg-slate-900/50 border-slate-800 hover-elevate overflow-visible transition-all duration-200 cursor-pointer"
          data-testid={`card-verification-${v.id}`}
          onClick={() => setLocation(`/verification?id=${v.id}`)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-slate-800/50">
                {getStatusIcon(v.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-white">{v.couponType}</span>
                  {getStatusBadge(v.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
                  <span className="font-mono text-cyan-400">{v.couponCode.substring(0, 4)}****</span>
                  <span className="font-medium text-white">{v.amount} EUR</span>
                  <span className="text-slate-500">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {format(new Date(v.createdAt), "dd MMM yyyy, HH:mm", { locale: dateLocale })}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-600" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
