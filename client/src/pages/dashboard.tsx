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
import { queryClient } from "@/lib/queryClient";
import { API_URL } from "@/lib/config";
import { NovaAIEngineHome } from "@/components/nova-ai-engine-home";
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
  Settings,
  User,
  CreditCard,
  History,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Eye,
  Calendar,
  ChevronRight,
  Trophy,
  Target,
  Lock,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
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
} from "@/components/ui/sidebar";

type TabType = "overview" | "verifications" | "profile" | "security";

export default function UserDashboard() {
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [recentActivity, setRecentActivity] = useState<string[]>([]);

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
      // Send auth token to identify the client
      socket.send(JSON.stringify({ type: "auth", token }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "verification_created") {
        // New verification created by this user
        queryClient.invalidateQueries({ queryKey: ["/api/verifications"] });
        setRecentActivity(prev => [`Nouvelle verification envoyee - ${new Date().toLocaleTimeString()}`, ...prev.slice(0, 4)]);
      }
      if (data.type === "verification_status_changed") {
        // Verification status updated by admin
        queryClient.invalidateQueries({ queryKey: ["/api/verifications"] });
        setRecentActivity(prev => [`Mise a jour de verification - ${new Date().toLocaleTimeString()}`, ...prev.slice(0, 4)]);
      }
    };

    socket.onclose = () => console.log("[WS] User disconnected");

    setWs(socket);
    return () => socket.close();
  }, [token]);

  const { data: verifications = [], isLoading } = useQuery<Verification[]>({
    queryKey: ["/api/verifications"],
    enabled: !!token,
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
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Valide</Badge>;
      case "invalid":
        return <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">Invalide</Badge>;
      case "already_used":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Deja utilise</Badge>;
      default:
        return <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">En attente</Badge>;
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
    { id: "overview" as TabType, label: "Vue d'ensemble", icon: BarChart3 },
    { id: "verifications" as TabType, label: "Mes verifications", icon: FileCheck },
    { id: "profile" as TabType, label: "Mon profil", icon: User },
    { id: "security" as TabType, label: "Securite", icon: Lock },
  ];

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-gradient-to-r from-violet-600 to-cyan-600 opacity-30 animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-violet-500 relative" />
          </div>
          <p className="mt-4 text-slate-400">Chargement de votre espace...</p>
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
                <span className="text-xs text-slate-400">Niveau de confiance</span>
                <Badge className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </div>
              <Progress value={successRate} className="h-2" />
              <p className="text-xs text-slate-500 mt-1">{successRate}% de reussite</p>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-500 uppercase text-xs tracking-wider">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveTab(item.id)}
                        className={activeTab === item.id ? "bg-violet-500/20 text-violet-400" : "text-slate-400"}
                        data-testid={`button-nav-${item.id}`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-500 uppercase text-xs tracking-wider">Actions rapides</SidebarGroupLabel>
              <SidebarGroupContent>
                <Button 
                  className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-0"
                  onClick={() => setLocation("/")}
                  data-testid="button-new-verification-sidebar"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle verification
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
                Retour a l'accueil
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-rose-400"
                onClick={handleLogout}
                data-testid="button-user-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Deconnexion
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
                  <h1 className="text-lg font-bold text-white">Mon Espace KouponTrust</h1>
                  <p className="text-xs text-slate-500 hidden sm:block">Tableau de bord personnel</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-emerald-400 hidden sm:inline">En ligne</span>
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
                      Bienvenue, {user.firstName}
                    </h2>
                    <p className="text-slate-400 mt-1">Voici un resume de votre activite</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
                    <Sparkles className="h-4 w-4 text-violet-400" />
                    <span className="text-sm text-slate-300">IA active</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-slate-900/50 border-slate-800 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-slate-400">Total verifications</p>
                          <p className="text-3xl font-bold text-white mt-1">{verifications.length}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                            <span className="text-xs text-emerald-400">+{completedCount} traitees</span>
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
                          <p className="text-sm text-slate-400">En attente</p>
                          <p className="text-3xl font-bold text-white mt-1">{pendingCount}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="h-3 w-3 text-amber-400" />
                            <span className="text-xs text-amber-400">Traitement en cours</span>
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
                          <p className="text-sm text-slate-400">Valides</p>
                          <p className="text-3xl font-bold text-white mt-1">{validCount}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="h-3 w-3 text-emerald-400" />
                            <span className="text-xs text-emerald-400">{successRate}% reussite</span>
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
                          <p className="text-sm text-slate-400">Montant verifie</p>
                          <p className="text-3xl font-bold text-white mt-1">{validAmount.toFixed(0)}EUR</p>
                          <div className="flex items-center gap-1 mt-2">
                            <CreditCard className="h-3 w-3 text-cyan-400" />
                            <span className="text-xs text-cyan-400">{totalAmount.toFixed(0)} EUR total</span>
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
                          Activite recente
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
                                {formatDistanceToNow(new Date(v.createdAt), { addSuffix: true, locale: fr })}
                              </span>
                            </div>
                          ))}
                          {verifications.length === 0 && (
                            <div className="text-center py-8">
                              <p className="text-sm text-slate-500">Aucune activite</p>
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
                            <p className="font-semibold text-white">Objectif du mois</p>
                            <p className="text-xs text-slate-400">Verifiez 10 coupons</p>
                          </div>
                        </div>
                        <Progress value={(verifications.length / 10) * 100} className="h-2 mb-2" />
                        <p className="text-xs text-slate-400">{verifications.length}/10 verifications</p>
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
                    <h2 className="text-2xl font-bold text-white">Mes verifications</h2>
                    <p className="text-slate-400 mt-1">Historique complet de vos demandes</p>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-violet-600 to-cyan-600"
                    onClick={() => setLocation("/")}
                    data-testid="button-new-verification"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle verification
                  </Button>
                </div>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="bg-slate-900/50 border border-slate-800">
                    <TabsTrigger value="all" data-testid="tab-all">Toutes ({verifications.length})</TabsTrigger>
                    <TabsTrigger value="pending" data-testid="tab-pending">En attente ({pendingCount})</TabsTrigger>
                    <TabsTrigger value="valid" data-testid="tab-valid">Valides ({validCount})</TabsTrigger>
                    <TabsTrigger value="invalid" data-testid="tab-invalid">Invalides ({invalidCount})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <VerificationList verifications={verifications} isLoading={isLoading} getStatusIcon={getStatusIcon} getStatusBadge={getStatusBadge} setLocation={setLocation} />
                  </TabsContent>
                  <TabsContent value="pending" className="mt-4">
                    <VerificationList verifications={verifications.filter(v => v.status === "pending")} isLoading={isLoading} getStatusIcon={getStatusIcon} getStatusBadge={getStatusBadge} setLocation={setLocation} />
                  </TabsContent>
                  <TabsContent value="valid" className="mt-4">
                    <VerificationList verifications={verifications.filter(v => v.status === "valid")} isLoading={isLoading} getStatusIcon={getStatusIcon} getStatusBadge={getStatusBadge} setLocation={setLocation} />
                  </TabsContent>
                  <TabsContent value="invalid" className="mt-4">
                    <VerificationList verifications={verifications.filter(v => v.status === "invalid" || v.status === "already_used")} isLoading={isLoading} getStatusIcon={getStatusIcon} getStatusBadge={getStatusBadge} setLocation={setLocation} />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-white">Mon profil</h2>
                  <p className="text-slate-400 mt-1">Gerez vos informations personnelles</p>
                </div>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Informations personnelles</CardTitle>
                    <CardDescription>Vos donnees de compte</CardDescription>
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
                        <Badge className="mt-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white">Compte verifie</Badge>
                      </div>
                    </div>

                    <Separator className="bg-slate-800" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-slate-800/50">
                        <p className="text-sm text-slate-400 mb-1">Prenom</p>
                        <p className="text-white font-medium">{user.firstName}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-800/50">
                        <p className="text-sm text-slate-400 mb-1">Nom</p>
                        <p className="text-white font-medium">{user.lastName}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-800/50 md:col-span-2">
                        <p className="text-sm text-slate-400 mb-1">Email</p>
                        <p className="text-white font-medium">{user.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Statistiques du compte</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-lg bg-slate-800/50">
                        <p className="text-2xl font-bold text-violet-400">{verifications.length}</p>
                        <p className="text-xs text-slate-400">Verifications</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-slate-800/50">
                        <p className="text-2xl font-bold text-emerald-400">{successRate}%</p>
                        <p className="text-xs text-slate-400">Taux de reussite</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-slate-800/50">
                        <p className="text-2xl font-bold text-cyan-400">{validAmount.toFixed(0)}</p>
                        <p className="text-xs text-slate-400">EUR verifies</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-slate-800/50">
                        <p className="text-2xl font-bold text-amber-400">Premium</p>
                        <p className="text-xs text-slate-400">Niveau</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-white">Securite</h2>
                  <p className="text-slate-400 mt-1">Gerez la securite de votre compte</p>
                </div>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-emerald-400" />
                      Etat de securite
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                        <div>
                          <p className="text-white font-medium">Email verifie</p>
                          <p className="text-xs text-slate-400">Votre email a ete confirme</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-emerald-400" />
                        <div>
                          <p className="text-white font-medium">Connexion securisee</p>
                          <p className="text-xs text-slate-400">Chiffrement SSL/TLS</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-violet-400" />
                        <div>
                          <p className="text-white font-medium">Verification IA</p>
                          <p className="text-xs text-slate-400">Detection de fraude activee</p>
                        </div>
                      </div>
                      <Badge className="bg-violet-500/20 text-violet-400">Premium</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Session active</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/20">
                          <Activity className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Session actuelle</p>
                          <p className="text-xs text-slate-400">Connecte maintenant</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-rose-500/30 text-rose-400"
                        onClick={handleLogout}
                        data-testid="button-logout-security"
                      >
                        Deconnexion
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
}

function VerificationList({ verifications, isLoading, getStatusIcon, getStatusBadge, setLocation }: VerificationListProps) {
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
          <h3 className="text-lg font-medium text-white mb-2">Aucune verification</h3>
          <p className="text-slate-500 mb-6">Aucune demande dans cette categorie</p>
          <Button
            className="bg-gradient-to-r from-violet-600 to-cyan-600"
            onClick={() => setLocation("/")}
          >
            <Shield className="h-4 w-4 mr-2" />
            Faire une verification
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
          className="bg-slate-900/50 border-slate-800 hover-elevate overflow-visible transition-all duration-200"
          data-testid={`card-verification-${v.id}`}
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
                    {format(new Date(v.createdAt), "dd MMM yyyy, HH:mm", { locale: fr })}
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
