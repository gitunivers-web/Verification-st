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
  X
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
  couponImage: z.any().optional(),
});

const COUPON_TYPES = [
  { id: "transcash", name: "Transcash", icon: CreditCard },
  { id: "pcs", name: "PCS", icon: CreditCard },
  { id: "paysafecard", name: "Paysafecard", icon: CreditCard },
  { id: "neosurf", name: "Neosurf", icon: CreditCard },
  { id: "googleplay", name: "Google Play", icon: Smartphone },
  { id: "amazon", name: "Amazon", icon: ShoppingCart },
  { id: "itunes", name: "iTunes", icon: Music },
  { id: "steam", name: "Steam", icon: Gamepad2 },
  { id: "toneofirst", name: "Toneo First", icon: CreditCard },
  { id: "ticketpremium", name: "Ticket Premium", icon: CreditCard },
  { id: "flexpin", name: "Flexpin", icon: CreditCard },
  { id: "cashlib", name: "Cashlib", icon: CreditCard },
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
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-[#0B1220] selection:bg-[#1F5BFF]/20 overflow-x-hidden">
      
      {/* 1. Header Premium */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-br from-[#1F5BFF] to-[#0B1220] p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-[#0B1220]">
              CouponChecker
            </span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-[#1F5BFF] transition-colors relative group">
              Comment ça marche
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1F5BFF] transition-all group-hover:w-full"></span>
            </a>
            <a href="#security" className="hover:text-[#1F5BFF] transition-colors relative group">
              Sécurité
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1F5BFF] transition-all group-hover:w-full"></span>
            </a>
            <a href="#support" className="hover:text-[#1F5BFF] transition-colors relative group">
              Support
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1F5BFF] transition-all group-hover:w-full"></span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-[#1F5BFF] transition-colors"
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
            className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl p-4 flex flex-col gap-4"
          >
             <a href="#how-it-works" className="text-slate-600 font-medium py-2">Comment ça marche</a>
             <a href="#security" className="text-slate-600 font-medium py-2">Sécurité</a>
             <a href="#support" className="text-slate-600 font-medium py-2">Support</a>
          </motion.div>
        )}
      </header>

      <main className="pt-28 pb-16 lg:pt-36 lg:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20">
          
          {/* 2. Hero Section - Left Column */}
          <div className="flex-1 w-full lg:max-w-[55%] space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-[#1F5BFF] text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1F5BFF]"></span>
                </span>
                Vérification sécurisée 2025
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] text-[#0B1220] mb-6">
                Vérifiez vos coupons <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1F5BFF] to-violet-600">
                  instantanément.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-lg mb-10">
                La solution de référence pour authentifier vos recharges prépayées. Rapide, confidentiel et compatible avec tous les émetteurs majeurs.
              </p>

              {/* Carousel */}
              <div className="w-full relative mt-12">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#F5F7FA] to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#F5F7FA] to-transparent z-10"></div>
                
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
                      <CarouselItem key={coupon.id} className="pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5">
                        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-default">
                          <div className="bg-slate-50 p-3 rounded-full group-hover:bg-blue-50 transition-colors">
                            <coupon.icon className="w-6 h-6 text-slate-400 group-hover:text-[#1F5BFF] transition-colors" />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 text-center">{coupon.name}</span>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </motion.div>
          </div>

          {/* 3. Hero Section - Right Column (Form) */}
          <motion.div 
            className="flex-1 w-full lg:max-w-[45%]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              {/* Decorative background blobs */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-violet-400/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

              <Card className="relative border border-white/40 shadow-2xl shadow-blue-900/10 backdrop-blur-xl bg-white/80 overflow-hidden">
                <CardHeader className="bg-white/50 border-b border-slate-100 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-display font-bold text-[#0B1220]">Vérification</CardTitle>
                      <CardDescription className="text-slate-500 mt-1">Sécurisé par SSL 256-bit</CardDescription>
                    </div>
                    <Lock className="w-5 h-5 text-green-500/80" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {!isAnalyzing && !result && (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700 font-medium">Prénom</FormLabel>
                                <FormControl>
                                  <Input placeholder="Jean" {...field} className="bg-white/80 border-slate-200 focus:border-[#1F5BFF] focus:ring-2 focus:ring-[#1F5BFF]/10 transition-all h-11" />
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
                                <FormLabel className="text-slate-700 font-medium">Nom</FormLabel>
                                <FormControl>
                                  <Input placeholder="Dupont" {...field} className="bg-white/80 border-slate-200 focus:border-[#1F5BFF] focus:ring-2 focus:ring-[#1F5BFF]/10 transition-all h-11" />
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
                              <FormLabel className="text-slate-700 font-medium">Email</FormLabel>
                              <FormControl>
                                <Input placeholder="jean.dupont@exemple.com" {...field} className="bg-white/80 border-slate-200 focus:border-[#1F5BFF] focus:ring-2 focus:ring-[#1F5BFF]/10 transition-all h-11" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="couponType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700 font-medium">Type de coupon</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-white/80 border-slate-200 focus:border-[#1F5BFF] focus:ring-2 focus:ring-[#1F5BFF]/10 transition-all h-11">
                                      <SelectValue placeholder="Choisir..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {COUPON_TYPES.map((type) => (
                                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
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
                                <FormLabel className="text-slate-700 font-medium">Montant</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-white/80 border-slate-200 focus:border-[#1F5BFF] focus:ring-2 focus:ring-[#1F5BFF]/10 transition-all h-11">
                                      <SelectValue placeholder="Montant..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {AMOUNTS.map((amount) => (
                                      <SelectItem key={amount} value={amount}>{amount} €</SelectItem>
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
                              <FormLabel className="text-slate-700 font-medium">Code du coupon</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    type={showCode ? "text" : "password"} 
                                    placeholder="XXXX-XXXX-XXXX-XXXX" 
                                    {...field} 
                                    className="bg-white/80 border-slate-200 focus:border-[#1F5BFF] focus:ring-2 focus:ring-[#1F5BFF]/10 transition-all pr-12 font-mono tracking-wide h-11" 
                                  />
                                </FormControl>
                                <button
                                  type="button"
                                  onClick={() => setShowCode(!showCode)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1F5BFF] transition-colors p-1"
                                >
                                  {showCode ? <EyeOff size={18} /> : <Eye size={18} />}
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
                              <FormLabel className="text-slate-700 font-medium">Photo du coupon (Optionnel)</FormLabel>
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
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-[#1F5BFF]/50 transition-all duration-200"
                                      >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                          <div className="p-2 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                            <Upload className="w-5 h-5 text-[#1F5BFF]" />
                                          </div>
                                          <p className="mb-1 text-sm text-slate-500 font-medium">Cliquez pour ajouter une photo</p>
                                          <p className="text-xs text-slate-400">PNG, JPG (MAX. 5MB)</p>
                                        </div>
                                      </label>
                                    </div>
                                  ) : (
                                    <div className="relative flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                      <div className="h-12 w-12 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                                        {previewUrl ? (
                                          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                        ) : (
                                          <ImageIcon className="h-6 w-6 m-auto mt-3 text-slate-400" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                          {selectedFile.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={removeFile}
                                        className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
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

                        <div className="flex items-center space-x-2 pt-1">
                          <Checkbox 
                            id="hide-code" 
                            checked={!showCode}
                            onCheckedChange={(checked) => setShowCode(!checked)}
                            className="border-slate-300 data-[state=checked]:bg-[#1F5BFF] data-[state=checked]:border-[#1F5BFF]"
                          />
                          <label
                            htmlFor="hide-code"
                            className="text-sm font-medium leading-none text-slate-600 cursor-pointer select-none"
                          >
                            Masquer le code lors de la saisie
                          </label>
                        </div>

                        <Button type="submit" className="w-full h-12 text-base font-semibold shadow-xl shadow-[#1F5BFF]/20 hover:shadow-[#1F5BFF]/30 transition-all duration-300 bg-gradient-to-r from-[#1F5BFF] to-violet-600 hover:to-violet-700 text-white rounded-lg mt-2">
                          Vérifier le coupon <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                        
                        <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1.5 opacity-80">
                           <ShieldCheck className="w-3 h-3" /> Vos données sont chiffrées de bout en bout
                        </p>
                      </form>
                    </Form>
                  )}

                  {isAnalyzing && (
                    <div className="py-16 flex flex-col items-center justify-center text-center space-y-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#1F5BFF]/20 rounded-full blur-2xl animate-pulse"></div>
                        <div className="relative bg-white p-4 rounded-full shadow-lg">
                           <Loader2 className="h-12 w-12 text-[#1F5BFF] animate-spin" />
                        </div>
                      </div>
                      <div className="space-y-3 max-w-xs mx-auto">
                        <h3 className="text-xl font-display font-semibold text-[#0B1220]">Analyse sécurisée...</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">Nous vérifions l'authenticité de votre coupon auprès de l'émetteur.</p>
                      </div>
                      <div className="w-full max-w-[200px] bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#1F5BFF] to-violet-500"
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
                      className="py-12 flex flex-col items-center justify-center text-center space-y-6"
                    >
                      <div className="bg-green-50 p-5 rounded-full text-green-600 mb-2 shadow-sm border border-green-100">
                        <CheckCircle2 className="h-12 w-12" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-display font-bold text-[#0B1220]">Coupon Valide</h3>
                        <p className="text-slate-600 max-w-xs mx-auto">Le code a été vérifié avec succès. Il est actif et prêt à l'emploi.</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-4 border-slate-200 hover:bg-slate-50 text-slate-700"
                        onClick={() => {
                          setResult(null);
                          form.reset();
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
      <footer className="w-full py-10 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80">
             <ShieldCheck className="w-5 h-5 text-[#1F5BFF]" />
             <span className="font-semibold text-[#0B1220]">CouponChecker</span>
          </div>
          
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-[#1F5BFF] transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-[#1F5BFF] transition-colors">Politique de confidentialité</a>
          </div>

          <p className="text-sm text-slate-400">
            © 2025 CouponChecker. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
