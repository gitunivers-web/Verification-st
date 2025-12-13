import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Cookies() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-back-home">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Politique des Cookies
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Politique des Cookies</h1>
          
          <p className="text-slate-600 mb-6">Derniere mise a jour : Decembre 2024</p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
          <p className="text-slate-600 mb-4">
            Un cookie est un petit fichier texte stocke sur votre appareil lorsque vous visitez un site web. 
            Les cookies permettent au site de se souvenir de vos actions et preferences.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Types de cookies utilises</h2>
          
          <h3 className="text-lg font-medium text-slate-800 mt-6 mb-3">Cookies essentiels</h3>
          <p className="text-slate-600 mb-4">
            Ces cookies sont necessaires au fonctionnement du site. Ils permettent notamment de maintenir 
            votre session de connexion et de securiser vos transactions.
          </p>

          <h3 className="text-lg font-medium text-slate-800 mt-6 mb-3">Cookies de performance</h3>
          <p className="text-slate-600 mb-4">
            Ces cookies nous aident a comprendre comment les visiteurs interagissent avec notre site, 
            afin d'ameliorer son fonctionnement et votre experience utilisateur.
          </p>

          <h3 className="text-lg font-medium text-slate-800 mt-6 mb-3">Cookies de preference</h3>
          <p className="text-slate-600 mb-4">
            Ces cookies permettent de memoriser vos preferences, comme la langue d'affichage ou le theme 
            (clair/sombre).
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. Gestion des cookies</h2>
          <p className="text-slate-600 mb-4">
            Vous pouvez controler et/ou supprimer les cookies comme vous le souhaitez. Vous pouvez supprimer 
            tous les cookies deja presents sur votre appareil et configurer la plupart des navigateurs pour 
            qu'ils les bloquent.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Cookies tiers</h2>
          <p className="text-slate-600 mb-4">
            Nous n'utilisons pas de cookies publicitaires tiers. Les seuls cookies tiers eventuels sont lies 
            a des services d'analyse anonymises pour ameliorer notre service.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Duree de conservation</h2>
          <p className="text-slate-600 mb-4">
            Les cookies de session sont supprimes lorsque vous fermez votre navigateur. Les cookies persistants 
            ont une duree de vie maximale de 12 mois.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">6. Contact</h2>
          <p className="text-slate-600 mb-4">
            Pour toute question concernant notre utilisation des cookies : contact@koupontrust.com
          </p>
        </div>
      </main>
    </div>
  );
}
