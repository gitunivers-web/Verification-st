import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Privacy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-back-home">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Politique de confidentialite
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Politique de Confidentialite</h1>
          
          <p className="text-slate-600 mb-6">Derniere mise a jour : Decembre 2024</p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Collecte des donnees</h2>
          <p className="text-slate-600 mb-4">
            Koupon Trust collecte les donnees suivantes dans le cadre de son service de verification :
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li>Nom et prenom</li>
            <li>Adresse email</li>
            <li>Type et code du coupon a verifier</li>
            <li>Adresse IP (a des fins de securite)</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Utilisation des donnees</h2>
          <p className="text-slate-600 mb-4">
            Vos donnees sont utilisees exclusivement pour :
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li>Traiter vos demandes de verification</li>
            <li>Vous envoyer les resultats par email</li>
            <li>Ameliorer la qualite de notre service</li>
            <li>Assurer la securite de la plateforme</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. Securite des donnees</h2>
          <p className="text-slate-600 mb-4">
            Nous utilisons un chiffrement SSL 256-bit pour proteger vos donnees. Les codes de coupons sont 
            chiffres et ne sont jamais stockes en clair. Les donnees sont automatiquement supprimees apres traitement.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Partage des donnees</h2>
          <p className="text-slate-600 mb-4">
            Nous ne vendons, ne louons et ne partageons pas vos donnees personnelles avec des tiers, 
            sauf obligation legale ou avec votre consentement explicite.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Vos droits</h2>
          <p className="text-slate-600 mb-4">
            Conformement au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            <li>Droit d'acces a vos donnees</li>
            <li>Droit de rectification</li>
            <li>Droit a l'effacement</li>
            <li>Droit a la portabilite</li>
            <li>Droit d'opposition</li>
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">6. Conservation des donnees</h2>
          <p className="text-slate-600 mb-4">
            Les donnees de verification sont conservees pendant 30 jours maximum. Les donnees de compte 
            utilisateur sont conservees tant que le compte est actif.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">7. Contact</h2>
          <p className="text-slate-600 mb-4">
            Pour exercer vos droits ou pour toute question, contactez notre delegue a la protection des donnees : 
            privacy@koupontrust.com
          </p>
        </div>
      </main>
    </div>
  );
}
