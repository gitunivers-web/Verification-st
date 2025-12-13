import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { API_URL } from "@/lib/config";
import type { Verification } from "@shared/schema";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowLeft,
  LogOut,
  FileCheck,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function UserDashboard() {
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (!token) return;

    const wsUrl = API_URL.replace("http", "ws") + "/ws";
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "verification_updated") {
        queryClient.invalidateQueries({ queryKey: ["/api/verifications"] });
      }
    };

    socket.onopen = () => console.log("[WS] User connected");
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
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "invalid":
        return <XCircle className="h-5 w-5 text-red-400" />;
      case "already_used":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      default:
        return <Clock className="h-5 w-5 text-purple-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Valide</Badge>;
      case "invalid":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Invalide</Badge>;
      case "already_used":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Deja utilise</Badge>;
      default:
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">En attente</Badge>;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "valid":
        return "Votre code a ete verifie et est valide.";
      case "invalid":
        return "Votre code n'est pas valide.";
      case "already_used":
        return "Ce code a deja ete utilise.";
      default:
        return "Votre demande est en cours de traitement.";
    }
  };

  const pendingCount = verifications.filter((v) => v.status === "pending").length;
  const completedCount = verifications.filter((v) => v.status !== "pending").length;

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-50 border-b border-purple-500/20 bg-slate-950/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Mon Espace
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user.firstName} {user.lastName}</span>
            <Button variant="outline" size="sm" onClick={logout} data-testid="button-user-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Deconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <FileCheck className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total demandes</p>
                <p className="text-2xl font-bold text-white">{verifications.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-yellow-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500/20">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">En attente</p>
                <p className="text-2xl font-bold text-white">{pendingCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-green-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/20">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Traitees</p>
                <p className="text-2xl font-bold text-white">{completedCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="text-white">Historique des verifications</CardTitle>
            <Button
              variant="default"
              className="bg-gradient-to-r from-purple-600 to-cyan-600"
              onClick={() => setLocation("/")}
              data-testid="button-new-verification"
            >
              Nouvelle verification
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : verifications.length === 0 ? (
              <div className="text-center py-12">
                <FileCheck className="h-16 w-16 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">Vous n'avez pas encore de demandes de verification</p>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-cyan-600"
                  onClick={() => setLocation("/")}
                >
                  Faire ma premiere verification
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {verifications.map((v) => (
                  <Card
                    key={v.id}
                    className="bg-slate-800/50 border-slate-700"
                    data-testid={`card-verification-${v.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-slate-700/50">
                            {getStatusIcon(v.status)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-white">{v.couponType}</span>
                              {getStatusBadge(v.status)}
                            </div>
                            <p className="text-sm text-slate-400 mb-2">
                              Code: <span className="font-mono text-cyan-400">{v.couponCode.substring(0, 4)}****</span>
                              {" - "}
                              Montant: <span className="font-medium text-white">{v.amount} EUR</span>
                            </p>
                            <p className="text-sm text-slate-500">{getStatusMessage(v.status)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">
                            {format(new Date(v.createdAt), "dd MMM yyyy, HH:mm", { locale: fr })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
