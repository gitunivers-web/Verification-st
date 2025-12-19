import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { Loader2, Mail, Lock, User, Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { login, register, verify2FA } = useAuth();
  const { toast } = useToast();
  const { t, language } = useI18n();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [requires2FA, setRequires2FA] = useState(false);
  const [pendingAuthToken, setPendingAuthToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(loginForm.email, loginForm.password);
      
      // Check if 2FA is required - password verified, now need OTP
      if (result.requires2FA && result.pendingAuthToken) {
        setRequires2FA(true);
        setPendingAuthToken(result.pendingAuthToken);
        setIsLoading(false);
        return;
      }
      
      toast({ title: t("toast.loginSuccess"), description: t("toast.loginSuccessDesc") });
      onOpenChange(false);
      setLoginForm({ email: "", password: "" });
      const savedUser = localStorage.getItem("auth_user");
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.role === "admin") {
          setLocation("/admin");
        } else {
          setLocation("/dashboard");
        }
      } else {
        setLocation("/dashboard");
      }
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: error instanceof Error ? error.message : t("toast.loginError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) return;
    
    setIsLoading(true);
    try {
      await verify2FA(pendingAuthToken, otpCode);
      toast({ title: t("toast.loginSuccess"), description: t("toast.loginSuccessDesc") });
      onOpenChange(false);
      setRequires2FA(false);
      setPendingAuthToken("");
      setOtpCode("");
      setLoginForm({ email: "", password: "" });
      
      const savedUser = localStorage.getItem("auth_user");
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.role === "admin") {
          setLocation("/admin");
        } else {
          setLocation("/dashboard");
        }
      } else {
        setLocation("/dashboard");
      }
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

  const handleBack2FA = () => {
    setRequires2FA(false);
    setPendingAuthToken("");
    setOtpCode("");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail, language }),
      });
      const data = await response.json();
      
      toast({
        title: t("toast.success"),
        description: t("toast.passwordResetSent"),
      });
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: t("toast.genericError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: t("toast.error"),
        description: t("toast.passwordMismatch"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const message = await register({
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        password: registerForm.password,
        language,
      });
      toast({ title: t("toast.registerSuccess"), description: t("toast.registerSuccessDesc") });
      setActiveTab("login");
      setRegisterForm({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: error instanceof Error ? error.message : t("toast.registerError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot Password Screen
  if (showForgotPassword) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-slate-900/95 border-purple-500/30 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {t("auth.forgotPasswordTitle")}
            </DialogTitle>
            <DialogDescription className="text-center text-slate-400">
              {t("auth.forgotPasswordDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleForgotPassword} className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email" className="text-slate-300">{t("form.email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder={t("placeholder.email")}
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700 focus:border-purple-500 text-slate-100 placeholder:text-slate-500"
                  data-testid="input-forgot-email"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isLoading || !forgotPasswordEmail}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                data-testid="button-forgot-submit"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.sendResetLink")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleBackForgotPassword}
                className="text-slate-400 hover:text-slate-300"
                data-testid="button-forgot-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("auth.backToLogin")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // 2FA Verification Screen
  if (requires2FA) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-slate-900/95 border-purple-500/30 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Shield className="h-6 w-6" />
              {t("auth.2faTitle")}
            </DialogTitle>
            <DialogDescription className="text-center text-slate-400">
              {t("auth.2faDescription")}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handle2FAVerify} className="space-y-6 mt-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={setOtpCode}
                data-testid="input-2fa-code"
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
                type="button"
                variant="outline"
                onClick={handleBack2FA}
                className="flex-1"
                data-testid="button-2fa-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("auth.back")}
              </Button>
              <Button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                data-testid="button-2fa-verify"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.verify")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900/95 border-purple-500/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {t("auth.welcome")}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger value="login" data-testid="tab-login">{t("auth.loginTab")}</TabsTrigger>
            <TabsTrigger value="register" data-testid="tab-register">{t("auth.registerTab")}</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-slate-300">{t("form.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder={t("placeholder.email")}
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="pl-10 bg-slate-800/50 border-slate-700 focus:border-purple-500 text-slate-100 placeholder:text-slate-500"
                    data-testid="input-login-email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-slate-300">{t("auth.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder={t("placeholder.password")}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="pl-10 pr-10 bg-slate-800/50 border-slate-700 focus:border-purple-500 text-slate-100 placeholder:text-slate-500"
                    data-testid="input-login-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    data-testid="button-toggle-login-password"
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    data-testid="link-forgot-password"
                  >
                    {t("auth.forgotPassword")}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                data-testid="button-login-submit"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.loginButton")}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="register-firstname" className="text-slate-300">{t("form.firstName")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="register-firstname"
                      placeholder={t("placeholder.firstName")}
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                      className="pl-10 bg-slate-800/50 border-slate-700 focus:border-purple-500 text-slate-100 placeholder:text-slate-500"
                      data-testid="input-register-firstname"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-lastname" className="text-slate-300">{t("form.lastName")}</Label>
                  <Input
                    id="register-lastname"
                    placeholder={t("placeholder.lastName")}
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 focus:border-purple-500 text-slate-100 placeholder:text-slate-500"
                    data-testid="input-register-lastname"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-slate-300">{t("form.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder={t("placeholder.email")}
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="pl-10 bg-slate-800/50 border-slate-700 focus:border-purple-500 text-slate-100 placeholder:text-slate-500"
                    data-testid="input-register-email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-slate-300">{t("auth.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="register-password"
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder={t("placeholder.minCharacters")}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="pl-10 pr-10 bg-slate-800/50 border-slate-700 focus:border-purple-500 text-slate-100 placeholder:text-slate-500"
                    data-testid="input-register-password"
                    required
                    minLength={12}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    data-testid="button-toggle-register-password"
                  >
                    {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm" className="text-slate-300">{t("auth.confirmPassword")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="register-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("placeholder.confirmPassword")}
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    className="pl-10 pr-10 bg-slate-800/50 border-slate-700 focus:border-purple-500 text-slate-100 placeholder:text-slate-500"
                    data-testid="input-register-confirm"
                    required
                    minLength={12}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    data-testid="button-toggle-confirm-password"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
                data-testid="button-register-submit"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("auth.registerButton")}
              </Button>

              <p className="text-xs text-center text-slate-500">
                {t("toast.emailConfirmation")}
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
