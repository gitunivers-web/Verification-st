import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  CreditCard, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Loader2, 
  Lock
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Schema de validation
const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  couponType: z.string().min(1, "Veuillez sélectionner un type de coupon"),
  couponCode: z.string().min(10, "Code coupon invalide (trop court)"),
});

export default function Home() {
  const [showCode, setShowCode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | "success" | "error">(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      couponType: "",
      couponCode: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsAnalyzing(true);
    setResult(null);
    
    // Simulation d'analyse
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult("success"); // Pour la démo, on simule un succès
      console.log(values);
    }, 3000);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100">
      {/* Header */}
      <header className="w-full py-6 px-6 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-900">
            CouponChecker
          </span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-primary transition-colors">Comment ça marche</a>
          <a href="#" className="hover:text-primary transition-colors">Sécurité</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 md:py-24 flex flex-col lg:flex-row items-center justify-center gap-16">
        
        {/* Left Column: Text & Value Prop */}
        <div className="flex-1 max-w-xl text-center lg:text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-6 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Vérification sécurisée 2025
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-[1.1] text-slate-900 mb-6">
              Vérifiez vos coupons <span className="text-primary">instantanément</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Assurez-vous de la validité de vos recharges Transcash, PCS, Neosurf et autres en quelques secondes. Une solution fiable, rapide et sécurisée.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Logos placeholder simulation */}
               <div className="h-8 flex items-center font-bold text-slate-400">Transcash</div>
               <div className="h-8 w-px bg-slate-300 mx-2"></div>
               <div className="h-8 flex items-center font-bold text-slate-400">PCS</div>
               <div className="h-8 w-px bg-slate-300 mx-2"></div>
               <div className="h-8 flex items-center font-bold text-slate-400">Neosurf</div>
               <div className="h-8 w-px bg-slate-300 mx-2"></div>
               <div className="h-8 flex items-center font-bold text-slate-400">Paysafecard</div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Verification Form */}
        <motion.div 
          className="flex-1 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-2xl shadow-blue-900/5 overflow-hidden backdrop-blur-sm bg-white/90">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-6">
              <CardTitle className="text-xl font-display text-slate-800">Vérification de titre</CardTitle>
              <CardDescription>Remplissez les informations pour lancer l'analyse.</CardDescription>
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
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean" {...field} className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
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
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Dupont" {...field} className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="jean.dupont@exemple.com" {...field} className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="couponType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de coupon</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-50 border-slate-200 focus:bg-white transition-colors">
                                <SelectValue placeholder="Sélectionner un service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="transcash">Transcash</SelectItem>
                              <SelectItem value="pcs">PCS Mastercard</SelectItem>
                              <SelectItem value="neosurf">Neosurf</SelectItem>
                              <SelectItem value="paysafecard">Paysafecard</SelectItem>
                              <SelectItem value="toneo">Toneo First</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="couponCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code de rechargement</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                type={showCode ? "text" : "password"} 
                                placeholder="XXXX-XXXX-XXXX-XXXX" 
                                {...field} 
                                className="bg-slate-50 border-slate-200 focus:bg-white transition-colors pr-10 font-mono tracking-wide" 
                              />
                            </FormControl>
                            <button
                              type="button"
                              onClick={() => setShowCode(!showCode)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center space-x-2 pt-1">
                      <Checkbox 
                        id="hide-code" 
                        checked={!showCode}
                        onCheckedChange={(checked) => setShowCode(!checked)}
                      />
                      <label
                        htmlFor="hide-code"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-500"
                      >
                        Masquer les caractères lors de la saisie
                      </label>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700">
                      <ShieldCheck className="mr-2 h-4 w-4" /> Vérifier le coupon
                    </Button>
                    
                    <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" /> Connexion chiffrée SSL 256-bit
                    </p>
                  </form>
                </Form>
              )}

              {isAnalyzing && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                    <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-display font-semibold text-slate-900">Analyse en cours...</h3>
                    <p className="text-slate-500 text-sm">Vérification de la validité du code auprès de l'émetteur.</p>
                  </div>
                  <div className="w-full max-w-xs bg-slate-100 h-1.5 rounded-full overflow-hidden mt-4">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              )}

              {result === "success" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="bg-green-100 p-4 rounded-full text-green-600 mb-2">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display font-bold text-slate-900">Coupon Valide</h3>
                    <p className="text-slate-600">Le code a été vérifié avec succès. Il est actif et prêt à l'emploi.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={() => {
                      setResult(null);
                      form.reset();
                    }}
                  >
                    Vérifier un autre coupon
                  </Button>
                </motion.div>
              )}

            </CardContent>
          </Card>
        </motion.div>
      </main>

      <footer className="w-full py-8 border-t border-slate-100 bg-white text-center text-sm text-slate-400">
        <p>© 2025 CouponChecker. Tous droits réservés.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="hover:text-slate-600">Conditions d'utilisation</a>
          <span>•</span>
          <a href="#" className="hover:text-slate-600">Politique de confidentialité</a>
        </div>
      </footer>
    </div>
  );
}
