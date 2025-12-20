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
  "placeholder.email": {
    fr: "votre@email.com",
    nl: "uw@email.com",
    de: "ihre@email.com",
    it: "tua@email.com",
    en: "your@email.com",
  },
  "placeholder.password": {
    fr: "Votre mot de passe",
    nl: "Uw wachtwoord",
    de: "Ihr Passwort",
    it: "La tua password",
    en: "Your password",
  },
  "placeholder.firstName": {
    fr: "Jean",
    nl: "Jan",
    de: "Max",
    it: "Marco",
    en: "John",
  },
  "placeholder.lastName": {
    fr: "Dupont",
    nl: "Jansen",
    de: "Mustermann",
    it: "Rossi",
    en: "Smith",
  },
  "placeholder.minCharacters": {
    fr: "Min. 12 caracteres",
    nl: "Min. 12 tekens",
    de: "Min. 12 Zeichen",
    it: "Min. 12 caratteri",
    en: "Min. 12 characters",
  },
  "placeholder.confirmPassword": {
    fr: "Confirmez votre mot de passe",
    nl: "Bevestig uw wachtwoord",
    de: "Passwort bestatigen",
    it: "Conferma la tua password",
    en: "Confirm your password",
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
  "form.other": {
    fr: "Autres",
    nl: "Overige",
    de: "Sonstige",
    it: "Altro",
    en: "Other",
  },
  "form.customCouponName": {
    fr: "Nom du coupon",
    nl: "Coupon naam",
    de: "Gutschein name",
    it: "Nome coupon",
    en: "Coupon name",
  },
  "form.enterCustomCouponName": {
    fr: "Entrez le nom du coupon",
    nl: "Voer de coupon naam in",
    de: "Geben Sie den Gutschein Namen ein",
    it: "Inserisci il nome del coupon",
    en: "Enter the coupon name",
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
  "auth.2faTitle": {
    fr: "Verification en deux etapes",
    nl: "Tweestapsverificatie",
    de: "Zwei-Faktor-Authentifizierung",
    it: "Verifica in due passaggi",
    en: "Two-Factor Authentication",
  },
  "auth.2faDescription": {
    fr: "Entrez le code a 6 chiffres de votre application d'authentification",
    nl: "Voer de 6-cijferige code van uw authenticatie-app in",
    de: "Geben Sie den 6-stelligen Code aus Ihrer Authentifizierungs-App ein",
    it: "Inserisci il codice a 6 cifre dalla tua app di autenticazione",
    en: "Enter the 6-digit code from your authenticator app",
  },
  "auth.back": {
    fr: "Retour",
    nl: "Terug",
    de: "Zuruck",
    it: "Indietro",
    en: "Back",
  },
  "auth.verify": {
    fr: "Verifier",
    nl: "Verifieren",
    de: "Verifizieren",
    it: "Verifica",
    en: "Verify",
  },

  // 2FA Settings
  "settings.2faTitle": {
    fr: "Authentification a deux facteurs",
    nl: "Tweefactorauthenticatie",
    de: "Zwei-Faktor-Authentifizierung",
    it: "Autenticazione a due fattori",
    en: "Two-Factor Authentication",
  },
  "settings.2faDescription": {
    fr: "Securisez votre compte avec une couche de protection supplementaire",
    nl: "Beveilig uw account met een extra beveiligingslaag",
    de: "Sichern Sie Ihr Konto mit einer zusatzlichen Schutzschicht",
    it: "Proteggi il tuo account con un livello di sicurezza aggiuntivo",
    en: "Secure your account with an additional layer of protection",
  },
  "settings.2faSetup": {
    fr: "Configurer la 2FA",
    nl: "2FA instellen",
    de: "2FA einrichten",
    it: "Configura 2FA",
    en: "Set up 2FA",
  },
  "settings.2faActive": {
    fr: "La 2FA est activee",
    nl: "2FA is ingeschakeld",
    de: "2FA ist aktiviert",
    it: "2FA e attivo",
    en: "2FA is enabled",
  },
  "settings.2faEnable": {
    fr: "Activer la 2FA",
    nl: "2FA inschakelen",
    de: "2FA aktivieren",
    it: "Attiva 2FA",
    en: "Enable 2FA",
  },
  "settings.2faDisable": {
    fr: "Desactiver la 2FA",
    nl: "2FA uitschakelen",
    de: "2FA deaktivieren",
    it: "Disattiva 2FA",
    en: "Disable 2FA",
  },
  "settings.2faDisablePrompt": {
    fr: "Entrez votre code 2FA pour confirmer la desactivation",
    nl: "Voer uw 2FA-code in om de uitschakeling te bevestigen",
    de: "Geben Sie Ihren 2FA-Code ein, um die Deaktivierung zu bestatigen",
    it: "Inserisci il tuo codice 2FA per confermare la disattivazione",
    en: "Enter your 2FA code to confirm disabling",
  },
  "settings.2faManualEntry": {
    fr: "Ou entrez ce code manuellement :",
    nl: "Of voer deze code handmatig in:",
    de: "Oder geben Sie diesen Code manuell ein:",
    it: "Oppure inserisci questo codice manualmente:",
    en: "Or enter this code manually:",
  },
  "settings.2faEnterCode": {
    fr: "Entrez le code de votre application",
    nl: "Voer de code van uw app in",
    de: "Geben Sie den Code aus Ihrer App ein",
    it: "Inserisci il codice dalla tua app",
    en: "Enter the code from your app",
  },
  "settings.2faEnabled": {
    fr: "La 2FA a ete activee avec succes",
    nl: "2FA is succesvol ingeschakeld",
    de: "2FA wurde erfolgreich aktiviert",
    it: "2FA attivato con successo",
    en: "2FA has been enabled successfully",
  },
  "settings.2faDisabled": {
    fr: "La 2FA a ete desactivee",
    nl: "2FA is uitgeschakeld",
    de: "2FA wurde deaktiviert",
    it: "2FA e stato disattivato",
    en: "2FA has been disabled",
  },
  "settings.2faSetupError": {
    fr: "Erreur lors de la configuration de la 2FA",
    nl: "Fout bij het instellen van 2FA",
    de: "Fehler beim Einrichten der 2FA",
    it: "Errore durante la configurazione 2FA",
    en: "Error setting up 2FA",
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
  "toast.passwordResetSent": {
    fr: "Si un compte existe avec cet email, vous recevrez un lien de reinitialisation.",
    nl: "Als er een account bestaat met deze e-mail, ontvangt u een reset-link.",
    de: "Wenn ein Konto mit dieser E-Mail existiert, erhalten Sie einen Reset-Link.",
    it: "Se esiste un account con questa email, riceverai un link di reset.",
    en: "If an account exists with this email, you will receive a reset link.",
  },
  "toast.genericError": {
    fr: "Une erreur est survenue. Veuillez reessayer.",
    nl: "Er is een fout opgetreden. Probeer het opnieuw.",
    de: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    it: "Si e verificato un errore. Riprova.",
    en: "An error occurred. Please try again.",
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

  // Dashboard - Navigation
  "dashboard.overview": {
    fr: "Vue d'ensemble",
    nl: "Overzicht",
    de: "Ubersicht",
    it: "Panoramica",
    en: "Overview",
  },
  "dashboard.myVerifications": {
    fr: "Mes verifications",
    nl: "Mijn verificaties",
    de: "Meine Verifizierungen",
    it: "Le mie verifiche",
    en: "My verifications",
  },
  "dashboard.myProfile": {
    fr: "Mon profil",
    nl: "Mijn profiel",
    de: "Mein Profil",
    it: "Il mio profilo",
    en: "My profile",
  },
  "dashboard.security": {
    fr: "Securite",
    nl: "Beveiliging",
    de: "Sicherheit",
    it: "Sicurezza",
    en: "Security",
  },
  "dashboard.loading": {
    fr: "Chargement de votre espace...",
    nl: "Uw ruimte laden...",
    de: "Laden Ihres Bereichs...",
    it: "Caricamento del tuo spazio...",
    en: "Loading your space...",
  },
  "dashboard.trustLevel": {
    fr: "Niveau de confiance",
    nl: "Vertrouwensniveau",
    de: "Vertrauensstufe",
    it: "Livello di fiducia",
    en: "Trust level",
  },
  "dashboard.premium": {
    fr: "Premium",
    nl: "Premium",
    de: "Premium",
    it: "Premium",
    en: "Premium",
  },
  "dashboard.successRate": {
    fr: "de reussite",
    nl: "slagingspercentage",
    de: "Erfolgsquote",
    it: "tasso di successo",
    en: "success rate",
  },
  "dashboard.navigation": {
    fr: "Navigation",
    nl: "Navigatie",
    de: "Navigation",
    it: "Navigazione",
    en: "Navigation",
  },
  "dashboard.quickActions": {
    fr: "Actions rapides",
    nl: "Snelle acties",
    de: "Schnellaktionen",
    it: "Azioni rapide",
    en: "Quick actions",
  },
  "dashboard.newVerification": {
    fr: "Nouvelle verification",
    nl: "Nieuwe verificatie",
    de: "Neue Verifizierung",
    it: "Nuova verifica",
    en: "New verification",
  },
  "dashboard.backToHome": {
    fr: "Retour a l'accueil",
    nl: "Terug naar home",
    de: "Zuruck zur Startseite",
    it: "Torna alla home",
    en: "Back to home",
  },
  "dashboard.logout": {
    fr: "Deconnexion",
    nl: "Uitloggen",
    de: "Abmelden",
    it: "Esci",
    en: "Logout",
  },
  "dashboard.mySpace": {
    fr: "Mon Espace KouponTrust",
    nl: "Mijn KouponTrust Ruimte",
    de: "Mein KouponTrust Bereich",
    it: "Il mio Spazio KouponTrust",
    en: "My KouponTrust Space",
  },
  "dashboard.personalDashboard": {
    fr: "Tableau de bord personnel",
    nl: "Persoonlijk dashboard",
    de: "Personliches Dashboard",
    it: "Dashboard personale",
    en: "Personal dashboard",
  },
  "dashboard.online": {
    fr: "En ligne",
    nl: "Online",
    de: "Online",
    it: "Online",
    en: "Online",
  },
  "dashboard.welcome": {
    fr: "Bienvenue,",
    nl: "Welkom,",
    de: "Willkommen,",
    it: "Benvenuto,",
    en: "Welcome,",
  },
  "dashboard.activitySummary": {
    fr: "Voici un resume de votre activite",
    nl: "Hier is een samenvatting van uw activiteit",
    de: "Hier ist eine Zusammenfassung Ihrer Aktivitat",
    it: "Ecco un riepilogo della tua attivita",
    en: "Here is a summary of your activity",
  },
  "dashboard.aiActive": {
    fr: "IA active",
    nl: "AI actief",
    de: "KI aktiv",
    it: "IA attiva",
    en: "AI active",
  },
  "dashboard.totalVerifications": {
    fr: "Total verifications",
    nl: "Totaal verificaties",
    de: "Gesamt Verifizierungen",
    it: "Totale verifiche",
    en: "Total verifications",
  },
  "dashboard.processed": {
    fr: "traitees",
    nl: "verwerkt",
    de: "bearbeitet",
    it: "elaborate",
    en: "processed",
  },
  "dashboard.pending": {
    fr: "En attente",
    nl: "In afwachting",
    de: "Ausstehend",
    it: "In attesa",
    en: "Pending",
  },
  "dashboard.processing": {
    fr: "Traitement en cours",
    nl: "Verwerking bezig",
    de: "Wird bearbeitet",
    it: "Elaborazione in corso",
    en: "Processing",
  },
  "dashboard.valid": {
    fr: "Valides",
    nl: "Geldig",
    de: "Gultig",
    it: "Validi",
    en: "Valid",
  },
  "dashboard.verifiedAmount": {
    fr: "Montant verifie",
    nl: "Geverifieerd bedrag",
    de: "Verifizierter Betrag",
    it: "Importo verificato",
    en: "Verified amount",
  },
  "dashboard.total": {
    fr: "total",
    nl: "totaal",
    de: "gesamt",
    it: "totale",
    en: "total",
  },
  "dashboard.recentActivity": {
    fr: "Activite recente",
    nl: "Recente activiteit",
    de: "Letzte Aktivitat",
    it: "Attivita recente",
    en: "Recent activity",
  },
  "dashboard.noActivity": {
    fr: "Aucune activite",
    nl: "Geen activiteit",
    de: "Keine Aktivitat",
    it: "Nessuna attivita",
    en: "No activity",
  },
  "dashboard.monthlyGoal": {
    fr: "Objectif du mois",
    nl: "Maanddoel",
    de: "Monatsziel",
    it: "Obiettivo del mese",
    en: "Monthly goal",
  },
  "dashboard.verifyCoupons": {
    fr: "Verifiez 10 coupons",
    nl: "Verifieer 10 coupons",
    de: "Verifizieren Sie 10 Gutscheine",
    it: "Verifica 10 coupon",
    en: "Verify 10 coupons",
  },
  "dashboard.verifications": {
    fr: "verifications",
    nl: "verificaties",
    de: "Verifizierungen",
    it: "verifiche",
    en: "verifications",
  },
  "dashboard.fullHistory": {
    fr: "Historique complet de vos demandes",
    nl: "Volledige geschiedenis van uw verzoeken",
    de: "Vollstandige Historie Ihrer Anfragen",
    it: "Cronologia completa delle tue richieste",
    en: "Complete history of your requests",
  },
  "dashboard.all": {
    fr: "Toutes",
    nl: "Alle",
    de: "Alle",
    it: "Tutte",
    en: "All",
  },
  "dashboard.invalid": {
    fr: "Invalides",
    nl: "Ongeldig",
    de: "Ungultig",
    it: "Non valide",
    en: "Invalid",
  },
  "dashboard.noVerifications": {
    fr: "Aucune verification trouvee",
    nl: "Geen verificaties gevonden",
    de: "Keine Verifizierungen gefunden",
    it: "Nessuna verifica trovata",
    en: "No verifications found",
  },
  "dashboard.startFirstVerification": {
    fr: "Commencez par soumettre votre premiere demande",
    nl: "Begin met het indienen van uw eerste verzoek",
    de: "Beginnen Sie mit Ihrer ersten Anfrage",
    it: "Inizia inviando la tua prima richiesta",
    en: "Start by submitting your first request",
  },
  "dashboard.viewDetails": {
    fr: "Voir les details",
    nl: "Details bekijken",
    de: "Details anzeigen",
    it: "Vedi dettagli",
    en: "View details",
  },
  "dashboard.personalInfo": {
    fr: "Informations personnelles",
    nl: "Persoonlijke informatie",
    de: "Personliche Informationen",
    it: "Informazioni personali",
    en: "Personal information",
  },
  "dashboard.manageInfo": {
    fr: "Gerez vos informations de compte",
    nl: "Beheer uw accountgegevens",
    de: "Verwalten Sie Ihre Kontoinformationen",
    it: "Gestisci le informazioni del tuo account",
    en: "Manage your account information",
  },
  "dashboard.fullName": {
    fr: "Nom complet",
    nl: "Volledige naam",
    de: "Vollstandiger Name",
    it: "Nome completo",
    en: "Full name",
  },
  "dashboard.email": {
    fr: "Email",
    nl: "E-mail",
    de: "E-Mail",
    it: "Email",
    en: "Email",
  },
  "dashboard.memberSince": {
    fr: "Membre depuis",
    nl: "Lid sinds",
    de: "Mitglied seit",
    it: "Membro da",
    en: "Member since",
  },
  "dashboard.accountStatus": {
    fr: "Statut du compte",
    nl: "Accountstatus",
    de: "Kontostatus",
    it: "Stato account",
    en: "Account status",
  },
  "dashboard.verified": {
    fr: "Verifie",
    nl: "Geverifieerd",
    de: "Verifiziert",
    it: "Verificato",
    en: "Verified",
  },
  "dashboard.statistics": {
    fr: "Statistiques",
    nl: "Statistieken",
    de: "Statistiken",
    it: "Statistiche",
    en: "Statistics",
  },
  "dashboard.yourStats": {
    fr: "Vos statistiques de verification",
    nl: "Uw verificatiestatistieken",
    de: "Ihre Verifizierungsstatistiken",
    it: "Le tue statistiche di verifica",
    en: "Your verification statistics",
  },
  "dashboard.totalRequests": {
    fr: "Demandes totales",
    nl: "Totaal verzoeken",
    de: "Gesamtanfragen",
    it: "Richieste totali",
    en: "Total requests",
  },
  "dashboard.validCoupons": {
    fr: "Coupons valides",
    nl: "Geldige coupons",
    de: "Gultige Gutscheine",
    it: "Coupon validi",
    en: "Valid coupons",
  },
  "dashboard.invalidCoupons": {
    fr: "Coupons invalides",
    nl: "Ongeldige coupons",
    de: "Ungultige Gutscheine",
    it: "Coupon non validi",
    en: "Invalid coupons",
  },
  "dashboard.pendingCoupons": {
    fr: "En attente",
    nl: "In afwachting",
    de: "Ausstehend",
    it: "In attesa",
    en: "Pending",
  },
  "dashboard.securitySettings": {
    fr: "Parametres de securite",
    nl: "Beveiligingsinstellingen",
    de: "Sicherheitseinstellungen",
    it: "Impostazioni di sicurezza",
    en: "Security settings",
  },
  "dashboard.manageSecuritySettings": {
    fr: "Gerez la securite de votre compte",
    nl: "Beheer de beveiliging van uw account",
    de: "Verwalten Sie die Sicherheit Ihres Kontos",
    it: "Gestisci la sicurezza del tuo account",
    en: "Manage your account security",
  },
  "dashboard.changePassword": {
    fr: "Changer le mot de passe",
    nl: "Wachtwoord wijzigen",
    de: "Passwort andern",
    it: "Cambia password",
    en: "Change password",
  },
  "dashboard.changePasswordDesc": {
    fr: "Mettez a jour votre mot de passe regulierement pour plus de securite",
    nl: "Werk uw wachtwoord regelmatig bij voor meer veiligheid",
    de: "Aktualisieren Sie Ihr Passwort regelma\u00dfig fur mehr Sicherheit",
    it: "Aggiorna regolarmente la tua password per maggiore sicurezza",
    en: "Update your password regularly for better security",
  },
  "dashboard.twoFactor": {
    fr: "Authentification a deux facteurs",
    nl: "Tweefactorauthenticatie",
    de: "Zwei-Faktor-Authentifizierung",
    it: "Autenticazione a due fattori",
    en: "Two-factor authentication",
  },
  "dashboard.twoFactorDesc": {
    fr: "Ajoutez une couche de securite supplementaire",
    nl: "Voeg een extra beveiligingslaag toe",
    de: "Fugen Sie eine zusatzliche Sicherheitsebene hinzu",
    it: "Aggiungi un ulteriore livello di sicurezza",
    en: "Add an extra layer of security",
  },
  "dashboard.activeSessions": {
    fr: "Sessions actives",
    nl: "Actieve sessies",
    de: "Aktive Sitzungen",
    it: "Sessioni attive",
    en: "Active sessions",
  },
  "dashboard.activeSessionsDesc": {
    fr: "Gerez les appareils connectes a votre compte",
    nl: "Beheer apparaten die zijn verbonden met uw account",
    de: "Verwalten Sie Gerate, die mit Ihrem Konto verbunden sind",
    it: "Gestisci i dispositivi connessi al tuo account",
    en: "Manage devices connected to your account",
  },
  "dashboard.comingSoon": {
    fr: "Bientot disponible",
    nl: "Binnenkort beschikbaar",
    de: "Bald verfugbar",
    it: "Presto disponibile",
    en: "Coming soon",
  },

  // Home page
  "home.mySpace": {
    fr: "Mon espace",
    nl: "Mijn ruimte",
    de: "Mein Bereich",
    it: "Il mio spazio",
    en: "My space",
  },
  "home.myAccount": {
    fr: "Mon compte",
    nl: "Mijn account",
    de: "Mein Konto",
    it: "Il mio account",
    en: "My account",
  },
  "home.logout": {
    fr: "Deconnexion",
    nl: "Uitloggen",
    de: "Abmelden",
    it: "Esci",
    en: "Logout",
  },
  "home.verifyCoupon": {
    fr: "Verifier un coupon",
    nl: "Coupon verifieren",
    de: "Gutschein verifizieren",
    it: "Verifica coupon",
    en: "Verify coupon",
  },
  "home.supportedBrands": {
    fr: "Emetteurs supportes",
    nl: "Ondersteunde uitgevers",
    de: "Unterstutzte Aussteller",
    it: "Emittenti supportati",
    en: "Supported issuers",
  },
  "home.faq": {
    fr: "Questions frequentes",
    nl: "Veelgestelde vragen",
    de: "Haufig gestellte Fragen",
    it: "Domande frequenti",
    en: "Frequently asked questions",
  },
  "home.quickLinks": {
    fr: "Liens rapides",
    nl: "Snelle links",
    de: "Schnelllinks",
    it: "Link rapidi",
    en: "Quick links",
  },
  "home.legalInfo": {
    fr: "Informations legales",
    nl: "Juridische informatie",
    de: "Rechtliche Informationen",
    it: "Informazioni legali",
    en: "Legal information",
  },
  "home.followUs": {
    fr: "Suivez-nous",
    nl: "Volg ons",
    de: "Folgen Sie uns",
    it: "Seguici",
    en: "Follow us",
  },
  "home.selectType": {
    fr: "Selectionnez un type",
    nl: "Selecteer een type",
    de: "Typ auswahlen",
    it: "Seleziona un tipo",
    en: "Select a type",
  },
  "home.selectAmount": {
    fr: "Selectionnez un montant",
    nl: "Selecteer een bedrag",
    de: "Betrag auswahlen",
    it: "Seleziona un importo",
    en: "Select an amount",
  },
  "home.showCode": {
    fr: "Afficher",
    nl: "Tonen",
    de: "Anzeigen",
    it: "Mostra",
    en: "Show",
  },
  "home.hideCode": {
    fr: "Masquer",
    nl: "Verbergen",
    de: "Verbergen",
    it: "Nascondi",
    en: "Hide",
  },
  "home.addCode": {
    fr: "Ajouter un code",
    nl: "Code toevoegen",
    de: "Code hinzufugen",
    it: "Aggiungi codice",
    en: "Add code",
  },
  "home.removeCode": {
    fr: "Retirer",
    nl: "Verwijderen",
    de: "Entfernen",
    it: "Rimuovi",
    en: "Remove",
  },
  "home.analyzing": {
    fr: "Analyse en cours...",
    nl: "Analyse bezig...",
    de: "Analyse lauft...",
    it: "Analisi in corso...",
    en: "Analyzing...",
  },
  "home.verificationSent": {
    fr: "Demande envoyee",
    nl: "Verzoek verzonden",
    de: "Anfrage gesendet",
    it: "Richiesta inviata",
    en: "Request sent",
  },
  "home.codesSubmitted": {
    fr: "code(s) soumis pour verification",
    nl: "code(s) ingediend voor verificatie",
    de: "Code(s) zur Verifizierung eingereicht",
    it: "codice/i inviato/i per verifica",
    en: "code(s) submitted for verification",
  },
  "home.howItWorks": {
    fr: "Comment ca marche ?",
    nl: "Hoe werkt het?",
    de: "Wie funktioniert es?",
    it: "Come funziona?",
    en: "How does it work?",
  },
  "home.whyKouponTrust": {
    fr: "Pourquoi Koupon Trust ?",
    nl: "Waarom Koupon Trust?",
    de: "Warum Koupon Trust?",
    it: "Perche Koupon Trust?",
    en: "Why Koupon Trust?",
  },
  "home.ourTechnology": {
    fr: "Notre Technologie",
    nl: "Onze Technologie",
    de: "Unsere Technologie",
    it: "La Nostra Tecnologia",
    en: "Our Technology",
  },
  "home.paymentCards": {
    fr: "Cartes de paiement",
    nl: "Betaalkaarten",
    de: "Zahlungskarten",
    it: "Carte di pagamento",
    en: "Payment cards",
  },
  "home.giftCards": {
    fr: "Cartes cadeaux",
    nl: "Cadeaukaarten",
    de: "Geschenkkarten",
    it: "Carte regalo",
    en: "Gift cards",
  },
  "home.gaming": {
    fr: "Gaming",
    nl: "Gaming",
    de: "Gaming",
    it: "Gaming",
    en: "Gaming",
  },
  "home.entertainment": {
    fr: "Divertissement",
    nl: "Entertainment",
    de: "Unterhaltung",
    it: "Intrattenimento",
    en: "Entertainment",
  },
  "home.allCategories": {
    fr: "Tous",
    nl: "Alle",
    de: "Alle",
    it: "Tutti",
    en: "All",
  },
  "home.acceptTerms": {
    fr: "J'accepte les conditions d'utilisation",
    nl: "Ik accepteer de gebruiksvoorwaarden",
    de: "Ich akzeptiere die Nutzungsbedingungen",
    it: "Accetto i termini di utilizzo",
    en: "I accept the terms of use",
  },

  // Navigation
  "nav.howItWorks": {
    fr: "Comment ca marche",
    nl: "Hoe werkt het",
    de: "Wie es funktioniert",
    it: "Come funziona",
    en: "How it works",
  },
  "nav.security": {
    fr: "Securite",
    nl: "Beveiliging",
    de: "Sicherheit",
    it: "Sicurezza",
    en: "Security",
  },
  "nav.issuers": {
    fr: "Emetteurs",
    nl: "Uitgevers",
    de: "Aussteller",
    it: "Emittenti",
    en: "Issuers",
  },
  "nav.faq": {
    fr: "FAQ",
    nl: "FAQ",
    de: "FAQ",
    it: "FAQ",
    en: "FAQ",
  },

  // Hero section
  "hero.systemActive": {
    fr: "SYSTEME ACTIF",
    nl: "SYSTEEM ACTIEF",
    de: "SYSTEM AKTIV",
    it: "SISTEMA ATTIVO",
    en: "SYSTEM ACTIVE",
  },
  "hero.infrastructureOf": {
    fr: "Infrastructure de",
    nl: "Infrastructuur voor",
    de: "Infrastruktur fur",
    it: "Infrastruttura di",
    en: "Infrastructure of",
  },
  "hero.advancedVerification": {
    fr: "Verification Avancee",
    nl: "Geavanceerde Verificatie",
    de: "Erweiterte Verifizierung",
    it: "Verifica Avanzata",
    en: "Advanced Verification",
  },
  "hero.description": {
    fr: "Analyse cryptographique multi-couche. Detection de fraude par IA. Protection en temps reel.",
    nl: "Multi-layer cryptografische analyse. AI-fraudedetectie. Real-time bescherming.",
    de: "Mehrschichtige kryptografische Analyse. KI-Betrugserkennung. Echtzeitschutz.",
    it: "Analisi crittografica multi-livello. Rilevamento frodi con IA. Protezione in tempo reale.",
    en: "Multi-layer cryptographic analysis. AI fraud detection. Real-time protection.",
  },
  "hero.precision": {
    fr: "Precision",
    nl: "Precisie",
    de: "Prazision",
    it: "Precisione",
    en: "Precision",
  },
  "hero.latency": {
    fr: "Latence",
    nl: "Latentie",
    de: "Latenz",
    it: "Latenza",
    en: "Latency",
  },
  "hero.encryption": {
    fr: "Chiffrement",
    nl: "Versleuteling",
    de: "Verschlusselung",
    it: "Crittografia",
    en: "Encryption",
  },
  "hero.technology2026": {
    fr: "Technologie 2026",
    nl: "Technologie 2026",
    de: "Technologie 2026",
    it: "Tecnologia 2026",
    en: "Technology 2026",
  },
  "hero.verifyCoupons": {
    fr: "Verifiez vos coupons",
    nl: "Verifieer uw coupons",
    de: "Verifizieren Sie Ihre Gutscheine",
    it: "Verifica i tuoi coupon",
    en: "Verify your coupons",
  },
  "hero.instantly": {
    fr: "instantanement.",
    nl: "direct.",
    de: "sofort.",
    it: "istantaneamente.",
    en: "instantly.",
  },
  "hero.mainDescription": {
    fr: "Koupon Trust utilise un moteur d'analyse intelligent combinant IA, detection de fraude, verification cryptographique et analyse visuelle haute precision. Une solution de confiance adoptee par des milliers d'utilisateurs.",
    nl: "Koupon Trust gebruikt een intelligente analyse-engine die AI, fraudedetectie, cryptografische verificatie en visuele analyse met hoge precisie combineert. Een vertrouwde oplossing die door duizenden gebruikers wordt gebruikt.",
    de: "Koupon Trust verwendet eine intelligente Analyse-Engine, die KI, Betrugserkennung, kryptografische Verifizierung und visuelle Analyse mit hoher Prazision kombiniert. Eine vertrauenswurdige Losung, die von Tausenden von Benutzern verwendet wird.",
    it: "Koupon Trust utilizza un motore di analisi intelligente che combina IA, rilevamento frodi, verifica crittografica e analisi visiva ad alta precisione. Una soluzione affidabile adottata da migliaia di utenti.",
    en: "Koupon Trust uses an intelligent analysis engine combining AI, fraud detection, cryptographic verification and high-precision visual analysis. A trusted solution adopted by thousands of users.",
  },

  // Additional form labels (unique ones)
  "form.service": {
    fr: "Service",
    nl: "Service",
    de: "Service",
    it: "Servizio",
    en: "Service",
  },
  "form.couponCode1": {
    fr: "Code 1 du Coupon",
    nl: "Couponcode 1",
    de: "Gutscheincode 1",
    it: "Codice Coupon 1",
    en: "Coupon Code 1",
  },
  "form.couponCode2": {
    fr: "Code 2 du Coupon",
    nl: "Couponcode 2",
    de: "Gutscheincode 2",
    it: "Codice Coupon 2",
    en: "Coupon Code 2",
  },
  "form.couponCode3": {
    fr: "Code 3 du Coupon",
    nl: "Couponcode 3",
    de: "Gutscheincode 3",
    it: "Codice Coupon 3",
    en: "Coupon Code 3",
  },
  "form.enterCouponCode": {
    fr: "Entrez le code de votre coupon",
    nl: "Voer uw couponcode in",
    de: "Geben Sie Ihren Gutscheincode ein",
    it: "Inserisci il codice del tuo coupon",
    en: "Enter your coupon code",
  },
  "form.secondCode": {
    fr: "Deuxieme code",
    nl: "Tweede code",
    de: "Zweiter Code",
    it: "Secondo codice",
    en: "Second code",
  },
  "form.thirdCode": {
    fr: "Troisieme code",
    nl: "Derde code",
    de: "Dritter Code",
    it: "Terzo codice",
    en: "Third code",
  },
  "form.show": {
    fr: "Afficher",
    nl: "Tonen",
    de: "Anzeigen",
    it: "Mostra",
    en: "Show",
  },
  "form.hide": {
    fr: "Cacher",
    nl: "Verbergen",
    de: "Verbergen",
    it: "Nascondi",
    en: "Hide",
  },
  "form.addCode": {
    fr: "Ajouter",
    nl: "Toevoegen",
    de: "Hinzufugen",
    it: "Aggiungi",
    en: "Add",
  },
  "form.removeCode": {
    fr: "Supprimer ce code",
    nl: "Verwijder deze code",
    de: "Diesen Code entfernen",
    it: "Rimuovi questo codice",
    en: "Remove this code",
  },
  "form.uploadImage": {
    fr: "Telecharger une image (optionnel)",
    nl: "Upload een afbeelding (optioneel)",
    de: "Bild hochladen (optional)",
    it: "Carica un'immagine (opzionale)",
    en: "Upload an image (optional)",
  },
  "form.dragDropImage": {
    fr: "Glissez votre image ici ou cliquez pour telecharger",
    nl: "Sleep uw afbeelding hierheen of klik om te uploaden",
    de: "Ziehen Sie Ihr Bild hierher oder klicken Sie zum Hochladen",
    it: "Trascina la tua immagine qui o clicca per caricare",
    en: "Drag your image here or click to upload",
  },
  "form.imageFormats": {
    fr: "PNG, JPG jusqu'a 5MB",
    nl: "PNG, JPG tot 5MB",
    de: "PNG, JPG bis zu 5MB",
    it: "PNG, JPG fino a 5MB",
    en: "PNG, JPG up to 5MB",
  },
  "form.startVerification": {
    fr: "Demarrer la verification",
    nl: "Start verificatie",
    de: "Verifizierung starten",
    it: "Avvia verifica",
    en: "Start verification",
  },
  "form.verifyNow": {
    fr: "Verifier maintenant",
    nl: "Nu verifiëren",
    de: "Jetzt verifizieren",
    it: "Verifica ora",
    en: "Verify now",
  },
  "form.couponPhoto": {
    fr: "Photo du coupon (optionnelle, mais importante pour une verification rapide)",
    nl: "Foto van coupon (optioneel, maar belangrijk voor snelle verificatie)",
    de: "Foto des Gutscheins (optional, aber wichtig fur schnelle Verifizierung)",
    it: "Foto del coupon (opzionale, ma importante per una verifica rapida)",
    en: "Photo of coupon (optional, but important for quick verification)",
  },
  "form.analyzing": {
    fr: "Analyse en cours...",
    nl: "Analyse bezig...",
    de: "Analyse läuft...",
    it: "Analisi in corso...",
    en: "Analysis in progress...",
  },
  "form.secureValidation": {
    fr: "Validation cryptographique securisee.",
    nl: "Beveiligde cryptografische validatie.",
    de: "Sichere kryptografische Validierung.",
    it: "Validazione crittografica sicura.",
    en: "Secure cryptographic validation.",
  },
  "form.verificationProcessed": {
    fr: "Demande de verification",
    nl: "Verificatieverzoek",
    de: "Verifizierungsanfrage",
    it: "Richiesta di verifica",
    en: "Verification request",
  },

  // Results section
  "result.requestSent": {
    fr: "Demande envoyee",
    nl: "Verzoek verzonden",
    de: "Anfrage gesendet",
    it: "Richiesta inviata",
    en: "Request sent",
  },
  "result.processingMessage": {
    fr: "Votre demande de verification est en cours de traitement. Vous recevrez un email avec le resultat sous peu.",
    nl: "Uw verificatieverzoek wordt verwerkt. U ontvangt binnenkort een e-mail met het resultaat.",
    de: "Ihre Verifizierungsanfrage wird bearbeitet. Sie erhalten in Kurze eine E-Mail mit dem Ergebnis.",
    it: "La tua richiesta di verifica e in fase di elaborazione. Riceverai presto un'email con il risultato.",
    en: "Your verification request is being processed. You will receive an email with the result shortly.",
  },
  "result.viewMySpace": {
    fr: "Voir mon espace",
    nl: "Bekijk mijn ruimte",
    de: "Meinen Bereich anzeigen",
    it: "Vedi il mio spazio",
    en: "View my space",
  },
  "result.newVerification": {
    fr: "Nouvelle verification",
    nl: "Nieuwe verificatie",
    de: "Neue Verifizierung",
    it: "Nuova verifica",
    en: "New verification",
  },
  "result.error": {
    fr: "Erreur",
    nl: "Fout",
    de: "Fehler",
    it: "Errore",
    en: "Error",
  },
  "result.errorMessage": {
    fr: "Une erreur est survenue lors de la soumission. Veuillez reessayer.",
    nl: "Er is een fout opgetreden bij het verzenden. Probeer het opnieuw.",
    de: "Beim Absenden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    it: "Si e verificato un errore durante l'invio. Per favore riprova.",
    en: "An error occurred while submitting. Please try again.",
  },
  "result.retry": {
    fr: "Reessayer",
    nl: "Opnieuw proberen",
    de: "Erneut versuchen",
    it: "Riprova",
    en: "Retry",
  },

  // Sections
  "section.validationProcess": {
    fr: "Processus de Validation",
    nl: "Validatieproces",
    de: "Validierungsprozess",
    it: "Processo di Validazione",
    en: "Validation Process",
  },
  "section.validationDesc": {
    fr: "Une technologie complexe rendue simple pour l'utilisateur. 3 etapes securisees.",
    nl: "Een complexe technologie eenvoudig gemaakt voor de gebruiker. 3 beveiligde stappen.",
    de: "Eine komplexe Technologie, die fur den Benutzer einfach gemacht wurde. 3 sichere Schritte.",
    it: "Una tecnologia complessa resa semplice per l'utente. 3 passaggi sicuri.",
    en: "Complex technology made simple for the user. 3 secure steps.",
  },
  "section.intelligenceInfra": {
    fr: "Infrastructure Intelligence",
    nl: "Intelligentie-infrastructuur",
    de: "Intelligenz-Infrastruktur",
    it: "Infrastruttura di Intelligenza",
    en: "Intelligence Infrastructure",
  },
  "section.intelligenceDesc": {
    fr: "Notre coeur technologique repose sur un reseau neuronal proprietaire capable de detecter les fraudes et de valider les codes en millisecondes. Nous croisons les donnees avec les serveurs emetteurs via des tunnels chiffres.",
    nl: "Onze technologische kern is gebaseerd op een eigen neuraal netwerk dat fraude kan detecteren en codes in milliseconden kan valideren. We kruisen gegevens met uitgeversservers via versleutelde tunnels.",
    de: "Unser technologisches Herzstuck basiert auf einem proprietaren neuronalen Netzwerk, das Betrug erkennen und Codes in Millisekunden validieren kann. Wir kreuzen Daten mit Ausstellerservern uber verschlusselte Tunnel.",
    it: "Il nostro cuore tecnologico si basa su una rete neurale proprietaria in grado di rilevare frodi e convalidare i codici in millisecondi. Incrociamo i dati con i server degli emittenti tramite tunnel crittografati.",
    en: "Our technological core is based on a proprietary neural network capable of detecting fraud and validating codes in milliseconds. We cross data with issuer servers via encrypted tunnels.",
  },
  "section.compatibleEcosystem": {
    fr: "Ecosysteme Compatible",
    nl: "Compatibel Ecosysteem",
    de: "Kompatibles Okosystem",
    it: "Ecosistema Compatibile",
    en: "Compatible Ecosystem",
  },
  "section.frequentQuestions": {
    fr: "Questions Frequentes",
    nl: "Veelgestelde Vragen",
    de: "Haufig gestellte Fragen",
    it: "Domande Frequenti",
    en: "Frequently Asked Questions",
  },

  // Steps
  "steps.step1.title": {
    fr: "Soumission",
    nl: "Indiening",
    de: "Einreichung",
    it: "Invio",
    en: "Submission",
  },
  "steps.step1.desc": {
    fr: "Envoyez votre code ou image de coupon via notre formulaire securise.",
    nl: "Stuur uw code of couponafbeelding via ons beveiligde formulier.",
    de: "Senden Sie Ihren Code oder Gutscheinbild uber unser sicheres Formular.",
    it: "Invia il tuo codice o immagine del coupon tramite il nostro modulo sicuro.",
    en: "Submit your code or coupon image via our secure form.",
  },
  "steps.step2.title": {
    fr: "Analyse IA",
    nl: "AI-analyse",
    de: "KI-Analyse",
    it: "Analisi IA",
    en: "AI Analysis",
  },
  "steps.step2.desc": {
    fr: "Notre moteur d'IA analyse, verifie et valide instantanement.",
    nl: "Onze AI-engine analyseert, verifieert en valideert direct.",
    de: "Unsere KI-Engine analysiert, verifiziert und validiert sofort.",
    it: "Il nostro motore IA analizza, verifica e convalida istantaneamente.",
    en: "Our AI engine analyzes, verifies and validates instantly.",
  },
  "steps.step3.title": {
    fr: "Resultat",
    nl: "Resultaat",
    de: "Ergebnis",
    it: "Risultato",
    en: "Result",
  },
  "steps.step3.desc": {
    fr: "Recevez un rapport detaille par email avec le statut de votre coupon.",
    nl: "Ontvang een gedetailleerd rapport per e-mail met de status van uw coupon.",
    de: "Erhalten Sie einen detaillierten Bericht per E-Mail mit dem Status Ihres Gutscheins.",
    it: "Ricevi un rapporto dettagliato via email con lo stato del tuo coupon.",
    en: "Receive a detailed report by email with the status of your coupon.",
  },

  // Features
  "features.instantVerification": {
    fr: "Verification Instantanee",
    nl: "Directe Verificatie",
    de: "Sofortige Verifizierung",
    it: "Verifica Istantanea",
    en: "Instant Verification",
  },
  "features.instantDesc": {
    fr: "Resultats en temps reel via API directe.",
    nl: "Real-time resultaten via directe API.",
    de: "Echtzeitergebnisse uber direkte API.",
    it: "Risultati in tempo reale tramite API diretta.",
    en: "Real-time results via direct API.",
  },
  "features.aiDetection": {
    fr: "Detection IA",
    nl: "AI-detectie",
    de: "KI-Erkennung",
    it: "Rilevamento IA",
    en: "AI Detection",
  },
  "features.aiDesc": {
    fr: "Detection de fraude par reseau neuronal.",
    nl: "Fraudedetectie door neuraal netwerk.",
    de: "Betrugserkennung durch neuronales Netzwerk.",
    it: "Rilevamento frodi tramite rete neurale.",
    en: "Fraud detection by neural network.",
  },
  "features.cryptoValidation": {
    fr: "Validation Crypto",
    nl: "Crypto Validatie",
    de: "Krypto-Validierung",
    it: "Validazione Crypto",
    en: "Crypto Validation",
  },
  "features.cryptoDesc": {
    fr: "Verification de l'authenticite cryptographique.",
    nl: "Verificatie van cryptografische authenticiteit.",
    de: "Verifizierung der kryptografischen Authentizitat.",
    it: "Verifica dell'autenticita crittografica.",
    en: "Cryptographic authenticity verification.",
  },
  "features.advancedSecurity": {
    fr: "Securite Avancee",
    nl: "Geavanceerde Beveiliging",
    de: "Erweiterte Sicherheit",
    it: "Sicurezza Avanzata",
    en: "Advanced Security",
  },
  "features.securityDesc": {
    fr: "Chiffrement SSL 256-bit de bout en bout.",
    nl: "End-to-end SSL 256-bit versleuteling.",
    de: "End-to-End-SSL-256-Bit-Verschlusselung.",
    it: "Crittografia SSL 256-bit end-to-end.",
    en: "End-to-end SSL 256-bit encryption.",
  },

  // FAQ items
  "faq.q1": {
    fr: "Pourquoi verifier mon coupon ?",
    nl: "Waarom mijn coupon verifieren?",
    de: "Warum meinen Gutschein verifizieren?",
    it: "Perche verificare il mio coupon?",
    en: "Why verify my coupon?",
  },
  "faq.a1": {
    fr: "Verifier votre coupon permet de s'assurer de sa validite, de confirmer le montant disponible et de detecter toute anomalie avant utilisation ou transaction.",
    nl: "Door uw coupon te verifieren kunt u de geldigheid controleren, het beschikbare bedrag bevestigen en eventuele afwijkingen detecteren voor gebruik of transactie.",
    de: "Durch die Verifizierung Ihres Gutscheins konnen Sie die Gultigkeit uberprufen, den verfugbaren Betrag bestatigen und eventuelle Anomalien vor der Verwendung oder Transaktion erkennen.",
    it: "Verificare il tuo coupon ti permette di assicurarti della sua validita, confermare l'importo disponibile e rilevare eventuali anomalie prima dell'utilizzo o della transazione.",
    en: "Verifying your coupon ensures its validity, confirms the available amount and detects any anomalies before use or transaction.",
  },
  "faq.q2": {
    fr: "Combien de temps prend la verification ?",
    nl: "Hoelang duurt de verificatie?",
    de: "Wie lange dauert die Verifizierung?",
    it: "Quanto tempo richiede la verifica?",
    en: "How long does verification take?",
  },
  "faq.a2": {
    fr: "L'analyse est quasi-instantanee. Notre systeme interroge les serveurs emetteurs en temps reel et vous fournit un resultat en moins de 30 secondes.",
    nl: "De analyse is bijna onmiddellijk. Ons systeem vraagt de uitgeversservers in realtime op en geeft u binnen 30 seconden een resultaat.",
    de: "Die Analyse ist nahezu sofort. Unser System fragt die Ausstellerserver in Echtzeit ab und liefert Ihnen innerhalb von 30 Sekunden ein Ergebnis.",
    it: "L'analisi e quasi istantanea. Il nostro sistema interroga i server degli emittenti in tempo reale e ti fornisce un risultato in meno di 30 secondi.",
    en: "The analysis is almost instant. Our system queries the issuer servers in real time and provides you with a result in less than 30 seconds.",
  },
  "faq.q3": {
    fr: "Est-ce anonyme ?",
    nl: "Is het anoniem?",
    de: "Ist es anonym?",
    it: "E anonimo?",
    en: "Is it anonymous?",
  },
  "faq.a3": {
    fr: "Absolument. Nous ne stockons aucune donnee personnelle. Les informations de verification sont chiffrees et supprimees automatiquement apres l'analyse.",
    nl: "Absoluut. We slaan geen persoonlijke gegevens op. Verificatie-informatie wordt versleuteld en automatisch verwijderd na de analyse.",
    de: "Absolut. Wir speichern keine personlichen Daten. Verifizierungsinformationen werden verschlusselt und nach der Analyse automatisch geloscht.",
    it: "Assolutamente. Non memorizziamo alcun dato personale. Le informazioni di verifica sono crittografate e cancellate automaticamente dopo l'analisi.",
    en: "Absolutely. We do not store any personal data. Verification information is encrypted and automatically deleted after analysis.",
  },
  "faq.q4": {
    fr: "Quelle est la precision du systeme ?",
    nl: "Wat is de nauwkeurigheid van het systeem?",
    de: "Wie genau ist das System?",
    it: "Qual e la precisione del sistema?",
    en: "What is the system's accuracy?",
  },
  "faq.a4": {
    fr: "Notre technologie combine l'IA et la validation cryptographique directe pour un taux de precision de 99.9%, eliminant les faux positifs.",
    nl: "Onze technologie combineert AI en directe cryptografische validatie voor een nauwkeurigheid van 99,9%, waardoor valse positieven worden geelimineerd.",
    de: "Unsere Technologie kombiniert KI und direkte kryptografische Validierung fur eine Genauigkeitsrate von 99,9% und eliminiert Fehlalarme.",
    it: "La nostra tecnologia combina IA e validazione crittografica diretta per un tasso di precisione del 99,9%, eliminando i falsi positivi.",
    en: "Our technology combines AI and direct cryptographic validation for a 99.9% accuracy rate, eliminating false positives.",
  },
  "faq.q5": {
    fr: "Comment mes donnees sont-elles protegees ?",
    nl: "Hoe worden mijn gegevens beschermd?",
    de: "Wie werden meine Daten geschutzt?",
    it: "Come sono protetti i miei dati?",
    en: "How is my data protected?",
  },
  "faq.a5": {
    fr: "Nous utilisons un chiffrement SSL 256-bit de bout en bout. Vos codes et images ne sont jamais stockes sur nos serveurs de maniere permanente.",
    nl: "We gebruiken end-to-end SSL 256-bit versleuteling. Uw codes en afbeeldingen worden nooit permanent op onze servers opgeslagen.",
    de: "Wir verwenden eine End-to-End-SSL-256-Bit-Verschlusselung. Ihre Codes und Bilder werden niemals dauerhaft auf unseren Servern gespeichert.",
    it: "Utilizziamo la crittografia SSL 256-bit end-to-end. I tuoi codici e le tue immagini non vengono mai memorizzati in modo permanente sui nostri server.",
    en: "We use end-to-end SSL 256-bit encryption. Your codes and images are never stored permanently on our servers.",
  },

  // Tech stack
  "tech.neuralNetwork": {
    fr: "Reseau Neuronal",
    nl: "Neuraal Netwerk",
    de: "Neuronales Netzwerk",
    it: "Rete Neurale",
    en: "Neural Network",
  },
  "tech.blockchain": {
    fr: "Validation Blockchain",
    nl: "Blockchain Validatie",
    de: "Blockchain-Validierung",
    it: "Validazione Blockchain",
    en: "Blockchain Validation",
  },
  "tech.encryption": {
    fr: "Chiffrement SSL",
    nl: "SSL-versleuteling",
    de: "SSL-Verschlusselung",
    it: "Crittografia SSL",
    en: "SSL Encryption",
  },
  "tech.distributed": {
    fr: "Infrastructure Distribuee",
    nl: "Gedistribueerde Infrastructuur",
    de: "Verteilte Infrastruktur",
    it: "Infrastruttura Distribuita",
    en: "Distributed Infrastructure",
  },

  // Footer
  "footer.description": {
    fr: "La reference mondiale pour la verification securisee de titres prepayes. Technologie certifiee ISO 27001.",
    nl: "De wereldwijde referentie voor veilige verificatie van prepaid-tegoeden. ISO 27001 gecertificeerde technologie.",
    de: "Die weltweite Referenz fur die sichere Verifizierung von Prepaid-Guthaben. ISO 27001-zertifizierte Technologie.",
    it: "Il riferimento mondiale per la verifica sicura dei titoli prepagati. Tecnologia certificata ISO 27001.",
    en: "The global reference for secure verification of prepaid credits. ISO 27001 certified technology.",
  },
  "footer.quickLinks": {
    fr: "Liens Rapides",
    nl: "Snelkoppelingen",
    de: "Schnelllinks",
    it: "Link Rapidi",
    en: "Quick Links",
  },
  "footer.verifyCoupon": {
    fr: "Verifier un coupon",
    nl: "Coupon verifieren",
    de: "Gutschein verifizieren",
    it: "Verifica un coupon",
    en: "Verify a coupon",
  },
  "footer.supportedBrands": {
    fr: "Marques supportees",
    nl: "Ondersteunde merken",
    de: "Unterstutzte Marken",
    it: "Marchi supportati",
    en: "Supported brands",
  },
  "footer.frequentQuestions": {
    fr: "Questions frequentes",
    nl: "Veelgestelde vragen",
    de: "Haufig gestellte Fragen",
    it: "Domande frequenti",
    en: "Frequently asked questions",
  },
  "footer.legal": {
    fr: "Legal",
    nl: "Juridisch",
    de: "Rechtliches",
    it: "Legale",
    en: "Legal",
  },
  "footer.termsOfUse": {
    fr: "Conditions d'utilisation",
    nl: "Gebruiksvoorwaarden",
    de: "Nutzungsbedingungen",
    it: "Condizioni d'uso",
    en: "Terms of use",
  },
  "footer.privacyPolicy": {
    fr: "Politique de confidentialite",
    nl: "Privacybeleid",
    de: "Datenschutzrichtlinie",
    it: "Politica sulla privacy",
    en: "Privacy policy",
  },
  "footer.allRightsReserved": {
    fr: "Tous droits reserves.",
    nl: "Alle rechten voorbehouden.",
    de: "Alle Rechte vorbehalten.",
    it: "Tutti i diritti riservati.",
    en: "All rights reserved.",
  },
  "footer.sendEmail": {
    fr: "Envoyer un email",
    nl: "E-mail verzenden",
    de: "E-Mail senden",
    it: "Invia un'email",
    en: "Send an email",
  },

  // Categories for coupon filter
  "categories.all": {
    fr: "Tous",
    nl: "Alles",
    de: "Alle",
    it: "Tutti",
    en: "All",
  },
  "categories.payment": {
    fr: "Paiement",
    nl: "Betaling",
    de: "Zahlung",
    it: "Pagamento",
    en: "Payment",
  },
  "categories.gift": {
    fr: "Cadeau",
    nl: "Cadeau",
    de: "Geschenk",
    it: "Regalo",
    en: "Gift",
  },
  "categories.gaming": {
    fr: "Gaming",
    nl: "Gaming",
    de: "Gaming",
    it: "Gaming",
    en: "Gaming",
  },
  "categories.entertainment": {
    fr: "Divertissement",
    nl: "Entertainment",
    de: "Unterhaltung",
    it: "Intrattenimento",
    en: "Entertainment",
  },

  // Nova AI Engine translations
  "nova.liveAnalysis": {
    fr: "ANALYSE EN DIRECT",
    nl: "LIVE ANALYSE",
    de: "LIVE-ANALYSE",
    it: "ANALISI DAL VIVO",
    en: "LIVE ANALYSIS",
  },
  "nova.codesAnalyzed": {
    fr: "Codes Analyses",
    nl: "Codes Geanalyseerd",
    de: "Codes Analysiert",
    it: "Codici Analizzati",
    en: "Codes Analyzed",
  },
  "nova.today": {
    fr: "aujourd'hui",
    nl: "vandaag",
    de: "heute",
    it: "oggi",
    en: "today",
  },
  "nova.fraudsDetected": {
    fr: "Fraudes Detectees",
    nl: "Fraude Gedetecteerd",
    de: "Betrug Erkannt",
    it: "Frodi Rilevate",
    en: "Frauds Detected",
  },
  "nova.accuracy": {
    fr: "99.97% precision",
    nl: "99.97% nauwkeurigheid",
    de: "99.97% Genauigkeit",
    it: "99.97% precisione",
    en: "99.97% accuracy",
  },
  "nova.neuralNetworkStatus": {
    fr: "Etat du Reseau Neuronal",
    nl: "Neurale Netwerk Status",
    de: "Neuronales Netzwerk Status",
    it: "Stato Rete Neurale",
    en: "Neural Network Status",
  },
  "nova.processingPower": {
    fr: "Puissance de Traitement",
    nl: "Verwerkingskracht",
    de: "Rechenleistung",
    it: "Potenza di Elaborazione",
    en: "Processing Power",
  },
  "nova.cryptoValidation": {
    fr: "Flux de Validation Cryptographique",
    nl: "Cryptografische Validatie Stream",
    de: "Kryptografische Validierung Stream",
    it: "Flusso di Validazione Crittografica",
    en: "Cryptographic Validation Stream",
  },
  "nova.secureConnection": {
    fr: "Connexion Securisee",
    nl: "Beveiligde Verbinding",
    de: "Sichere Verbindung",
    it: "Connessione Sicura",
    en: "Secure Connection",
  },

  // Auth - Forgot password
  "auth.forgotPassword": {
    fr: "Mot de passe oublie ?",
    nl: "Wachtwoord vergeten?",
    de: "Passwort vergessen?",
    it: "Password dimenticata?",
    en: "Forgot password?",
  },
  "auth.forgotPasswordTitle": {
    fr: "Mot de passe oublie",
    nl: "Wachtwoord vergeten",
    de: "Passwort vergessen",
    it: "Password dimenticata",
    en: "Forgot password",
  },
  "auth.forgotPasswordDescription": {
    fr: "Entrez votre email pour recevoir un lien de reinitialisation",
    nl: "Voer uw e-mail in om een reset-link te ontvangen",
    de: "Geben Sie Ihre E-Mail ein, um einen Reset-Link zu erhalten",
    it: "Inserisci la tua email per ricevere un link di reset",
    en: "Enter your email to receive a reset link",
  },
  "auth.resetPassword": {
    fr: "Reinitialiser le mot de passe",
    nl: "Wachtwoord resetten",
    de: "Passwort zurucksetzen",
    it: "Reimposta password",
    en: "Reset password",
  },
  "auth.sendResetLink": {
    fr: "Envoyer le lien de reinitialisation",
    nl: "Reset-link verzenden",
    de: "Reset-Link senden",
    it: "Invia link di reset",
    en: "Send reset link",
  },
  "auth.backToLogin": {
    fr: "Retour a la connexion",
    nl: "Terug naar inloggen",
    de: "Zuruck zur Anmeldung",
    it: "Torna al login",
    en: "Back to login",
  },
  "auth.resetEmailSent": {
    fr: "Email de reinitialisation envoye",
    nl: "Reset-e-mail verzonden",
    de: "Reset-E-Mail gesendet",
    it: "Email di reset inviata",
    en: "Reset email sent",
  },
  "auth.newPassword": {
    fr: "Nouveau mot de passe",
    nl: "Nieuw wachtwoord",
    de: "Neues Passwort",
    it: "Nuova password",
    en: "New password",
  },
  "auth.confirmNewPassword": {
    fr: "Confirmer le nouveau mot de passe",
    nl: "Bevestig nieuw wachtwoord",
    de: "Neues Passwort bestatigen",
    it: "Conferma nuova password",
    en: "Confirm new password",
  },
  "auth.passwordRequirements": {
    fr: "12 caracteres minimum, majuscule, minuscule et chiffre",
    nl: "Minimaal 12 tekens, hoofdletter, kleine letter en cijfer",
    de: "Mindestens 12 Zeichen, Gro\u00dfbuchstabe, Kleinbuchstabe und Zahl",
    it: "Minimo 12 caratteri, maiuscola, minuscola e numero",
    en: "12 characters minimum, uppercase, lowercase and number",
  },

  // Terms page
  "terms.title": {
    fr: "Conditions d'utilisation",
    nl: "Gebruiksvoorwaarden",
    de: "Nutzungsbedingungen",
    it: "Termini di utilizzo",
    en: "Terms of Service",
  },
  "terms.generalConditions": {
    fr: "Conditions Generales d'Utilisation",
    nl: "Algemene Gebruiksvoorwaarden",
    de: "Allgemeine Nutzungsbedingungen",
    it: "Condizioni Generali di Utilizzo",
    en: "General Terms of Use",
  },
  "terms.lastUpdate": {
    fr: "Derniere mise a jour : Decembre 2024",
    nl: "Laatst bijgewerkt: December 2024",
    de: "Letzte Aktualisierung: Dezember 2024",
    it: "Ultimo aggiornamento: Dicembre 2024",
    en: "Last updated: December 2024",
  },
  "terms.section1Title": {
    fr: "1. Acceptation des conditions",
    nl: "1. Acceptatie van voorwaarden",
    de: "1. Annahme der Bedingungen",
    it: "1. Accettazione delle condizioni",
    en: "1. Acceptance of terms",
  },
  "terms.section1Content": {
    fr: "En utilisant le service Koupon Trust, vous acceptez les presentes conditions generales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.",
    nl: "Door de Koupon Trust-service te gebruiken, accepteert u deze algemene gebruiksvoorwaarden. Als u deze voorwaarden niet accepteert, gebruik dan onze service niet.",
    de: "Durch die Nutzung des Koupon Trust-Dienstes akzeptieren Sie diese allgemeinen Nutzungsbedingungen. Wenn Sie diese Bedingungen nicht akzeptieren, nutzen Sie unseren Dienst bitte nicht.",
    it: "Utilizzando il servizio Koupon Trust, accetti le presenti condizioni generali di utilizzo. Se non accetti queste condizioni, ti preghiamo di non utilizzare il nostro servizio.",
    en: "By using the Koupon Trust service, you accept these general terms of use. If you do not accept these terms, please do not use our service.",
  },
  "terms.section2Title": {
    fr: "2. Description du service",
    nl: "2. Beschrijving van de dienst",
    de: "2. Beschreibung des Dienstes",
    it: "2. Descrizione del servizio",
    en: "2. Service description",
  },
  "terms.section2Content": {
    fr: "Koupon Trust est une plateforme de verification de coupons prepayes et de tickets. Notre service permet aux utilisateurs de verifier la validite et le solde de differents types de coupons tels que Transcash, PCS, Neosurf, Paysafecard, et autres.",
    nl: "Koupon Trust is een platform voor het verifieren van prepaid coupons en tickets. Onze service stelt gebruikers in staat om de geldigheid en het saldo van verschillende soorten coupons te verifieren, zoals Transcash, PCS, Neosurf, Paysafecard en andere.",
    de: "Koupon Trust ist eine Plattform zur Verifizierung von Prepaid-Gutscheinen und Tickets. Unser Service ermoglicht es Benutzern, die Gultigkeit und das Guthaben verschiedener Gutscheinarten wie Transcash, PCS, Neosurf, Paysafecard und andere zu uberprufen.",
    it: "Koupon Trust e una piattaforma di verifica di coupon prepagati e biglietti. Il nostro servizio consente agli utenti di verificare la validita e il saldo di vari tipi di coupon come Transcash, PCS, Neosurf, Paysafecard e altri.",
    en: "Koupon Trust is a platform for verifying prepaid coupons and tickets. Our service allows users to verify the validity and balance of various types of coupons such as Transcash, PCS, Neosurf, Paysafecard, and others.",
  },
  "terms.section3Title": {
    fr: "3. Utilisation du service",
    nl: "3. Gebruik van de dienst",
    de: "3. Nutzung des Dienstes",
    it: "3. Utilizzo del servizio",
    en: "3. Use of service",
  },
  "terms.section3Content": {
    fr: "Vous vous engagez a utiliser notre service de maniere licite et conforme aux presentes conditions. Il est interdit d'utiliser le service a des fins frauduleuses ou illegales.",
    nl: "U verbindt zich ertoe onze service op een wettige manier en in overeenstemming met deze voorwaarden te gebruiken. Het is verboden de service te gebruiken voor frauduleuze of illegale doeleinden.",
    de: "Sie verpflichten sich, unseren Dienst auf rechtma\u00dfige Weise und in Ubereinstimmung mit diesen Bedingungen zu nutzen. Es ist verboten, den Dienst fur betrugerische oder illegale Zwecke zu nutzen.",
    it: "Ti impegni a utilizzare il nostro servizio in modo lecito e conforme alle presenti condizioni. E vietato utilizzare il servizio per scopi fraudolenti o illegali.",
    en: "You agree to use our service lawfully and in accordance with these terms. It is prohibited to use the service for fraudulent or illegal purposes.",
  },
  "terms.section3List": {
    fr: "Ne pas soumettre de faux codes ou informations|Ne pas tenter de compromettre la securite du systeme|Ne pas utiliser le service pour des activites illegales",
    nl: "Geen valse codes of informatie indienen|Niet proberen de systeembeveiliging te compromitteren|De service niet gebruiken voor illegale activiteiten",
    de: "Keine falschen Codes oder Informationen einreichen|Nicht versuchen, die Systemsicherheit zu gefahrden|Den Dienst nicht fur illegale Aktivitaten nutzen",
    it: "Non inviare codici o informazioni falsi|Non tentare di compromettere la sicurezza del sistema|Non utilizzare il servizio per attivita illegali",
    en: "Do not submit false codes or information|Do not attempt to compromise system security|Do not use the service for illegal activities",
  },
  "terms.section4Title": {
    fr: "4. Responsabilite",
    nl: "4. Aansprakelijkheid",
    de: "4. Haftung",
    it: "4. Responsabilita",
    en: "4. Liability",
  },
  "terms.section4Content": {
    fr: "Koupon Trust fournit un service de verification a titre informatif. Nous ne garantissons pas l'exactitude absolue des resultats et ne pouvons etre tenus responsables des decisions prises sur la base de ces informations.",
    nl: "Koupon Trust biedt een verificatieservice ter informatie. We garanderen niet de absolute nauwkeurigheid van de resultaten en kunnen niet verantwoordelijk worden gehouden voor beslissingen die op basis van deze informatie worden genomen.",
    de: "Koupon Trust bietet einen Verifizierungsdienst zu Informationszwecken. Wir garantieren nicht die absolute Genauigkeit der Ergebnisse und konnen nicht fur Entscheidungen verantwortlich gemacht werden, die auf der Grundlage dieser Informationen getroffen werden.",
    it: "Koupon Trust fornisce un servizio di verifica a scopo informativo. Non garantiamo l'assoluta accuratezza dei risultati e non possiamo essere ritenuti responsabili delle decisioni prese sulla base di queste informazioni.",
    en: "Koupon Trust provides a verification service for informational purposes. We do not guarantee the absolute accuracy of the results and cannot be held responsible for decisions made based on this information.",
  },
  "terms.section5Title": {
    fr: "5. Protection des donnees",
    nl: "5. Gegevensbescherming",
    de: "5. Datenschutz",
    it: "5. Protezione dei dati",
    en: "5. Data protection",
  },
  "terms.section5Content": {
    fr: "Vos donnees personnelles sont traitees conformement a notre Politique de confidentialite. Les codes de coupons soumis sont chiffres et supprimes automatiquement apres verification.",
    nl: "Uw persoonlijke gegevens worden verwerkt in overeenstemming met ons Privacybeleid. Ingediende couponcodes worden versleuteld en automatisch verwijderd na verificatie.",
    de: "Ihre personlichen Daten werden gema\u00df unserer Datenschutzrichtlinie verarbeitet. Eingereichte Gutscheincodes werden verschlusselt und nach der Verifizierung automatisch geloscht.",
    it: "I tuoi dati personali sono trattati in conformita con la nostra Politica sulla Privacy. I codici coupon inviati sono criptati e cancellati automaticamente dopo la verifica.",
    en: "Your personal data is processed in accordance with our Privacy Policy. Submitted coupon codes are encrypted and automatically deleted after verification.",
  },
  "terms.section6Title": {
    fr: "6. Modifications",
    nl: "6. Wijzigingen",
    de: "6. Anderungen",
    it: "6. Modifiche",
    en: "6. Modifications",
  },
  "terms.section6Content": {
    fr: "Nous nous reservons le droit de modifier ces conditions a tout moment. Les utilisateurs seront informes des modifications importantes par email ou notification sur le site.",
    nl: "We behouden ons het recht voor deze voorwaarden op elk moment te wijzigen. Gebruikers worden op de hoogte gebracht van belangrijke wijzigingen via e-mail of een melding op de site.",
    de: "Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu andern. Benutzer werden uber wichtige Anderungen per E-Mail oder durch eine Benachrichtigung auf der Website informiert.",
    it: "Ci riserviamo il diritto di modificare queste condizioni in qualsiasi momento. Gli utenti saranno informati delle modifiche importanti via email o notifica sul sito.",
    en: "We reserve the right to modify these terms at any time. Users will be informed of important changes by email or notification on the site.",
  },
  "terms.section7Title": {
    fr: "7. Contact",
    nl: "7. Contact",
    de: "7. Kontakt",
    it: "7. Contatto",
    en: "7. Contact",
  },
  "terms.section7Content": {
    fr: "Pour toute question concernant ces conditions, contactez-nous a : contact@koupontrust.com",
    nl: "Voor vragen over deze voorwaarden kunt u contact met ons opnemen via: contact@koupontrust.com",
    de: "Bei Fragen zu diesen Bedingungen kontaktieren Sie uns unter: contact@koupontrust.com",
    it: "Per qualsiasi domanda riguardante queste condizioni, contattaci a: contact@koupontrust.com",
    en: "For any questions regarding these terms, contact us at: contact@koupontrust.com",
  },

  // Privacy page
  "privacy.title": {
    fr: "Politique de confidentialite",
    nl: "Privacybeleid",
    de: "Datenschutzrichtlinie",
    it: "Politica sulla privacy",
    en: "Privacy Policy",
  },
  "privacy.lastUpdate": {
    fr: "Derniere mise a jour : Decembre 2024",
    nl: "Laatst bijgewerkt: December 2024",
    de: "Letzte Aktualisierung: Dezember 2024",
    it: "Ultimo aggiornamento: Dicembre 2024",
    en: "Last updated: December 2024",
  },
  "privacy.section1Title": {
    fr: "1. Collecte des donnees",
    nl: "1. Gegevensverzameling",
    de: "1. Datenerhebung",
    it: "1. Raccolta dei dati",
    en: "1. Data collection",
  },
  "privacy.section1Content": {
    fr: "Koupon Trust collecte les donnees suivantes dans le cadre de son service de verification :",
    nl: "Koupon Trust verzamelt de volgende gegevens in het kader van zijn verificatieservice:",
    de: "Koupon Trust erhebt folgende Daten im Rahmen seines Verifizierungsdienstes:",
    it: "Koupon Trust raccoglie i seguenti dati nell'ambito del suo servizio di verifica:",
    en: "Koupon Trust collects the following data as part of its verification service:",
  },
  "privacy.section1List": {
    fr: "Nom et prenom|Adresse email|Type et code du coupon a verifier|Adresse IP (a des fins de securite)",
    nl: "Voor- en achternaam|E-mailadres|Type en code van de te verifieren coupon|IP-adres (voor beveiligingsdoeleinden)",
    de: "Vor- und Nachname|E-Mail-Adresse|Art und Code des zu verifizierenden Gutscheins|IP-Adresse (zu Sicherheitszwecken)",
    it: "Nome e cognome|Indirizzo email|Tipo e codice del coupon da verificare|Indirizzo IP (per scopi di sicurezza)",
    en: "First and last name|Email address|Type and code of the coupon to verify|IP address (for security purposes)",
  },
  "privacy.section2Title": {
    fr: "2. Utilisation des donnees",
    nl: "2. Gebruik van gegevens",
    de: "2. Verwendung der Daten",
    it: "2. Utilizzo dei dati",
    en: "2. Use of data",
  },
  "privacy.section2Content": {
    fr: "Vos donnees sont utilisees exclusivement pour :",
    nl: "Uw gegevens worden uitsluitend gebruikt voor:",
    de: "Ihre Daten werden ausschlie\u00dflich verwendet fur:",
    it: "I tuoi dati sono utilizzati esclusivamente per:",
    en: "Your data is used exclusively for:",
  },
  "privacy.section2List": {
    fr: "Traiter vos demandes de verification|Vous envoyer les resultats par email|Ameliorer la qualite de notre service|Assurer la securite de la plateforme",
    nl: "Uw verificatieverzoeken verwerken|U de resultaten per e-mail sturen|De kwaliteit van onze service verbeteren|De veiligheid van het platform waarborgen",
    de: "Ihre Verifizierungsanfragen bearbeiten|Ihnen die Ergebnisse per E-Mail senden|Die Qualitat unseres Dienstes verbessern|Die Sicherheit der Plattform gewahrleisten",
    it: "Elaborare le tue richieste di verifica|Inviarti i risultati via email|Migliorare la qualita del nostro servizio|Garantire la sicurezza della piattaforma",
    en: "Process your verification requests|Send you the results by email|Improve the quality of our service|Ensure platform security",
  },
  "privacy.section3Title": {
    fr: "3. Securite des donnees",
    nl: "3. Gegevensbeveiliging",
    de: "3. Datensicherheit",
    it: "3. Sicurezza dei dati",
    en: "3. Data security",
  },
  "privacy.section3Content": {
    fr: "Nous utilisons un chiffrement SSL 256-bit pour proteger vos donnees. Les codes de coupons sont chiffres et ne sont jamais stockes en clair. Les donnees sont automatiquement supprimees apres traitement.",
    nl: "We gebruiken SSL 256-bit encryptie om uw gegevens te beschermen. Couponcodes worden versleuteld en worden nooit in platte tekst opgeslagen. Gegevens worden automatisch verwijderd na verwerking.",
    de: "Wir verwenden SSL 256-Bit-Verschlusselung zum Schutz Ihrer Daten. Gutscheincodes werden verschlusselt und niemals im Klartext gespeichert. Daten werden nach der Verarbeitung automatisch geloscht.",
    it: "Utilizziamo la crittografia SSL a 256 bit per proteggere i tuoi dati. I codici coupon sono criptati e non vengono mai memorizzati in chiaro. I dati vengono automaticamente eliminati dopo l'elaborazione.",
    en: "We use SSL 256-bit encryption to protect your data. Coupon codes are encrypted and are never stored in plain text. Data is automatically deleted after processing.",
  },
  "privacy.section4Title": {
    fr: "4. Partage des donnees",
    nl: "4. Delen van gegevens",
    de: "4. Weitergabe von Daten",
    it: "4. Condivisione dei dati",
    en: "4. Data sharing",
  },
  "privacy.section4Content": {
    fr: "Nous ne vendons, ne louons et ne partageons pas vos donnees personnelles avec des tiers, sauf obligation legale ou avec votre consentement explicite.",
    nl: "Wij verkopen, verhuren of delen uw persoonlijke gegevens niet met derden, tenzij dit wettelijk verplicht is of met uw uitdrukkelijke toestemming.",
    de: "Wir verkaufen, vermieten oder teilen Ihre personlichen Daten nicht mit Dritten, es sei denn, dies ist gesetzlich vorgeschrieben oder erfolgt mit Ihrer ausdrucklichen Zustimmung.",
    it: "Non vendiamo, non affittiamo e non condividiamo i tuoi dati personali con terze parti, salvo obbligo legale o con il tuo consenso esplicito.",
    en: "We do not sell, rent, or share your personal data with third parties, except when legally required or with your explicit consent.",
  },
  "privacy.section5Title": {
    fr: "5. Vos droits",
    nl: "5. Uw rechten",
    de: "5. Ihre Rechte",
    it: "5. I tuoi diritti",
    en: "5. Your rights",
  },
  "privacy.section5Content": {
    fr: "Conformement au RGPD, vous disposez des droits suivants :",
    nl: "In overeenstemming met de AVG heeft u de volgende rechten:",
    de: "Gema\u00df der DSGVO haben Sie folgende Rechte:",
    it: "In conformita al GDPR, hai i seguenti diritti:",
    en: "In accordance with GDPR, you have the following rights:",
  },
  "privacy.section5List": {
    fr: "Droit d'acces a vos donnees|Droit de rectification|Droit a l'effacement|Droit a la portabilite|Droit d'opposition",
    nl: "Recht op toegang tot uw gegevens|Recht op rectificatie|Recht op wissing|Recht op gegevensoverdraagbaarheid|Recht op bezwaar",
    de: "Recht auf Zugang zu Ihren Daten|Recht auf Berichtigung|Recht auf Loschung|Recht auf Datenubertragbarkeit|Widerspruchsrecht",
    it: "Diritto di accesso ai tuoi dati|Diritto di rettifica|Diritto alla cancellazione|Diritto alla portabilita|Diritto di opposizione",
    en: "Right to access your data|Right to rectification|Right to erasure|Right to data portability|Right to object",
  },
  "privacy.section6Title": {
    fr: "6. Conservation des donnees",
    nl: "6. Gegevensbewaring",
    de: "6. Datenspeicherung",
    it: "6. Conservazione dei dati",
    en: "6. Data retention",
  },
  "privacy.section6Content": {
    fr: "Les donnees de verification sont conservees pendant 30 jours maximum. Les donnees de compte utilisateur sont conservees tant que le compte est actif.",
    nl: "Verificatiegegevens worden maximaal 30 dagen bewaard. Gebruikersaccountgegevens worden bewaard zolang het account actief is.",
    de: "Verifizierungsdaten werden maximal 30 Tage aufbewahrt. Benutzerkontodaten werden aufbewahrt, solange das Konto aktiv ist.",
    it: "I dati di verifica sono conservati per un massimo di 30 giorni. I dati dell'account utente sono conservati finche l'account e attivo.",
    en: "Verification data is retained for a maximum of 30 days. User account data is retained as long as the account is active.",
  },
  "privacy.section7Title": {
    fr: "7. Contact",
    nl: "7. Contact",
    de: "7. Kontakt",
    it: "7. Contatto",
    en: "7. Contact",
  },
  "privacy.section7Content": {
    fr: "Pour exercer vos droits ou pour toute question, contactez notre delegue a la protection des donnees : privacy@koupontrust.com",
    nl: "Om uw rechten uit te oefenen of voor vragen, neem contact op met onze functionaris voor gegevensbescherming: privacy@koupontrust.com",
    de: "Um Ihre Rechte auszuuben oder bei Fragen wenden Sie sich an unseren Datenschutzbeauftragten: privacy@koupontrust.com",
    it: "Per esercitare i tuoi diritti o per qualsiasi domanda, contatta il nostro responsabile della protezione dei dati: privacy@koupontrust.com",
    en: "To exercise your rights or for any questions, contact our data protection officer: privacy@koupontrust.com",
  },

  // Cookies page
  "cookies.title": {
    fr: "Politique des cookies",
    nl: "Cookiebeleid",
    de: "Cookie-Richtlinie",
    it: "Politica sui cookie",
    en: "Cookie Policy",
  },
  "cookies.lastUpdate": {
    fr: "Derniere mise a jour : Decembre 2024",
    nl: "Laatst bijgewerkt: December 2024",
    de: "Letzte Aktualisierung: Dezember 2024",
    it: "Ultimo aggiornamento: Dicembre 2024",
    en: "Last updated: December 2024",
  },
  "cookies.section1Title": {
    fr: "1. Qu'est-ce qu'un cookie ?",
    nl: "1. Wat is een cookie?",
    de: "1. Was ist ein Cookie?",
    it: "1. Cos'e un cookie?",
    en: "1. What is a cookie?",
  },
  "cookies.section1Content": {
    fr: "Un cookie est un petit fichier texte stocke sur votre appareil lorsque vous visitez un site web. Les cookies permettent au site de memoriser vos preferences et d'ameliorer votre experience de navigation.",
    nl: "Een cookie is een klein tekstbestand dat op uw apparaat wordt opgeslagen wanneer u een website bezoekt. Cookies stellen de site in staat uw voorkeuren te onthouden en uw browse-ervaring te verbeteren.",
    de: "Ein Cookie ist eine kleine Textdatei, die auf Ihrem Gerat gespeichert wird, wenn Sie eine Website besuchen. Cookies ermoglichen es der Website, Ihre Praferenzen zu speichern und Ihr Surferlebnis zu verbessern.",
    it: "Un cookie e un piccolo file di testo memorizzato sul tuo dispositivo quando visiti un sito web. I cookie consentono al sito di memorizzare le tue preferenze e migliorare la tua esperienza di navigazione.",
    en: "A cookie is a small text file stored on your device when you visit a website. Cookies allow the site to remember your preferences and improve your browsing experience.",
  },
  "cookies.section2Title": {
    fr: "2. Types de cookies utilises",
    nl: "2. Soorten gebruikte cookies",
    de: "2. Arten der verwendeten Cookies",
    it: "2. Tipi di cookie utilizzati",
    en: "2. Types of cookies used",
  },
  "cookies.section2Content": {
    fr: "Nous utilisons les types de cookies suivants :",
    nl: "We gebruiken de volgende soorten cookies:",
    de: "Wir verwenden die folgenden Cookie-Arten:",
    it: "Utilizziamo i seguenti tipi di cookie:",
    en: "We use the following types of cookies:",
  },
  "cookies.essentialCookies": {
    fr: "Cookies essentiels",
    nl: "Essentiele cookies",
    de: "Wesentliche Cookies",
    it: "Cookie essenziali",
    en: "Essential cookies",
  },
  "cookies.essentialCookiesDesc": {
    fr: "Necessaires au fonctionnement du site (authentification, securite)",
    nl: "Noodzakelijk voor het functioneren van de site (authenticatie, beveiliging)",
    de: "Notwendig fur den Betrieb der Website (Authentifizierung, Sicherheit)",
    it: "Necessari per il funzionamento del sito (autenticazione, sicurezza)",
    en: "Necessary for site operation (authentication, security)",
  },
  "cookies.preferenceCookies": {
    fr: "Cookies de preferences",
    nl: "Voorkeurscookies",
    de: "Praferenz-Cookies",
    it: "Cookie di preferenza",
    en: "Preference cookies",
  },
  "cookies.preferenceCookiesDesc": {
    fr: "Memorisent vos preferences (langue, theme)",
    nl: "Onthouden uw voorkeuren (taal, thema)",
    de: "Speichern Ihre Praferenzen (Sprache, Design)",
    it: "Memorizzano le tue preferenze (lingua, tema)",
    en: "Remember your preferences (language, theme)",
  },
  "cookies.analyticsCookies": {
    fr: "Cookies analytiques",
    nl: "Analytische cookies",
    de: "Analyse-Cookies",
    it: "Cookie analitici",
    en: "Analytics cookies",
  },
  "cookies.analyticsCookiesDesc": {
    fr: "Nous aident a comprendre comment vous utilisez le site",
    nl: "Helpen ons te begrijpen hoe u de site gebruikt",
    de: "Helfen uns zu verstehen, wie Sie die Website nutzen",
    it: "Ci aiutano a capire come utilizzi il sito",
    en: "Help us understand how you use the site",
  },
  "cookies.section3Title": {
    fr: "3. Gestion des cookies",
    nl: "3. Cookiebeheer",
    de: "3. Cookie-Verwaltung",
    it: "3. Gestione dei cookie",
    en: "3. Cookie management",
  },
  "cookies.section3Content": {
    fr: "Vous pouvez gerer vos preferences de cookies a tout moment via les parametres de votre navigateur. Notez que la desactivation de certains cookies peut affecter le fonctionnement du site.",
    nl: "U kunt uw cookievoorkeuren op elk moment beheren via de instellingen van uw browser. Houd er rekening mee dat het uitschakelen van bepaalde cookies de werking van de site kan beinvloeden.",
    de: "Sie konnen Ihre Cookie-Praferenzen jederzeit uber die Einstellungen Ihres Browsers verwalten. Beachten Sie, dass das Deaktivieren bestimmter Cookies die Funktionalitat der Website beeintrachtigen kann.",
    it: "Puoi gestire le tue preferenze sui cookie in qualsiasi momento tramite le impostazioni del tuo browser. Nota che la disattivazione di alcuni cookie puo influire sul funzionamento del sito.",
    en: "You can manage your cookie preferences at any time through your browser settings. Note that disabling certain cookies may affect site functionality.",
  },
  "cookies.section4Title": {
    fr: "4. Contact",
    nl: "4. Contact",
    de: "4. Kontakt",
    it: "4. Contatto",
    en: "4. Contact",
  },
  "cookies.section4Content": {
    fr: "Pour toute question concernant notre utilisation des cookies, contactez-nous a : privacy@koupontrust.com",
    nl: "Voor vragen over ons gebruik van cookies kunt u contact met ons opnemen via: privacy@koupontrust.com",
    de: "Bei Fragen zur Verwendung von Cookies kontaktieren Sie uns unter: privacy@koupontrust.com",
    it: "Per qualsiasi domanda riguardante l'utilizzo dei cookie, contattaci a: privacy@koupontrust.com",
    en: "For any questions regarding our use of cookies, contact us at: privacy@koupontrust.com",
  },

  // Toast messages - Auth
  "toast.loginSuccess": {
    fr: "Connexion reussie",
    nl: "Succesvol ingelogd",
    de: "Erfolgreich angemeldet",
    it: "Accesso effettuato",
    en: "Login successful",
  },
  "toast.loginSuccessDesc": {
    fr: "Bienvenue sur Koupon Trust",
    nl: "Welkom bij Koupon Trust",
    de: "Willkommen bei Koupon Trust",
    it: "Benvenuto su Koupon Trust",
    en: "Welcome to Koupon Trust",
  },
  "toast.loginError": {
    fr: "Erreur de connexion",
    nl: "Inlogfout",
    de: "Anmeldefehler",
    it: "Errore di accesso",
    en: "Login error",
  },
  "toast.2faError": {
    fr: "Code invalide ou expire",
    nl: "Ongeldige of verlopen code",
    de: "Ungueltiger oder abgelaufener Code",
    it: "Codice non valido o scaduto",
    en: "Invalid or expired code",
  },
  "toast.registerSuccess": {
    fr: "Inscription reussie",
    nl: "Registratie geslaagd",
    de: "Registrierung erfolgreich",
    it: "Registrazione riuscita",
    en: "Registration successful",
  },
  "toast.registerSuccessDesc": {
    fr: "Veuillez verifier votre email pour activer votre compte.",
    nl: "Controleer uw e-mail om uw account te activeren.",
    de: "Bitte uberprufen Sie Ihre E-Mail, um Ihr Konto zu aktivieren.",
    it: "Controlla la tua email per attivare il tuo account.",
    en: "Please check your email to activate your account.",
  },
  "toast.registerError": {
    fr: "Erreur d'inscription",
    nl: "Registratiefout",
    de: "Registrierungsfehler",
    it: "Errore di registrazione",
    en: "Registration error",
  },
  "toast.passwordMismatch": {
    fr: "Les mots de passe ne correspondent pas",
    nl: "Wachtwoorden komen niet overeen",
    de: "Passworter stimmen nicht uberein",
    it: "Le password non corrispondono",
    en: "Passwords do not match",
  },
  "toast.emailConfirmation": {
    fr: "En vous inscrivant, vous recevrez un email de confirmation.",
    nl: "Na registratie ontvangt u een bevestigingsmail.",
    de: "Nach der Registrierung erhalten Sie eine Bestatigungsmail.",
    it: "Dopo la registrazione riceverai un'email di conferma.",
    en: "After registration, you will receive a confirmation email.",
  },

  // Verify email page
  "verifyEmail.loading": {
    fr: "Verification en cours...",
    nl: "Verificatie bezig...",
    de: "Verifizierung lauft...",
    it: "Verifica in corso...",
    en: "Verification in progress...",
  },
  "verifyEmail.pleaseWait": {
    fr: "Veuillez patienter",
    nl: "Even geduld",
    de: "Bitte warten",
    it: "Attendere prego",
    en: "Please wait",
  },
  "verifyEmail.success": {
    fr: "Email verifie",
    nl: "E-mail geverifieerd",
    de: "E-Mail verifiziert",
    it: "Email verificata",
    en: "Email verified",
  },
  "verifyEmail.error": {
    fr: "Erreur de verification",
    nl: "Verificatiefout",
    de: "Verifizierungsfehler",
    it: "Errore di verifica",
    en: "Verification error",
  },
  "verifyEmail.tokenMissing": {
    fr: "Token de verification manquant",
    nl: "Verificatietoken ontbreekt",
    de: "Verifizierungstoken fehlt",
    it: "Token di verifica mancante",
    en: "Verification token missing",
  },
  "verifyEmail.successMessage": {
    fr: "Email verifie avec succes. Vous allez etre connecte automatiquement.",
    nl: "E-mail succesvol geverifieerd. U wordt automatisch ingelogd.",
    de: "E-Mail erfolgreich verifiziert. Sie werden automatisch angemeldet.",
    it: "Email verificata con successo. Sarai connesso automaticamente.",
    en: "Email verified successfully. You will be logged in automatically.",
  },
  "verifyEmail.redirecting": {
    fr: "Redirection dans",
    nl: "Omleiding in",
    de: "Weiterleitung in",
    it: "Reindirizzamento in",
    en: "Redirecting in",
  },
  "verifyEmail.errorMessage": {
    fr: "Erreur lors de la verification",
    nl: "Fout bij verificatie",
    de: "Fehler bei der Verifizierung",
    it: "Errore durante la verifica",
    en: "Error during verification",
  },
  "verifyEmail.connectionError": {
    fr: "Erreur de connexion au serveur",
    nl: "Serverfout",
    de: "Serververbindungsfehler",
    it: "Errore di connessione al server",
    en: "Server connection error",
  },
  "verifyEmail.goToDashboard": {
    fr: "Acceder au tableau de bord",
    nl: "Naar dashboard",
    de: "Zum Dashboard",
    it: "Vai alla dashboard",
    en: "Go to Dashboard",
  },
  "verifyEmail.backToHome": {
    fr: "Retour a l'accueil",
    nl: "Terug naar home",
    de: "Zuruck zur Startseite",
    it: "Torna alla home",
    en: "Back to Home",
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function detectBrowserLanguage(): Language {
  if (typeof window === "undefined" || !navigator?.language) {
    return "fr";
  }
  
  const browserLang = navigator.language.toLowerCase();
  const supportedLanguages: Language[] = ["fr", "nl", "de", "it", "en"];
  
  for (const lang of supportedLanguages) {
    if (browserLang.startsWith(lang)) {
      return lang;
    }
  }
  
  const countryToLang: Record<string, Language> = {
    "be": "nl",
    "ch": "de",
    "at": "de",
    "lu": "fr",
  };
  
  const parts = browserLang.split("-");
  if (parts.length > 1) {
    const country = parts[1];
    if (countryToLang[country]) {
      return countryToLang[country];
    }
  }
  
  return "fr";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("koupon-language");
        if (saved && ["fr", "nl", "de", "it", "en"].includes(saved)) {
          return saved as Language;
        }
      } catch {
        // localStorage not available (e.g., in iframe with restricted permissions)
      }
      return detectBrowserLanguage();
    }
    return "fr";
  });

  useEffect(() => {
    // Try to detect language from IP on component mount
    const detectFromIP = async () => {
      try {
        const response = await fetch("/api/detect-language");
        if (response.ok) {
          const data = await response.json();
          const ipLanguage = data.language as Language;
          if (ipLanguage && ["fr", "nl", "de", "it", "en"].includes(ipLanguage)) {
            // Only update if no user preference is saved
            const saved = localStorage.getItem("koupon-language");
            if (!saved) {
              setLanguage(ipLanguage);
              return;
            }
          }
        }
      } catch {
        // If fetch fails, keep using detected browser language
      }
    };
    
    detectFromIP();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("koupon-language", language);
    } catch {
      // localStorage not available
    }
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
