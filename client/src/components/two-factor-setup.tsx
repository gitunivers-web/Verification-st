import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { Shield, ShieldCheck, ShieldOff, Loader2, Copy, Check } from "lucide-react";

export function TwoFactorSetup() {
  const { user, token, refreshUser } = useAuth();
  const { toast } = useToast();
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [setupData, setSetupData] = useState<{ qrCode: string; secret: string } | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [showDisable, setShowDisable] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSetup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }
      
      setSetupData(data);
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: error instanceof Error ? error.message : t("settings.2faSetupError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable = async () => {
    if (otpCode.length !== 6) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/2fa/enable", { token: otpCode });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }
      
      toast({
        title: t("toast.success"),
        description: t("settings.2faEnabled"),
      });
      setSetupData(null);
      setOtpCode("");
      await refreshUser();
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: error instanceof Error ? error.message : t("toast.2faError"),
        variant: "destructive",
      });
      setOtpCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    if (disableCode.length !== 6) return;
    
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/2fa/disable", { token: disableCode });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }
      
      toast({
        title: t("toast.success"),
        description: t("settings.2faDisabled"),
      });
      setShowDisable(false);
      setDisableCode("");
      await refreshUser();
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: error instanceof Error ? error.message : t("toast.2faError"),
        variant: "destructive",
      });
      setDisableCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const is2FAEnabled = user?.twoFactorEnabled;

  return (
    <Card className="bg-slate-900/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Shield className="h-5 w-5 text-purple-400" />
          {t("settings.2faTitle")}
        </CardTitle>
        <CardDescription className="text-slate-400">
          {t("settings.2faDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {is2FAEnabled ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-md bg-green-500/10 border border-green-500/20">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <span className="text-green-400 text-sm">{t("settings.2faActive")}</span>
            </div>
            
            {showDisable ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">{t("settings.2faDisablePrompt")}</p>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={disableCode}
                    onChange={setDisableCode}
                    data-testid="input-2fa-disable"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="bg-slate-800/50 border-slate-700 text-white" />
                      <InputOTPSlot index={1} className="bg-slate-800/50 border-slate-700 text-white" />
                      <InputOTPSlot index={2} className="bg-slate-800/50 border-slate-700 text-white" />
                      <InputOTPSlot index={3} className="bg-slate-800/50 border-slate-700 text-white" />
                      <InputOTPSlot index={4} className="bg-slate-800/50 border-slate-700 text-white" />
                      <InputOTPSlot index={5} className="bg-slate-800/50 border-slate-700 text-white" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => { setShowDisable(false); setDisableCode(""); }}
                    className="flex-1"
                    data-testid="button-2fa-cancel"
                  >
                    {t("auth.back")}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDisable}
                    disabled={isLoading || disableCode.length !== 6}
                    className="flex-1"
                    data-testid="button-2fa-confirm-disable"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("settings.2faDisable")}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowDisable(true)}
                className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                data-testid="button-2fa-disable"
              >
                <ShieldOff className="h-4 w-4 mr-2" />
                {t("settings.2faDisable")}
              </Button>
            )}
          </div>
        ) : setupData ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={setupData.qrCode}
                alt="QR Code"
                className="w-48 h-48 rounded-lg"
                data-testid="img-2fa-qrcode"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-slate-500 text-center">{t("settings.2faManualEntry")}</p>
              <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-md">
                <code className="flex-1 text-sm text-slate-300 font-mono break-all">{setupData.secret}</code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={copySecret}
                  data-testid="button-copy-secret"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-slate-400 text-center">{t("settings.2faEnterCode")}</p>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={setOtpCode}
                  data-testid="input-2fa-enable"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="bg-slate-800/50 border-slate-700 text-white" />
                    <InputOTPSlot index={1} className="bg-slate-800/50 border-slate-700 text-white" />
                    <InputOTPSlot index={2} className="bg-slate-800/50 border-slate-700 text-white" />
                    <InputOTPSlot index={3} className="bg-slate-800/50 border-slate-700 text-white" />
                    <InputOTPSlot index={4} className="bg-slate-800/50 border-slate-700 text-white" />
                    <InputOTPSlot index={5} className="bg-slate-800/50 border-slate-700 text-white" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => { setSetupData(null); setOtpCode(""); }}
                className="flex-1"
                data-testid="button-2fa-cancel-setup"
              >
                {t("auth.back")}
              </Button>
              <Button
                onClick={handleEnable}
                disabled={isLoading || otpCode.length !== 6}
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600"
                data-testid="button-2fa-enable"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("settings.2faEnable")}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleSetup}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600"
            data-testid="button-2fa-setup"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Shield className="h-4 w-4 mr-2" />}
            {t("settings.2faSetup")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
