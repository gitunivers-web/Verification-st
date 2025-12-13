import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Terms() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-back-home">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Conditions d'utilisation
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Conditions Generales d'Utilisation</h1>
          
          <p className="text-slate-600 mb-6">Derniere mise a jour : Decembre 2024</p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Acceptation des conditions</h2>
          <p className="text-slate-600 mb-4">
            En utilisant le service Koupon Trust, vous acceptez les presentes conditions generales d'utilisation. 
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Description du service</h2>
          <p className="text-slate-600 mb-4">
            Koupon Trust est une plateforme de verification de coupons prepayys et de tickets. Notre service permet aux utilisateurs 
            de verifier la validite et le solde de differents types de coupons tels que Transcash, PCS, Neosurf, Paysafecard, et autres.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. Utilisation du service</h2>
          <p className="text-slate-600 mb-4">
            Vous vous engagez a utiliser notre service de maniere licite et conforme aux presentes conditions. 
            Il est interdit d'utiliser le service a des fins frauduleuses ou illegales.
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li>Ne pas soumettre de faux codes ou informations</li>
            <li>Ne pas tenter de compromettre la securite du systeme</li>
            <li>Ne pas utiliser le service pour des activites illegales</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Responsabilite</h2>
          <p className="text-slate-600 mb-4">
            Koupon Trust fournit un service de verification a titre informatif. Nous ne garantissons pas l'exactitude absolue des resultats 
            et ne pouvons etre tenus responsables des decisions prises sur la base de ces informations.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Protection des donnees</h2>
          <p className="text-slate-600 mb-4">
            Vos donnees personnelles sont traitees conformement a notre Politique de confidentialite. 
            Les codes de coupons soumis sont chiffres et supprimes automatiquement apres verification.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">6. Modifications</h2>
          <p className="text-slate-600 mb-4">
            Nous nous reservons le droit de modifier ces conditions a tout moment. Les utilisateurs seront informes 
            des modifications importantes par email ou notification sur le site.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">7. Contact</h2>
          <p className="text-slate-600 mb-4">
            Pour toute question concernant ces conditions, contactez-nous a : contact@koupontrust.com
          </p>
        </div>
      </main>
    </div>
  );
}
