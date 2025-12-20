import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { API_URL } from "@/lib/config";
import type { Verification } from "@shared/schema";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  CreditCard,
  Calendar,
  Mail,
  User,
  Hash,
  Loader2,
} from "lucide-react";
import { format, Locale } from "date-fns";
import { fr, nl, de, it, enUS } from "date-fns/locale";

const dateLocales = { fr, nl, de, it, en: enUS };

export default function VerificationDetail() {
  const { user, token } = useAuth();
  const { t, language } = useI18n();
  const [, setLocation] = useLocation();
  const dateLocale = dateLocales[language] || fr;

  // Get verification ID from URL query parameter
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const verificationId = params.get("id");

  const { data: verification, isLoading } = useQuery<Verification>({
    queryKey: ["/api/verifications", verificationId],
    enabled: !!token && !!verificationId,
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/verifications/${verificationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  useEffect(() => {
    if (!user || !token) {
      setLocation("/");
    }
  }, [user, token, setLocation]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-6 w-6 text-emerald-400" />;
      case "invalid":
        return <XCircle className="h-6 w-6 text-rose-400" />;
      case "already_used":
        return <AlertTriangle className="h-6 w-6 text-amber-400" />;
      default:
        return <Clock className="h-6 w-6 text-violet-400 animate-pulse" />;
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

  if (!user || !token) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-violet-500 mx-auto" />
          <p className="mt-4 text-slate-400">{t("dashboard.loading")}</p>
        </div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => setLocation("/dashboard")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400">{t("common.notFound")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setLocation("/dashboard")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Button>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-800/50 w-fit">
                {getStatusIcon(verification.status)}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl sm:text-2xl text-white break-words">{verification.couponType}</CardTitle>
                <div className="mt-2">{getStatusBadge(verification.status)}</div>
              </div>
            </div>
          </CardHeader>

          <Separator className="bg-slate-800" />

          <CardContent className="pt-6 space-y-6">
            {/* Main Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount */}
              <div className="bg-slate-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm text-slate-400">{t("verification.amount")}</span>
                </div>
                <p className="text-2xl font-bold text-white">{verification.amount} EUR</p>
              </div>

              {/* Status */}
              <div className="bg-slate-800/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-violet-400" />
                  <span className="text-sm text-slate-400">{t("verification.status")}</span>
                </div>
                <div>{getStatusBadge(verification.status)}</div>
              </div>

              {/* Coupon Code */}
              <div className="bg-slate-800/30 rounded-lg p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-slate-400">{t("verification.couponCode")}</span>
                </div>
                <p className="font-mono text-cyan-400 break-all text-lg">{verification.couponCode}</p>
              </div>

              {/* Date */}
              <div className="bg-slate-800/30 rounded-lg p-4 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-slate-400">{t("verification.submitted")}</span>
                </div>
                <p className="text-white">
                  {format(new Date(verification.createdAt), "PPpp", { locale: dateLocale })}
                </p>
              </div>
            </div>

            <Separator className="bg-slate-800" />

            {/* User Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">{t("verification.userInfo")}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
                  <User className="h-4 w-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-400">{t("common.name")}</p>
                    <p className="text-white">{verification.firstName} {verification.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-400">{t("common.email")}</p>
                    <p className="text-white break-all">{verification.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-800" />

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">{t("verification.timeline")}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                  <span className="text-slate-400 text-sm">
                    {t("verification.submitted")}: {format(new Date(verification.createdAt), "PPp", { locale: dateLocale })}
                  </span>
                </div>
                {verification.updatedAt !== verification.createdAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <span className="text-slate-400 text-sm">
                      {t("verification.updated")}: {format(new Date(verification.updatedAt), "PPp", { locale: dateLocale })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full border-slate-700 text-slate-300"
                onClick={() => setLocation("/dashboard")}
                data-testid="button-back-footer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("common.back")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
