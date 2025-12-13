import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "fr" | "nl" | "de" | "it" | "en";

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // Header
  "nav.home": {
    fr: "Accueil",
    nl: "Home",
    de: "Startseite",
    it: "Home",
    en: "Home",
  },
  "nav.login": {
    fr: "Connexion",
    nl: "Inloggen",
    de: "Anmelden",
    it: "Accedi",
    en: "Login",
  },
  "nav.register": {
    fr: "Inscription",
    nl: "Registreren",
    de: "Registrieren",
    it: "Registrati",
    en: "Register",
  },
  "nav.dashboard": {
    fr: "Tableau de bord",
    nl: "Dashboard",
    de: "Dashboard",
    it: "Dashboard",
    en: "Dashboard",
  },
  "nav.admin": {
    fr: "Admin",
    nl: "Admin",
    de: "Admin",
    it: "Admin",
    en: "Admin",
  },
  "nav.logout": {
    fr: "Deconnexion",
    nl: "Uitloggen",
    de: "Abmelden",
    it: "Esci",
    en: "Logout",
  },

  // Hero
  "hero.title": {
    fr: "Verification de coupons prepaye",
    nl: "Verificatie van prepaid coupons",
    de: "Prepaid-Coupon-Verifizierung",
    it: "Verifica dei coupon prepagati",
    en: "Prepaid Coupon Verification",
  },
  "hero.subtitle": {
    fr: "Verifiez l'authenticite de vos coupons en quelques clics",
    nl: "Verifieer de authenticiteit van uw coupons in enkele klikken",
    de: "Verifizieren Sie die Echtheit Ihrer Gutscheine in wenigen Klicks",
    it: "Verifica l'autenticita dei tuoi coupon in pochi clic",
    en: "Verify the authenticity of your coupons in a few clicks",
  },

  // Form
  "form.title": {
    fr: "Verifier un coupon",
    nl: "Coupon verifieren",
    de: "Gutschein verifizieren",
    it: "Verifica un coupon",
    en: "Verify a coupon",
  },
  "form.firstName": {
    fr: "Prenom",
    nl: "Voornaam",
    de: "Vorname",
    it: "Nome",
    en: "First Name",
  },
  "form.lastName": {
    fr: "Nom",
    nl: "Achternaam",
    de: "Nachname",
    it: "Cognome",
    en: "Last Name",
  },
  "form.email": {
    fr: "Email",
    nl: "E-mail",
    de: "E-Mail",
    it: "Email",
    en: "Email",
  },
  "form.couponType": {
    fr: "Type de coupon",
    nl: "Coupontype",
    de: "Gutscheintyp",
    it: "Tipo di coupon",
    en: "Coupon Type",
  },
  "form.selectCouponType": {
    fr: "Selectionnez un type",
    nl: "Selecteer een type",
    de: "Typ auswahlen",
    it: "Seleziona un tipo",
    en: "Select a type",
  },
  "form.amount": {
    fr: "Montant (EUR)",
    nl: "Bedrag (EUR)",
    de: "Betrag (EUR)",
    it: "Importo (EUR)",
    en: "Amount (EUR)",
  },
  "form.couponCode": {
    fr: "Code du coupon",
    nl: "Couponcode",
    de: "Gutscheincode",
    it: "Codice coupon",
    en: "Coupon Code",
  },
  "form.submit": {
    fr: "Soumettre pour verification",
    nl: "Indienen voor verificatie",
    de: "Zur Verifizierung einreichen",
    it: "Invia per verifica",
    en: "Submit for Verification",
  },
  "form.submitting": {
    fr: "Envoi en cours...",
    nl: "Bezig met verzenden...",
    de: "Wird gesendet...",
    it: "Invio in corso...",
    en: "Submitting...",
  },

  // Status messages
  "status.pending": {
    fr: "En attente",
    nl: "In behandeling",
    de: "Ausstehend",
    it: "In attesa",
    en: "Pending",
  },
  "status.valid": {
    fr: "Valide",
    nl: "Geldig",
    de: "Gultig",
    it: "Valido",
    en: "Valid",
  },
  "status.invalid": {
    fr: "Invalide",
    nl: "Ongeldig",
    de: "Ungultig",
    it: "Non valido",
    en: "Invalid",
  },
  "status.already_used": {
    fr: "Deja utilise",
    nl: "Reeds gebruikt",
    de: "Bereits verwendet",
    it: "Gia utilizzato",
    en: "Already Used",
  },

  // Features
  "features.secure.title": {
    fr: "100% Securise",
    nl: "100% Beveiligd",
    de: "100% Sicher",
    it: "100% Sicuro",
    en: "100% Secure",
  },
  "features.secure.desc": {
    fr: "Vos donnees sont protegees",
    nl: "Uw gegevens zijn beschermd",
    de: "Ihre Daten sind geschutzt",
    it: "I tuoi dati sono protetti",
    en: "Your data is protected",
  },
  "features.fast.title": {
    fr: "Rapide",
    nl: "Snel",
    de: "Schnell",
    it: "Veloce",
    en: "Fast",
  },
  "features.fast.desc": {
    fr: "Verification en moins de 24h",
    nl: "Verificatie binnen 24 uur",
    de: "Verifizierung innerhalb von 24h",
    it: "Verifica in meno di 24 ore",
    en: "Verification within 24h",
  },
  "features.support.title": {
    fr: "Support 24/7",
    nl: "24/7 Ondersteuning",
    de: "24/7 Support",
    it: "Supporto 24/7",
    en: "24/7 Support",
  },
  "features.support.desc": {
    fr: "Une equipe a votre ecoute",
    nl: "Een team dat naar u luistert",
    de: "Ein Team, das Ihnen zuhort",
    it: "Un team pronto ad ascoltarti",
    en: "A team ready to help",
  },

  // Footer
  "footer.terms": {
    fr: "Conditions d'utilisation",
    nl: "Gebruiksvoorwaarden",
    de: "Nutzungsbedingungen",
    it: "Termini di utilizzo",
    en: "Terms of Service",
  },
  "footer.privacy": {
    fr: "Politique de confidentialite",
    nl: "Privacybeleid",
    de: "Datenschutzrichtlinie",
    it: "Politica sulla privacy",
    en: "Privacy Policy",
  },
  "footer.cookies": {
    fr: "Politique des cookies",
    nl: "Cookiebeleid",
    de: "Cookie-Richtlinie",
    it: "Politica sui cookie",
    en: "Cookie Policy",
  },
  "footer.rights": {
    fr: "Tous droits reserves",
    nl: "Alle rechten voorbehouden",
    de: "Alle Rechte vorbehalten",
    it: "Tutti i diritti riservati",
    en: "All rights reserved",
  },

  // Auth modal
  "auth.welcome": {
    fr: "Bienvenue sur Koupon Trust",
    nl: "Welkom bij Koupon Trust",
    de: "Willkommen bei Koupon Trust",
    it: "Benvenuto su Koupon Trust",
    en: "Welcome to Koupon Trust",
  },
  "auth.loginTab": {
    fr: "Connexion",
    nl: "Inloggen",
    de: "Anmelden",
    it: "Accedi",
    en: "Login",
  },
  "auth.registerTab": {
    fr: "Inscription",
    nl: "Registreren",
    de: "Registrieren",
    it: "Registrati",
    en: "Register",
  },
  "auth.password": {
    fr: "Mot de passe",
    nl: "Wachtwoord",
    de: "Passwort",
    it: "Password",
    en: "Password",
  },
  "auth.confirmPassword": {
    fr: "Confirmer le mot de passe",
    nl: "Bevestig wachtwoord",
    de: "Passwort bestatigen",
    it: "Conferma password",
    en: "Confirm Password",
  },
  "auth.loginButton": {
    fr: "Se connecter",
    nl: "Inloggen",
    de: "Anmelden",
    it: "Accedi",
    en: "Login",
  },
  "auth.registerButton": {
    fr: "S'inscrire",
    nl: "Registreren",
    de: "Registrieren",
    it: "Registrati",
    en: "Register",
  },

  // Toast messages
  "toast.success": {
    fr: "Succes",
    nl: "Succes",
    de: "Erfolg",
    it: "Successo",
    en: "Success",
  },
  "toast.error": {
    fr: "Erreur",
    nl: "Fout",
    de: "Fehler",
    it: "Errore",
    en: "Error",
  },
  "toast.verificationSubmitted": {
    fr: "Votre demande a ete soumise avec succes",
    nl: "Uw verzoek is succesvol ingediend",
    de: "Ihre Anfrage wurde erfolgreich eingereicht",
    it: "La tua richiesta e stata inviata con successo",
    en: "Your request has been submitted successfully",
  },

  // Admin
  "admin.title": {
    fr: "Koupon Trust - Admin",
    nl: "Koupon Trust - Admin",
    de: "Koupon Trust - Admin",
    it: "Koupon Trust - Admin",
    en: "Koupon Trust - Admin",
  },
  "admin.total": {
    fr: "Total",
    nl: "Totaal",
    de: "Gesamt",
    it: "Totale",
    en: "Total",
  },
  "admin.pending": {
    fr: "En attente",
    nl: "In behandeling",
    de: "Ausstehend",
    it: "In attesa",
    en: "Pending",
  },
  "admin.valid": {
    fr: "Valides",
    nl: "Geldig",
    de: "Gultig",
    it: "Validi",
    en: "Valid",
  },
  "admin.invalid": {
    fr: "Invalides",
    nl: "Ongeldig",
    de: "Ungultig",
    it: "Non validi",
    en: "Invalid",
  },
  "admin.requests": {
    fr: "Demandes de verification",
    nl: "Verificatieverzoeken",
    de: "Verifizierungsanfragen",
    it: "Richieste di verifica",
    en: "Verification Requests",
  },
  "admin.user": {
    fr: "Utilisateur",
    nl: "Gebruiker",
    de: "Benutzer",
    it: "Utente",
    en: "User",
  },
  "admin.type": {
    fr: "Type",
    nl: "Type",
    de: "Typ",
    it: "Tipo",
    en: "Type",
  },
  "admin.amount": {
    fr: "Montant",
    nl: "Bedrag",
    de: "Betrag",
    it: "Importo",
    en: "Amount",
  },
  "admin.code": {
    fr: "Code",
    nl: "Code",
    de: "Code",
    it: "Codice",
    en: "Code",
  },
  "admin.status": {
    fr: "Statut",
    nl: "Status",
    de: "Status",
    it: "Stato",
    en: "Status",
  },
  "admin.registered": {
    fr: "Inscrit",
    nl: "Geregistreerd",
    de: "Registriert",
    it: "Registrato",
    en: "Registered",
  },
  "admin.guest": {
    fr: "Invite",
    nl: "Gast",
    de: "Gast",
    it: "Ospite",
    en: "Guest",
  },
  "admin.actions": {
    fr: "Actions",
    nl: "Acties",
    de: "Aktionen",
    it: "Azioni",
    en: "Actions",
  },
  "admin.markValid": {
    fr: "Bon",
    nl: "Geldig",
    de: "Gut",
    it: "Valido",
    en: "Valid",
  },
  "admin.markInvalid": {
    fr: "Pas bon",
    nl: "Ongeldig",
    de: "Ungultig",
    it: "Non valido",
    en: "Invalid",
  },
  "admin.markUsed": {
    fr: "Deja utilise",
    nl: "Reeds gebruikt",
    de: "Bereits verwendet",
    it: "Gia usato",
    en: "Already Used",
  },
  "admin.processed": {
    fr: "Traite",
    nl: "Verwerkt",
    de: "Bearbeitet",
    it: "Elaborato",
    en: "Processed",
  },
  "admin.noRequests": {
    fr: "Aucune demande pour le moment",
    nl: "Nog geen verzoeken",
    de: "Noch keine Anfragen",
    it: "Nessuna richiesta al momento",
    en: "No requests yet",
  },
  "admin.onlineUsers": {
    fr: "utilisateurs en ligne",
    nl: "gebruikers online",
    de: "Benutzer online",
    it: "utenti online",
    en: "users online",
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("koupon-language");
      if (saved && ["fr", "nl", "de", "it", "en"].includes(saved)) {
        return saved as Language;
      }
    }
    return "fr";
  });

  useEffect(() => {
    localStorage.setItem("koupon-language", language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[language] || translation.fr || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export const languageNames: Record<Language, string> = {
  fr: "Francais",
  nl: "Nederlands",
  de: "Deutsch",
  it: "Italiano",
  en: "English",
};
