import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { API_URL } from "@/lib/config";
import { useI18n } from "@/lib/i18n";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { t } = useI18n();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage(t("verifyEmail.tokenMissing"));
      return;
    }

    fetch(`${API_URL}/api/auth/verify-email?token=${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message || t("verifyEmail.successMessage"));
        } else {
          setStatus("error");
          setMessage(data.error || t("verifyEmail.errorMessage"));
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage(t("verifyEmail.connectionError"));
      });
  }, [search, t]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-slate-900/50 border-purple-500/20">
        <CardContent className="p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-purple-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-white mb-2">{t("verifyEmail.loading")}</h1>
              <p className="text-slate-400">{t("verifyEmail.pleaseWait")}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="p-4 rounded-full bg-green-500/20 inline-block mb-4">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              <h1 className="text-xl font-bold text-white mb-2">{t("verifyEmail.success")}</h1>
              <p className="text-slate-400 mb-6">{t("verifyEmail.successMessage")}</p>
              <Button
                className="bg-gradient-to-r from-purple-600 to-cyan-600"
                onClick={() => setLocation("/dashboard")}
                data-testid="button-go-dashboard"
              >
                {t("verifyEmail.goToDashboard")}
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="p-4 rounded-full bg-red-500/20 inline-block mb-4">
                <XCircle className="h-16 w-16 text-red-400" />
              </div>
              <h1 className="text-xl font-bold text-white mb-2">{t("verifyEmail.error")}</h1>
              <p className="text-slate-400 mb-6">{message}</p>
              <Button
                className="bg-gradient-to-r from-purple-600 to-cyan-600"
                onClick={() => setLocation("/")}
                data-testid="button-go-home"
              >
                {t("verifyEmail.backToHome")}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
