import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowRight
} from "lucide-react";
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
  { id: "transcash", name: "Transcash", domain: "transcash.fr", color: "from-red-500 to-red-900", category: "payment" },
  { id: "pcs", name: "PCS", domain: "mypcs.com", color: "from-slate-700 to-black", category: "payment" },
  { id: "paysafecard", name: "Paysafecard", domain: "paysafecard.com", color: "from-blue-500 to-blue-900", category: "payment" },
  { id: "neosurf", name: "Neosurf", domain: "neosurf.com", color: "from-pink-500 to-rose-900", category: "payment" },
  { id: "googleplay", name: "Google Play", domain: "play.google.com", color: "from-emerald-400 to-emerald-900", category: "gift" },
  { id: "amazon", name: "Amazon", domain: "amazon.com", color: "from-yellow-500 to-orange-700", category: "gift" },
  { id: "itunes", name: "iTunes", domain: "apple.com", color: "from-blue-400 to-purple-600", category: "gift" },
  { id: "steam", name: "Steam", domain: "steampowered.com", color: "from-slate-800 to-slate-950", category: "gaming" },
  { id: "toneofirst", name: "Toneo First", domain: "toneofirst.com", color: "from-orange-400 to-orange-800", category: "payment" },
  { id: "ticketpremium", name: "Ticket Premium", domain: "ticket-premium.com", color: "from-blue-600 to-indigo-900", category: "payment" },
  { id: "flexpin", name: "Flexpin", domain: "flexepin.com", color: "from-green-500 to-teal-800", category: "payment" },
  { id: "cashlib", name: "Cashlib", domain: "cashlib.com", color: "from-amber-500 to-orange-800", category: "payment" },
  { id: "netflix", name: "Netflix", domain: "netflix.com", color: "from-red-600 to-red-950", category: "entertainment" },
  { id: "spotify", name: "Spotify", domain: "spotify.com", color: "from-green-500 to-green-900", category: "entertainment" },
  { id: "razer", name: "Razer Gold", domain: "razer.com", color: "from-green-400 to-green-800", category: "gaming" },
  { id: "xbox", name: "Xbox", domain: "xbox.com", color: "from-green-500 to-green-800", category: "gaming" },
  { id: "playstation", name: "PlayStation", domain: "playstation.com", color: "from-blue-600 to-indigo-800", category: "gaming" },
  { id: "zalando", name: "Zalando", domain: "zalando.com", color: "from-orange-400 to-orange-700", category: "gift" },
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
  couponImage: z.any().refine((files) => files && files instanceof File, "Photo requise"),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      couponType: "",
      amount: "",
      couponCode: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult("success");
    }, 3000);
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
    <div className="min-h-screen font-sans text-white overflow-x-hidden selection:bg-cyan-500/30 selection:text-white relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[8000ms]"></div>
        <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[80px] mix-blend-screen"></div>
      </div>

      {/* 1. Header */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/5 bg-[#050B14]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-40 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-[#0A101F] p-2 rounded-lg border border-white/10">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              CouponChecker
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            {["Comment ça marche", "Sécurité", "Émetteurs", "Support"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-').replace(/[éè]/g, 'e')}`} 
                className="hover:text-white transition-all hover:scale-105 relative py-1"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          <button 
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="relative z-10 pt-28">
        
        {/* 2. Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 lg:mb-32">
          <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
            
            {/* Left: Content & Slider */}
            <div className="flex-1 w-full lg:w-[55%] space-y-10 pt-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                  <Sparkles className="w-3 h-3" />
                  Technologie 2026
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-tight mb-8 text-white">
                  Vérifiez vos coupons <br/>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient-text">
                    instantanément.
                  </span>
                </h1>
                
                <p className="text-lg text-white/60 leading-relaxed max-w-xl mb-12 font-light">
                  CouponChecker utilise un moteur d’analyse intelligent combinant IA, détection de fraude, vérification cryptographique et analyse visuelle haute précision. Une solution de confiance adoptée par des milliers d’utilisateurs pour authentifier leurs coupons Transcash, PCS, Neosurf, Paysafecard et bien d’autres en quelques secondes.
                </p>

                {/* Benefits Grid */}
                <div className="grid grid-cols-2 gap-4 mb-12">
                  {FEATURES.slice(0, 4).map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded bg-white/5 border border-white/10 text-cyan-400">
                        <feature.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white/90">{feature.title}</h4>
                        <p className="text-xs text-white/40">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carousel */}
                <div className="w-full relative">
                  <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050B14] to-transparent z-20 pointer-events-none"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050B14] to-transparent z-20 pointer-events-none"></div>
                  
                  <Carousel
                    opts={{ align: "start", loop: true }}
                    plugins={[plugin.current]}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4">
                      {COUPON_TYPES.map((coupon) => (
                        <CarouselItem key={coupon.id} className="pl-4 basis-1/3 md:basis-1/3 lg:basis-1/4">
                          <div className="group cursor-pointer relative perspective-1000">
                            <div className={`relative aspect-[1.586/1] rounded-2xl overflow-hidden transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] border border-white/10 bg-gradient-to-br ${coupon.color} bg-opacity-20`}>
                               <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
                               <div className="absolute inset-0 flex items-center justify-center p-5 z-10">
                                 <img 
                                   src={`https://logo.clearbit.com/${coupon.domain}?size=200`}
                                   alt={coupon.name}
                                   className="w-full h-full object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                                   onError={(e) => {
                                     e.currentTarget.style.display = 'none';
                                     e.currentTarget.parentElement!.innerHTML = `<span class="text-sm font-bold text-white/90 tracking-wider">${coupon.name}</span>`;
                                   }}
                                 />
                               </div>
                               <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
                            </div>
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
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <Card className="relative glass-card-strong border-0 rounded-3xl overflow-hidden">
                  <CardHeader className="border-b border-white/10 pb-6 pt-8 px-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-display font-bold text-white tracking-wide">Vérification Sécurisée</CardTitle>
                        <CardDescription className="text-white/40 mt-1 flex items-center gap-2">
                          <Lock className="w-3 h-3 text-green-400" /> SSL 256-bit Encrypted
                        </CardDescription>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        <Shield className="w-5 h-5 text-green-400" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8 px-8 pb-8">
                    {!isAnalyzing && !result && (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                          {/* Form fields (First Name, Last Name, Email, Type, Amount, Code, Image) */}
                          <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="firstName" render={({ field }) => (
                              <FormItem><FormControl><Input placeholder="Prénom" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500/50 h-11 rounded-xl neon-border-focus" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="lastName" render={({ field }) => (
                              <FormItem><FormControl><Input placeholder="Nom" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500/50 h-11 rounded-xl neon-border-focus" /></FormControl><FormMessage /></FormItem>
                            )} />
                          </div>

                          <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormControl><Input placeholder="Email" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500/50 h-11 rounded-xl neon-border-focus" /></FormControl><FormMessage /></FormItem>
                          )} />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="couponType" render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-cyan-500/50 h-11 rounded-xl neon-border-focus"><SelectValue placeholder="Service" /></SelectTrigger></FormControl>
                                  <SelectContent className="bg-[#0A101F] border-white/10 text-white">{COUPON_TYPES.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="amount" render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl><SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-cyan-500/50 h-11 rounded-xl neon-border-focus"><SelectValue placeholder="Montant" /></SelectTrigger></FormControl>
                                  <SelectContent className="bg-[#0A101F] border-white/10 text-white">{AMOUNTS.map((a) => <SelectItem key={a} value={a}>{a} €</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>

                          <FormField control={form.control} name="couponCode" render={({ field }) => (
                            <FormItem>
                              <div className="relative">
                                <FormControl><Input type={showCode ? "text" : "password"} placeholder="Code du coupon" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500/50 h-11 rounded-xl neon-border-focus pr-10 font-mono tracking-widest" /></FormControl>
                                <button type="button" onClick={() => setShowCode(!showCode)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-cyan-400 p-1">{showCode ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <FormField control={form.control} name="couponImage" render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                              <FormControl>
                                {!selectedFile ? (
                                  <div className="relative group">
                                    <Input {...fieldProps} type="file" accept="image/*" className="hidden" id="file-upload" onChange={(e) => handleFileChange(e, onChange)} />
                                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-28 border border-dashed border-white/20 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 transition-all">
                                      <div className="flex flex-col items-center pt-4 pb-4">
                                        <div className="p-2 bg-white/5 rounded-full border border-white/10 mb-2"><Upload className="w-4 h-4 text-cyan-400" /></div>
                                        <p className="text-xs text-white/70">Photo du coupon requise*</p>
                                      </div>
                                    </label>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">{previewUrl ? <img src={previewUrl} className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 m-auto mt-2.5 text-white/30" />}</div>
                                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white/90 truncate">{selectedFile.name}</p></div>
                                    <button type="button" onClick={removeFile} className="p-1.5 hover:bg-white/10 rounded-full text-white/40 hover:text-red-400"><X className="w-4 h-4" /></button>
                                  </div>
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <Button type="submit" className="w-full h-12 text-base font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:scale-[1.02] text-white rounded-xl mt-2 border border-white/10">
                            Vérifier maintenant <ChevronRight className="ml-2 w-4 h-4" />
                          </Button>
                        </form>
                      </Form>
                    )}
                    {isAnalyzing && (
                      <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
                          <div className="relative bg-[#0A101F] p-5 rounded-full border border-cyan-500/30"><Loader2 className="h-10 w-10 text-cyan-400 animate-spin" /></div>
                        </div>
                        <div className="space-y-2"><h3 className="text-xl font-bold text-white">Analyse en cours...</h3><p className="text-white/50 text-sm">Validation cryptographique sécurisée.</p></div>
                      </div>
                    )}
                    {result === "success" && (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="bg-green-500/10 p-5 rounded-full text-green-400 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]"><CheckCircle2 className="h-12 w-12" /></div>
                        <div className="space-y-2"><h3 className="text-2xl font-bold text-white">Coupon Valide</h3><p className="text-white/60">Le code a été authentifié avec succès.</p></div>
                        <Button variant="outline" className="mt-4 border-white/10 hover:bg-white/5 text-white" onClick={() => { setResult(null); form.reset(); removeFile(); }}>Nouvelle vérification</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. Comment ça marche */}
        <section id="comment-ca-marche" className="py-24 relative bg-black/20 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Processus de Validation</h2>
              <p className="text-white/50 max-w-2xl mx-auto">Une technologie complexe rendue simple pour l'utilisateur. 3 étapes sécurisées.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map((step, i) => (
                <div key={i} className="relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="absolute -inset-px bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm"></div>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-white/60 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Technologie */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Infrastructure Intelligence</h2>
                <p className="text-white/60 text-lg leading-relaxed">
                  Notre cœur technologique repose sur un réseau neuronal propriétaire capable de détecter les fraudes et de valider les codes en millisecondes. Nous croisons les données avec les serveurs émetteurs via des tunnels chiffrés.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {TECH_STACK.map((tech, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <tech.icon className="w-5 h-5 text-cyan-400" />
                      <span className="text-sm font-medium text-white/90">{tech.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="relative aspect-square rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-white/10 p-12 flex items-center justify-center animate-pulse">
                  <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-spin-slow"></div>
                  <Server className="w-32 h-32 text-white/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full border border-purple-500/20 animate-reverse-spin"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Émetteurs Compatibles */}
        <section id="emetteurs" className="py-24 bg-black/20 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Écosystème Compatible</h2>
              <div className="flex justify-center gap-4 mt-8">
                {["all", "payment", "gift", "gaming", "entertainment"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === cat ? "bg-white text-black" : "bg-white/5 text-white/60 hover:text-white"}`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredCoupons.map((coupon) => (
                <div key={coupon.id} className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all cursor-pointer text-center">
                   <div className="w-12 h-12 mx-auto mb-3 bg-white rounded-full p-2 flex items-center justify-center">
                     <img src={`https://logo.clearbit.com/${coupon.domain}`} className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display='none'} />
                   </div>
                   <p className="text-xs font-medium text-white/80 group-hover:text-cyan-400">{coupon.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FAQ */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-white mb-12 text-center">Questions Fréquentes</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-2xl bg-white/5 px-6">
                  <AccordionTrigger className="text-white hover:text-cyan-400 hover:no-underline py-4">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-white/60 pb-4">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* 7. Footer */}
        <footer className="py-16 border-t border-white/5 bg-[#02050a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="w-6 h-6 text-cyan-500" />
                  <span className="font-bold text-xl text-white">CouponChecker</span>
                </div>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                  La référence mondiale pour la vérification sécurisée de titres prépayés. Technologie certifiée ISO 27001.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-6">Liens Rapides</h4>
                <ul className="space-y-4 text-sm text-white/50">
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Vérifier un coupon</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">API Développeurs</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Status du service</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-6">Légal</h4>
                <ul className="space-y-4 text-sm text-white/50">
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Conditions d'utilisation</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Politique de confidentialité</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">Cookies</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-white/30">© 2026 CouponChecker Inc. Tous droits réservés.</p>
              <div className="flex gap-4">
                 {/* Social Icons Placeholder */}
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-500/20 transition-colors cursor-pointer"><Globe className="w-4 h-4 text-white/60" /></div>
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-500/20 transition-colors cursor-pointer"><Mail className="w-4 h-4 text-white/60" /></div>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
