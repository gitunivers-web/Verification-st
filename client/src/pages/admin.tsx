import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { API_URL } from "@/lib/config";
import type { Verification } from "@shared/schema";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  FileCheck,
  LogOut,
  ArrowLeft,
  Loader2,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, token, logout, isAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [ws, setWs] = useState<WebSocket | null>(null);

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
      if (data.type === "new_verification" || data.type === "verification_updated") {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/verifications"] });
      }
    };

    socket.onopen = () => console.log("[WS] Admin connected");
    socket.onclose = () => console.log("[WS] Admin disconnected");

    setWs(socket);
    return () => socket.close();
  }, []);

  const { data: verifications = [], isLoading } = useQuery<Verification[]>({
    queryKey: ["/api/admin/verifications"],
    enabled: isAdmin,
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
      toast({ title: "Statut mis a jour", description: "L'email a ete envoye a l'utilisateur" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de mettre a jour le statut", variant: "destructive" });
    },
  });

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

  const pendingCount = verifications.filter((v) => v.status === "pending").length;
  const validCount = verifications.filter((v) => v.status === "valid").length;
  const invalidCount = verifications.filter((v) => v.status === "invalid").length;

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-50 border-b border-purple-500/20 bg-slate-950/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Koupon Trust - Admin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={logout} data-testid="button-admin-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Deconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <FileCheck className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total</p>
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
                <p className="text-sm text-slate-400">Valides</p>
                <p className="text-2xl font-bold text-white">{validCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-red-500/20">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-500/20">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Invalides</p>
                <p className="text-2xl font-bold text-white">{invalidCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Demandes de verification</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : verifications.length === 0 ? (
              <p className="text-center text-slate-500 py-8">Aucune demande pour le moment</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Utilisateur</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Montant</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Code</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Statut</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Inscrit</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifications.map((v) => (
                      <tr key={v.id} className="border-b border-slate-800" data-testid={`row-verification-${v.id}`}>
                        <td className="py-3 px-4 text-white">{v.firstName} {v.lastName}</td>
                        <td className="py-3 px-4 text-slate-300">{v.email}</td>
                        <td className="py-3 px-4 text-slate-300">{v.couponType}</td>
                        <td className="py-3 px-4 text-white font-medium">{v.amount} EUR</td>
                        <td className="py-3 px-4 font-mono text-cyan-400">{v.couponCode}</td>
                        <td className="py-3 px-4">{getStatusBadge(v.status)}</td>
                        <td className="py-3 px-4">
                          {v.isRegisteredUser ? (
                            <Badge className="bg-green-500/20 text-green-400">Inscrit</Badge>
                          ) : (
                            <Badge className="bg-slate-500/20 text-slate-400">Invite</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {v.status === "pending" ? (
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-500/30 text-green-400 hover:bg-green-500/20"
                                onClick={() => updateStatusMutation.mutate({ id: v.id, status: "valid" })}
                                disabled={updateStatusMutation.isPending}
                                data-testid={`button-valid-${v.id}`}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Bon
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                                onClick={() => updateStatusMutation.mutate({ id: v.id, status: "invalid" })}
                                disabled={updateStatusMutation.isPending}
                                data-testid={`button-invalid-${v.id}`}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Pas bon
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20"
                                onClick={() => updateStatusMutation.mutate({ id: v.id, status: "already_used" })}
                                disabled={updateStatusMutation.isPending}
                                data-testid={`button-used-${v.id}`}
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Deja utilise
                              </Button>
                            </div>
                          ) : (
                            <span className="text-slate-500 text-sm">Traite</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
