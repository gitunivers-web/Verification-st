import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { LanguageSelector } from "@/components/language-selector";
import { queryClient } from "@/lib/queryClient";
import { API_URL } from "@/lib/config";
import { NovaAIEngineHome } from "@/components/nova-ai-engine-home";
import type { Verification } from "@shared/schema";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  FileCheck,
  LogOut,
  Loader2,
  Wifi,
  Home,
  Activity,
  Shield,
  BarChart3,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  TrendingUp,
  TrendingDown,
  Zap,
  AlertCircle,
  User,
  Mail,
  CreditCard,
  Calendar,
  ChevronRight,
  MoreHorizontal,
  Settings,
  Database,
  Server,
  Cpu,
  HardDrive,
  Globe,
  Lock,
  Sparkles,
  Target,
  Award,
} from "lucide-react";
import { format, formatDistanceToNow, subDays, isAfter } from "date-fns";
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

type AdminTab = "dashboard" | "verifications" | "analytics" | "system";

export default function AdminDashboard() {
  const { user, token, logout, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useI18n();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [realtimeEvents, setRealtimeEvents] = useState<{type: string, time: Date}[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      setLocation("/");
    }
  }, [isAdmin, setLocation]);

  useEffect(() => {
    const wsUrl = API_URL.replace("http", "ws") + "/ws";
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_verification") {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/verifications"] });
        setRealtimeEvents(prev => [{type: "Nouvelle verification", time: new Date()}, ...prev.slice(0, 9)]);
        toast({ 
          title: "Nouvelle demande", 
          description: "Une nouvelle verification vient d'arriver",
        });
      }
      if (data.type === "verification_updated") {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/verifications"] });
        setRealtimeEvents(prev => [{type: "Verification mise a jour", time: new Date()}, ...prev.slice(0, 9)]);
      }
      if (data.type === "online_count") {
        setOnlineCount(data.data.count);
      }
    };

    socket.onopen = () => console.log("[WS] Admin connected");
    socket.onclose = () => console.log("[WS] Admin disconnected");

    setWs(socket);
    return () => socket.close();
  }, [toast]);

  const { data: verifications = [], isLoading, refetch } = useQuery<Verification[]>({
    queryKey: ["/api/admin/verifications"],
    enabled: isAdmin,
    refetchInterval: 30000,
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/admin/verifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`${API_URL}/api/admin/verifications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verifications"] });
      setSelectedVerification(null);
      toast({ title: "Statut mis a jour", description: "La notification a ete envoyee a l'utilisateur" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de mettre a jour le statut", variant: "destructive" });
    },
  });

  const handleLogout = () => {
    logout();
    setLocation("/");
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
        return <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 animate-pulse">{t("status.pending")}</Badge>;
    }
  };

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

  const pendingCount = verifications.filter((v) => v.status === "pending").length;
  const validCount = verifications.filter((v) => v.status === "valid").length;
  const invalidCount = verifications.filter((v) => v.status === "invalid").length;
  const usedCount = verifications.filter((v) => v.status === "already_used").length;
  const todayCount = verifications.filter((v) => isAfter(new Date(v.createdAt), subDays(new Date(), 1))).length;
  const weekCount = verifications.filter((v) => isAfter(new Date(v.createdAt), subDays(new Date(), 7))).length;
  const registeredCount = verifications.filter((v) => v.isRegisteredUser).length;
  const guestCount = verifications.filter((v) => !v.isRegisteredUser).length;
  const totalAmount = verifications.reduce((sum, v) => sum + v.amount, 0);
  const avgAmount = verifications.length > 0 ? totalAmount / verifications.length : 0;
  const successRate = verifications.length > 0 ? Math.round((validCount / verifications.length) * 100) : 0;

  const filteredVerifications = verifications.filter((v) => {
    const matchesSearch = 
      v.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.couponCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sidebarItems = [
    { id: "dashboard" as AdminTab, label: "Tableau de bord", icon: BarChart3 },
    { id: "verifications" as AdminTab, label: "Verifications", icon: FileCheck, badge: pendingCount },
    { id: "analytics" as AdminTab, label: "Analytiques", icon: TrendingUp },
    { id: "system" as AdminTab, label: "Systeme", icon: Server },
  ];

  if (!isAdmin) return null;

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
                <div className="relative p-2 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="font-bold text-white">KouponTrust</p>
                <p className="text-xs text-violet-400">Administration</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Systeme operationnel</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Utilisateurs en ligne</span>
                <span className="text-white font-bold">{onlineCount}</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-500 uppercase text-xs tracking-wider">Menu principal</SidebarGroupLabel>
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
                        <span className="flex-1">{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge className="bg-violet-600 text-white text-[10px] px-1.5 py-0">{item.badge}</Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-500 uppercase text-xs tracking-wider">Activite temps reel</SidebarGroupLabel>
              <SidebarGroupContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2 pr-2">
                    {realtimeEvents.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">En attente d'evenements...</p>
                    ) : (
                      realtimeEvents.map((event, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/30">
                          <Zap className="h-3 w-3 text-violet-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-white truncate">{event.type}</p>
                            <p className="text-[10px] text-slate-500">
                              {formatDistanceToNow(event.time, { addSuffix: true, locale: fr })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10 border border-violet-500/30">
                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-cyan-600 text-white text-sm">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Administrateur</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-400"
                onClick={() => setLocation("/")}
                data-testid="button-back-home"
              >
                <Home className="h-4 w-4 mr-2" />
                Retour au site
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-rose-400"
                onClick={handleLogout}
                data-testid="button-admin-logout"
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
                  <h1 className="text-lg font-bold text-white">Panel Administrateur</h1>
                  <p className="text-xs text-slate-500 hidden sm:block">Gestion et supervision</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20" data-testid="indicator-online-users">
                  <Wifi className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">{onlineCount}</span>
                  <span className="text-xs text-emerald-400/70">en ligne</span>
                </div>
                <LanguageSelector />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={() => refetch()}
                  data-testid="button-refresh"
                >
                  <RefreshCw className={`h-5 w-5 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                  <Bell className="h-5 w-5 text-slate-400" />
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-violet-500 text-[10px] text-white flex items-center justify-center font-bold">
                      {pendingCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Tableau de bord</h2>
                    <p className="text-slate-400 mt-1">Vue d'ensemble de l'activite</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      IA Active
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-slate-900/50 border-slate-800 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-slate-400">Total demandes</p>
                          <p className="text-3xl font-bold text-white mt-1">{verifications.length}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="h-3 w-3 text-emerald-400" />
                            <span className="text-xs text-emerald-400">+{todayCount} aujourd'hui</span>
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
                            <AlertCircle className="h-3 w-3 text-amber-400" />
                            <span className="text-xs text-amber-400">A traiter</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-amber-500/20">
                          <Clock className="h-6 w-6 text-amber-400 animate-pulse" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-slate-400">Taux de reussite</p>
                          <p className="text-3xl font-bold text-white mt-1">{successRate}%</p>
                          <div className="flex items-center gap-1 mt-2">
                            <Target className="h-3 w-3 text-emerald-400" />
                            <span className="text-xs text-emerald-400">{validCount} valides</span>
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-500/20">
                          <Award className="h-6 w-6 text-emerald-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-slate-400">Volume total</p>
                          <p className="text-3xl font-bold text-white mt-1">{totalAmount.toFixed(0)}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <CreditCard className="h-3 w-3 text-cyan-400" />
                            <span className="text-xs text-cyan-400">EUR traites</span>
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
                          <Users className="h-4 w-4 text-violet-400" />
                          Repartition utilisateurs
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-emerald-400" />
                            <span className="text-sm text-slate-300">Inscrits</span>
                          </div>
                          <span className="text-sm font-bold text-white">{registeredCount}</span>
                        </div>
                        <Progress value={(registeredCount / (verifications.length || 1)) * 100} className="h-2" />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-slate-400" />
                            <span className="text-sm text-slate-300">Invites</span>
                          </div>
                          <span className="text-sm font-bold text-white">{guestCount}</span>
                        </div>
                        <Progress value={(guestCount / (verifications.length || 1)) * 100} className="h-2 [&>div]:bg-slate-500" />
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                          <Activity className="h-4 w-4 text-cyan-400" />
                          Dernières demandes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px]">
                          {verifications.slice(0, 5).map((v) => (
                            <div 
                              key={v.id} 
                              className="flex items-center gap-3 py-3 border-b border-slate-800 last:border-0 cursor-pointer hover-elevate overflow-visible rounded-lg px-2 -mx-2"
                              onClick={() => setSelectedVerification(v)}
                            >
                              {getStatusIcon(v.status)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white truncate">{v.firstName} {v.lastName}</p>
                                <p className="text-xs text-slate-500">{v.couponType} - {v.amount} EUR</p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-slate-600" />
                            </div>
                          ))}
                          {verifications.length === 0 && (
                            <div className="text-center py-8">
                              <p className="text-sm text-slate-500">Aucune demande</p>
                            </div>
                          )}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {pendingCount > 0 && (
                  <Card className="bg-gradient-to-r from-violet-900/30 to-amber-900/30 border-amber-500/30">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-amber-500/20 animate-pulse">
                            <AlertCircle className="h-6 w-6 text-amber-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{pendingCount} demande(s) en attente</p>
                            <p className="text-sm text-slate-400">Ces demandes necessitent votre attention</p>
                          </div>
                        </div>
                        <Button 
                          className="bg-gradient-to-r from-violet-600 to-cyan-600"
                          onClick={() => setActiveTab("verifications")}
                          data-testid="button-go-to-pending"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir les demandes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "verifications" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Gestion des verifications</h2>
                    <p className="text-slate-400 mt-1">{filteredVerifications.length} demande(s)</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-slate-700"
                    onClick={() => refetch()}
                    data-testid="button-refresh-verifications"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                </div>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          placeholder="Rechercher par nom, email ou code..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-slate-800/50 border-slate-700"
                          data-testid="input-search"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[200px] bg-slate-800/50 border-slate-700" data-testid="select-status-filter">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="valid">Valide</SelectItem>
                          <SelectItem value="invalid">Invalide</SelectItem>
                          <SelectItem value="already_used">Deja utilise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="bg-slate-900/50 border border-slate-800">
                    <TabsTrigger value="all" data-testid="tab-all">Toutes ({verifications.length})</TabsTrigger>
                    <TabsTrigger value="pending" data-testid="tab-pending">En attente ({pendingCount})</TabsTrigger>
                    <TabsTrigger value="processed" data-testid="tab-processed">Traitees ({validCount + invalidCount + usedCount})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <VerificationTable 
                      verifications={filteredVerifications} 
                      isLoading={isLoading}
                      getStatusBadge={getStatusBadge}
                      onView={setSelectedVerification}
                      t={t}
                    />
                  </TabsContent>
                  <TabsContent value="pending" className="mt-4">
                    <VerificationTable 
                      verifications={filteredVerifications.filter(v => v.status === "pending")} 
                      isLoading={isLoading}
                      getStatusBadge={getStatusBadge}
                      onView={setSelectedVerification}
                      t={t}
                    />
                  </TabsContent>
                  <TabsContent value="processed" className="mt-4">
                    <VerificationTable 
                      verifications={filteredVerifications.filter(v => v.status !== "pending")} 
                      isLoading={isLoading}
                      getStatusBadge={getStatusBadge}
                      onView={setSelectedVerification}
                      t={t}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Analytiques</h2>
                  <p className="text-slate-400 mt-1">Statistiques detaillees</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-violet-500/20">
                          <Calendar className="h-5 w-5 text-violet-400" />
                        </div>
                        <span className="text-sm text-slate-400">Cette semaine</span>
                      </div>
                      <p className="text-3xl font-bold text-white">{weekCount}</p>
                      <p className="text-xs text-slate-500 mt-1">demandes</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-cyan-500/20">
                          <CreditCard className="h-5 w-5 text-cyan-400" />
                        </div>
                        <span className="text-sm text-slate-400">Montant moyen</span>
                      </div>
                      <p className="text-3xl font-bold text-white">{avgAmount.toFixed(0)}</p>
                      <p className="text-xs text-slate-500 mt-1">EUR</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-emerald-500/20">
                          <Users className="h-5 w-5 text-emerald-400" />
                        </div>
                        <span className="text-sm text-slate-400">Taux inscription</span>
                      </div>
                      <p className="text-3xl font-bold text-white">
                        {verifications.length > 0 ? Math.round((registeredCount / verifications.length) * 100) : 0}%
                      </p>
                      <p className="text-xs text-slate-500 mt-1">utilisateurs inscrits</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-rose-500/20">
                          <XCircle className="h-5 w-5 text-rose-400" />
                        </div>
                        <span className="text-sm text-slate-400">Taux de fraude</span>
                      </div>
                      <p className="text-3xl font-bold text-white">
                        {verifications.length > 0 ? Math.round(((invalidCount + usedCount) / verifications.length) * 100) : 0}%
                      </p>
                      <p className="text-xs text-slate-500 mt-1">codes rejetes</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">Repartition des statuts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-emerald-400" />
                            <span className="text-sm text-slate-300">Valides</span>
                          </div>
                          <span className="text-sm font-bold text-white">{validCount}</span>
                        </div>
                        <Progress value={(validCount / (verifications.length || 1)) * 100} className="h-3" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-rose-400" />
                            <span className="text-sm text-slate-300">Invalides</span>
                          </div>
                          <span className="text-sm font-bold text-white">{invalidCount}</span>
                        </div>
                        <Progress value={(invalidCount / (verifications.length || 1)) * 100} className="h-3 [&>div]:bg-rose-500" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-amber-400" />
                            <span className="text-sm text-slate-300">Deja utilises</span>
                          </div>
                          <span className="text-sm font-bold text-white">{usedCount}</span>
                        </div>
                        <Progress value={(usedCount / (verifications.length || 1)) * 100} className="h-3 [&>div]:bg-amber-500" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-violet-400" />
                            <span className="text-sm text-slate-300">En attente</span>
                          </div>
                          <span className="text-sm font-bold text-white">{pendingCount}</span>
                        </div>
                        <Progress value={(pendingCount / (verifications.length || 1)) * 100} className="h-3 [&>div]:bg-violet-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">Types de coupons</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[250px]">
                        {Object.entries(
                          verifications.reduce((acc, v) => {
                            acc[v.couponType] = (acc[v.couponType] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                            <span className="text-sm text-slate-300">{type}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{count}</span>
                              <Badge className="bg-slate-800 text-slate-400 text-xs">
                                {Math.round((count / verifications.length) * 100)}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {verifications.length === 0 && (
                          <p className="text-sm text-slate-500 text-center py-8">Aucune donnee</p>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Systeme</h2>
                  <p className="text-slate-400 mt-1">Etat et configuration du systeme</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-emerald-500/20">
                          <Server className="h-5 w-5 text-emerald-400" />
                        </div>
                        <span className="text-sm text-slate-400">Serveur</span>
                      </div>
                      <p className="text-xl font-bold text-emerald-400">Operationnel</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-cyan-500/20">
                          <Database className="h-5 w-5 text-cyan-400" />
                        </div>
                        <span className="text-sm text-slate-400">Base de donnees</span>
                      </div>
                      <p className="text-xl font-bold text-cyan-400">Connectee</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-violet-500/20">
                          <Cpu className="h-5 w-5 text-violet-400" />
                        </div>
                        <span className="text-sm text-slate-400">IA Nova</span>
                      </div>
                      <p className="text-xl font-bold text-violet-400">Active</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-amber-500/20">
                          <Globe className="h-5 w-5 text-amber-400" />
                        </div>
                        <span className="text-sm text-slate-400">WebSocket</span>
                      </div>
                      <p className="text-xl font-bold text-amber-400">{onlineCount} connexions</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Lock className="h-5 w-5 text-violet-400" />
                      Securite
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                        <div>
                          <p className="text-white font-medium">Chiffrement SSL/TLS</p>
                          <p className="text-xs text-slate-400">Toutes les connexions sont securisees</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400">Actif</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-emerald-400" />
                        <div>
                          <p className="text-white font-medium">Authentification JWT</p>
                          <p className="text-xs text-slate-400">Tokens securises avec expiration</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400">Actif</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-violet-400" />
                        <div>
                          <p className="text-white font-medium">Detection IA anti-fraude</p>
                          <p className="text-xs text-slate-400">Analyse automatique des codes</p>
                        </div>
                      </div>
                      <Badge className="bg-violet-500/20 text-violet-400">Premium</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>

        <Dialog open={!!selectedVerification} onOpenChange={() => setSelectedVerification(null)}>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-lg">
            {selectedVerification && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-2">
                    {getStatusIcon(selectedVerification.status)}
                    Details de la verification
                  </DialogTitle>
                  <DialogDescription>
                    Demande #{selectedVerification.id.slice(0, 8)}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <p className="text-xs text-slate-400 mb-1">Nom complet</p>
                      <p className="text-white font-medium">{selectedVerification.firstName} {selectedVerification.lastName}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <p className="text-xs text-slate-400 mb-1">Email</p>
                      <p className="text-white font-medium truncate">{selectedVerification.email}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <p className="text-xs text-slate-400 mb-1">Type</p>
                      <p className="text-white font-medium">{selectedVerification.couponType}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <p className="text-xs text-slate-400 mb-1">Montant</p>
                      <p className="text-white font-medium">{selectedVerification.amount} EUR</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50 col-span-2">
                      <p className="text-xs text-slate-400 mb-1">Code coupon</p>
                      <p className="text-cyan-400 font-mono text-lg">{selectedVerification.couponCode}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <p className="text-xs text-slate-400 mb-1">Statut actuel</p>
                      {getStatusBadge(selectedVerification.status)}
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <p className="text-xs text-slate-400 mb-1">Type d'utilisateur</p>
                      {selectedVerification.isRegisteredUser ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400">Inscrit</Badge>
                      ) : (
                        <Badge className="bg-slate-500/20 text-slate-400">Invite</Badge>
                      )}
                    </div>
                  </div>

                  {selectedVerification.status === "pending" && (
                    <>
                      <Separator className="bg-slate-800" />
                      <div>
                        <p className="text-sm text-slate-400 mb-3">Marquer comme:</p>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            className="bg-emerald-600 text-white"
                            onClick={() => selectedVerification && updateStatusMutation.mutate({ id: selectedVerification.id, status: "valid" })}
                            disabled={updateStatusMutation.isPending || !selectedVerification}
                            data-testid="button-mark-valid"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Valide
                          </Button>
                          <Button
                            className="bg-rose-600 text-white"
                            onClick={() => selectedVerification && updateStatusMutation.mutate({ id: selectedVerification.id, status: "invalid" })}
                            disabled={updateStatusMutation.isPending || !selectedVerification}
                            data-testid="button-mark-invalid"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Invalide
                          </Button>
                          <Button
                            className="bg-amber-600 text-white"
                            onClick={() => selectedVerification && updateStatusMutation.mutate({ id: selectedVerification.id, status: "already_used" })}
                            disabled={updateStatusMutation.isPending || !selectedVerification}
                            data-testid="button-mark-used"
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Deja utilise
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
}

interface VerificationTableProps {
  verifications: Verification[];
  isLoading: boolean;
  getStatusBadge: (status: string) => React.ReactNode;
  onView: (v: Verification) => void;
  t: (key: string) => string;
}

function VerificationTable({ verifications, isLoading, getStatusBadge, onView, t }: VerificationTableProps) {
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
          <p className="text-slate-500">Aucune verification dans cette categorie</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">Utilisateur</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm hidden md:table-cell">Type</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">Montant</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm hidden lg:table-cell">Code</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">Statut</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm hidden md:table-cell">Date</th>
                <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((v) => (
                <tr 
                  key={v.id} 
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer" 
                  data-testid={`row-verification-${v.id}`}
                  onClick={() => onView(v)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-slate-700">
                        <AvatarFallback className="bg-slate-800 text-slate-400 text-xs">
                          {v.firstName[0]}{v.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{v.firstName} {v.lastName}</p>
                        <p className="text-xs text-slate-500 truncate">{v.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300 hidden md:table-cell">{v.couponType}</td>
                  <td className="py-4 px-4 text-white font-medium">{v.amount} EUR</td>
                  <td className="py-4 px-4 font-mono text-cyan-400 hidden lg:table-cell">{v.couponCode.substring(0, 8)}...</td>
                  <td className="py-4 px-4">{getStatusBadge(v.status)}</td>
                  <td className="py-4 px-4 text-slate-400 text-sm hidden md:table-cell">
                    {format(new Date(v.createdAt), "dd/MM/yy HH:mm")}
                  </td>
                  <td className="py-4 px-4">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); onView(v); }}
                      data-testid={`button-view-${v.id}`}
                    >
                      <Eye className="h-4 w-4 text-slate-400" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
