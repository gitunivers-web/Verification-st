import { Resend } from 'resend';
import type { Verification } from "@shared/schema";

const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@koupontrust.com";
const SENDER_NAME = process.env.SENDER_NAME || "KouponTrust";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

type Language = "fr" | "nl" | "de" | "it" | "en";

const emailTranslations = {
  verification: {
    subject: {
      fr: "Confirmez votre inscription - KouponTrust",
      nl: "Bevestig uw registratie - KouponTrust",
      de: "Bestätigen Sie Ihre Registrierung - KouponTrust",
      it: "Conferma la tua registrazione - KouponTrust",
      en: "Confirm your registration - KouponTrust",
    },
    welcome: {
      fr: "Bienvenue",
      nl: "Welkom",
      de: "Willkommen",
      it: "Benvenuto",
      en: "Welcome",
    },
    body: {
      fr: "Merci de vous être inscrit sur KouponTrust. Pour activer votre compte et accéder à toutes les fonctionnalités, veuillez confirmer votre adresse email.",
      nl: "Bedankt voor uw registratie bij KouponTrust. Om uw account te activeren en toegang te krijgen tot alle functies, bevestig alstublieft uw e-mailadres.",
      de: "Vielen Dank für Ihre Registrierung bei KouponTrust. Um Ihr Konto zu aktivieren und auf alle Funktionen zuzugreifen, bestätigen Sie bitte Ihre E-Mail-Adresse.",
      it: "Grazie per esserti registrato su KouponTrust. Per attivare il tuo account e accedere a tutte le funzionalità, conferma il tuo indirizzo email.",
      en: "Thank you for registering at KouponTrust. To activate your account and access all features, please confirm your email address.",
    },
    button: {
      fr: "Confirmer mon email",
      nl: "Bevestig mijn email",
      de: "Meine E-Mail bestätigen",
      it: "Conferma la mia email",
      en: "Confirm my email",
    },
    linkFallback: {
      fr: "Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :",
      nl: "Als de knop niet werkt, kopieer dan deze link in uw browser:",
      de: "Wenn die Schaltfläche nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:",
      it: "Se il pulsante non funziona, copia questo link nel tuo browser:",
      en: "If the button doesn't work, copy this link in your browser:",
    },
    footer1: {
      fr: "Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, ignorez cet email.",
      nl: "Deze link verloopt over 24 uur. Als u geen account heeft aangemaakt, negeer dan deze email.",
      de: "Dieser Link läuft in 24 Stunden ab. Wenn Sie kein Konto erstellt haben, ignorieren Sie diese E-Mail.",
      it: "Questo link scade tra 24 ore. Se non hai creato un account, ignora questa email.",
      en: "This link expires in 24 hours. If you didn't create an account, please ignore this email.",
    },
    footer2: {
      fr: "KouponTrust - Vérification sécurisée de coupons prépayés",
      nl: "KouponTrust - Veilige verificatie van prepaid coupons",
      de: "KouponTrust - Sichere Verifizierung von Prepaid-Gutscheinen",
      it: "KouponTrust - Verifica sicura di coupon prepagati",
      en: "KouponTrust - Secure verification of prepaid coupons",
    },
  },
  passwordReset: {
    subject: {
      fr: "Réinitialisation de votre mot de passe - KouponTrust",
      nl: "Wachtwoord resetten - KouponTrust",
      de: "Passwort zurücksetzen - KouponTrust",
      it: "Reimposta la tua password - KouponTrust",
      en: "Password reset - KouponTrust",
    },
    title: {
      fr: "Réinitialisation de mot de passe",
      nl: "Wachtwoord resetten",
      de: "Passwort zurücksetzen",
      it: "Reimposta password",
      en: "Password reset",
    },
    greeting: {
      fr: "Bonjour",
      nl: "Hallo",
      de: "Hallo",
      it: "Ciao",
      en: "Hello",
    },
    body: {
      fr: "Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.",
      nl: "U heeft gevraagd om uw wachtwoord te resetten. Klik op de onderstaande knop om een nieuw wachtwoord aan te maken.",
      de: "Sie haben das Zurücksetzen Ihres Passworts angefordert. Klicken Sie auf die Schaltfläche unten, um ein neues Passwort zu erstellen.",
      it: "Hai richiesto il reset della tua password. Clicca sul pulsante qui sotto per creare una nuova password.",
      en: "You have requested to reset your password. Click the button below to create a new password.",
    },
    button: {
      fr: "Réinitialiser mon mot de passe",
      nl: "Mijn wachtwoord resetten",
      de: "Mein Passwort zurücksetzen",
      it: "Reimposta la mia password",
      en: "Reset my password",
    },
    linkFallback: {
      fr: "Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :",
      nl: "Als de knop niet werkt, kopieer dan deze link in uw browser:",
      de: "Wenn die Schaltfläche nicht funktioniert, kopieren Sie diesen Link in Ihren Browser:",
      it: "Se il pulsante non funziona, copia questo link nel tuo browser:",
      en: "If the button doesn't work, copy this link in your browser:",
    },
    warning: {
      fr: "Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.",
      nl: "Als u deze reset niet heeft aangevraagd, negeer dan deze email. Uw wachtwoord blijft ongewijzigd.",
      de: "Wenn Sie dieses Zurücksetzen nicht angefordert haben, ignorieren Sie diese E-Mail. Ihr Passwort bleibt unverändert.",
      it: "Se non hai richiesto questo reset, ignora questa email. La tua password rimarrà invariata.",
      en: "If you didn't request this reset, please ignore this email. Your password will remain unchanged.",
    },
    footer1: {
      fr: "Ce lien expire dans 1 heure pour des raisons de sécurité.",
      nl: "Deze link verloopt over 1 uur om veiligheidsredenen.",
      de: "Dieser Link läuft aus Sicherheitsgründen in 1 Stunde ab.",
      it: "Questo link scade tra 1 ora per motivi di sicurezza.",
      en: "This link expires in 1 hour for security reasons.",
    },
    footer2: {
      fr: "KouponTrust - Vérification sécurisée de coupons prépayés",
      nl: "KouponTrust - Veilige verificatie van prepaid coupons",
      de: "KouponTrust - Sichere Verifizierung von Prepaid-Gutscheinen",
      it: "KouponTrust - Verifica sicura di coupon prepagati",
      en: "KouponTrust - Secure verification of prepaid coupons",
    },
  },
  statusUpdate: {
    subject: {
      fr: "Résultat de votre vérification",
      nl: "Resultaat van uw verificatie",
      de: "Ergebnis Ihrer Verifizierung",
      it: "Risultato della tua verifica",
      en: "Your verification result",
    },
    title: {
      fr: "Résultat de votre vérification",
      nl: "Resultaat van uw verificatie",
      de: "Ergebnis Ihrer Verifizierung",
      it: "Risultato della tua verifica",
      en: "Your verification result",
    },
    type: {
      fr: "Type",
      nl: "Type",
      de: "Typ",
      it: "Tipo",
      en: "Type",
    },
    amount: {
      fr: "Montant",
      nl: "Bedrag",
      de: "Betrag",
      it: "Importo",
      en: "Amount",
    },
    code: {
      fr: "Code",
      nl: "Code",
      de: "Code",
      it: "Codice",
      en: "Code",
    },
    footer1: {
      fr: "Merci d'avoir utilisé KouponTrust pour sécuriser vos transactions.",
      nl: "Bedankt voor het gebruik van KouponTrust om uw transacties te beveiligen.",
      de: "Vielen Dank, dass Sie KouponTrust verwenden, um Ihre Transaktionen zu sichern.",
      it: "Grazie per aver utilizzato KouponTrust per proteggere le tue transazioni.",
      en: "Thank you for using KouponTrust to secure your transactions.",
    },
    footer2: {
      fr: "KouponTrust - Vérification sécurisée de coupons prépayés",
      nl: "KouponTrust - Veilige verificatie van prepaid coupons",
      de: "KouponTrust - Sichere Verifizierung von Prepaid-Gutscheinen",
      it: "KouponTrust - Verifica sicura di coupon prepagati",
      en: "KouponTrust - Secure verification of prepaid coupons",
    },
    status: {
      valid: {
        label: {
          fr: "Valide",
          nl: "Geldig",
          de: "Gültig",
          it: "Valido",
          en: "Valid",
        },
        message: {
          fr: "Bonne nouvelle ! Votre code coupon a été vérifié et est valide. Vous pouvez l'utiliser en toute confiance.",
          nl: "Goed nieuws! Uw couponcode is geverifieerd en is geldig. U kunt deze met vertrouwen gebruiken.",
          de: "Gute Nachrichten! Ihr Gutscheincode wurde überprüft und ist gültig. Sie können ihn bedenkenlos verwenden.",
          it: "Buone notizie! Il tuo codice coupon è stato verificato ed è valido. Puoi usarlo con fiducia.",
          en: "Good news! Your coupon code has been verified and is valid. You can use it with confidence.",
        },
      },
      invalid: {
        label: {
          fr: "Invalide",
          nl: "Ongeldig",
          de: "Ungültig",
          it: "Non valido",
          en: "Invalid",
        },
        message: {
          fr: "Nous avons vérifié votre code coupon et malheureusement, il n'est pas valide. Veuillez vérifier le code et réessayer, ou contactez notre support.",
          nl: "We hebben uw couponcode geverifieerd en helaas is deze niet geldig. Controleer de code en probeer het opnieuw, of neem contact op met onze support.",
          de: "Wir haben Ihren Gutscheincode überprüft und leider ist er nicht gültig. Bitte überprüfen Sie den Code und versuchen Sie es erneut, oder kontaktieren Sie unseren Support.",
          it: "Abbiamo verificato il tuo codice coupon e purtroppo non è valido. Verifica il codice e riprova, o contatta il nostro supporto.",
          en: "We have verified your coupon code and unfortunately it is not valid. Please check the code and try again, or contact our support.",
        },
      },
      already_used: {
        label: {
          fr: "Déjà utilisé",
          nl: "Reeds gebruikt",
          de: "Bereits verwendet",
          it: "Già utilizzato",
          en: "Already used",
        },
        message: {
          fr: "Votre code coupon a déjà été utilisé. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter notre support.",
          nl: "Uw couponcode is al gebruikt. Als u denkt dat dit een fout is, neem dan contact op met onze support.",
          de: "Ihr Gutscheincode wurde bereits verwendet. Wenn Sie glauben, dass es sich um einen Fehler handelt, kontaktieren Sie bitte unseren Support.",
          it: "Il tuo codice coupon è già stato utilizzato. Se pensi che sia un errore, contatta il nostro supporto.",
          en: "Your coupon code has already been used. If you think this is an error, please contact our support.",
        },
      },
      pending: {
        label: {
          fr: "En attente",
          nl: "In afwachting",
          de: "Ausstehend",
          it: "In attesa",
          en: "Pending",
        },
        message: {
          fr: "Votre vérification est en cours de traitement.",
          nl: "Uw verificatie wordt verwerkt.",
          de: "Ihre Verifizierung wird bearbeitet.",
          it: "La tua verifica è in elaborazione.",
          en: "Your verification is being processed.",
        },
      },
    },
  },
};

interface EmailParams {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  attachments?: Array<{ filename: string; content: Buffer | string }>;
}

async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.log("[EMAIL] Resend API key not configured, skipping email:", params.subject);
    return false;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const emailConfig: any = {
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: [params.to],
      subject: params.subject,
      html: params.htmlContent,
    };

    // Add attachments if provided
    if (params.attachments && params.attachments.length > 0) {
      emailConfig.attachments = params.attachments;
    }

    const { data, error } = await resend.emails.send(emailConfig);

    if (error) {
      console.error("[EMAIL] Failed to send email:", error);
      return false;
    }

    console.log("[EMAIL] Email sent successfully to:", params.to, "ID:", data?.id);
    return true;
  } catch (error) {
    console.error("[EMAIL] Error sending email:", error);
    return false;
  }
}

const emailBaseStyles = `
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0f; color: #ffffff; margin: 0; padding: 40px; }
  .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1)); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 16px; padding: 40px; }
  .logo { font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 30px; }
  h1 { color: #ffffff; font-size: 24px; margin-bottom: 20px; }
  p { color: #a0a0a0; line-height: 1.6; margin-bottom: 20px; }
  .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #06b6d4); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #666; font-size: 12px; }
  .warning { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 15px; margin: 20px 0; }
  .warning p { color: #ef4444; margin: 0; }
  .info-box { background: rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin: 20px 0; }
  .info-row { display: flex; padding: 8px 0; }
  .label { color: #a0a0a0; width: 120px; }
  .value { color: #ffffff; }
`;

export async function sendVerificationEmail(email: string, name: string, token: string, language: Language = "fr"): Promise<boolean> {
  const frontendUrl = process.env.FRONTEND_URL || 
    (process.env.NODE_ENV === "production" ? "https://koupontrust.com" : 
    (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:5000"));
  const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;
  const t = emailTranslations.verification;
  
  return sendEmail({
    to: email,
    toName: name,
    subject: t.subject[language],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${emailBaseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">KouponTrust</div>
          <h1>${t.welcome[language]}, ${name} !</h1>
          <p>${t.body[language]}</p>
          <a href="${verifyUrl}" class="button">${t.button[language]}</a>
          <p>${t.linkFallback[language]}</p>
          <p style="word-break: break-all; color: #8b5cf6;">${verifyUrl}</p>
          <div class="footer">
            <p>${t.footer1[language]}</p>
            <p>${t.footer2[language]}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendAdminNotification(verification: Verification): Promise<boolean> {
  if (!ADMIN_EMAIL) {
    console.log("[EMAIL] Admin email not configured, skipping notification");
    return false;
  }

  const userStatus = verification.isRegisteredUser ? "Inscrit" : "Invité";

  // Prepare attachments if coupon image exists
  const attachments: Array<{ filename: string; content: Buffer | string }> = [];
  if (verification.couponImage) {
    try {
      // Extract base64 data from data URL
      const base64Data = verification.couponImage.replace(/^data:image\/[a-z]+;base64,/, "");
      attachments.push({
        filename: `coupon-${verification.couponCode}.png`,
        content: Buffer.from(base64Data, "base64"),
      });
    } catch (error) {
      console.error("[EMAIL] Failed to process coupon image for admin:", error);
    }
  }

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Nouvelle demande de vérification - ${verification.couponType}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          ${emailBaseStyles}
          .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .label { color: #a0a0a0; width: 140px; }
          .value { color: #ffffff; font-weight: 500; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .badge-guest { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
          .badge-user { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">KouponTrust Admin</div>
          <h1>Nouvelle demande de vérification</h1>
          <div class="info-row"><span class="label">Prénom</span><span class="value">${verification.firstName}</span></div>
          <div class="info-row"><span class="label">Nom</span><span class="value">${verification.lastName}</span></div>
          <div class="info-row"><span class="label">Email</span><span class="value">${verification.email}</span></div>
          <div class="info-row"><span class="label">Type de coupon</span><span class="value">${verification.couponType}</span></div>
          <div class="info-row"><span class="label">Montant</span><span class="value">${verification.amount} EUR</span></div>
          <div class="info-row"><span class="label">Code coupon</span><span class="value">${verification.couponCode}</span></div>
          <div class="info-row"><span class="label">Statut</span><span class="value"><span class="badge ${verification.isRegisteredUser ? 'badge-user' : 'badge-guest'}">${userStatus}</span></span></div>
          <a href="${process.env.FRONTEND_URL || (process.env.NODE_ENV === "production" ? "https://koupontrust.com" : (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:5000"))}/admin" class="button">Voir dans l'admin</a>
        </div>
      </body>
      </html>
    `,
    attachments: attachments.length > 0 ? attachments : undefined,
  });
}

export async function sendPasswordResetEmail(email: string, name: string, token: string, language: Language = "fr"): Promise<boolean> {
  const frontendUrl = process.env.FRONTEND_URL || 
    (process.env.NODE_ENV === "production" ? "https://koupontrust.com" : 
    (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:5000"));
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
  const t = emailTranslations.passwordReset;
  
  return sendEmail({
    to: email,
    toName: name,
    subject: t.subject[language],
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${emailBaseStyles}</style>
      </head>
      <body>
        <div class="container">
          <div class="logo">KouponTrust</div>
          <h1>${t.title[language]}</h1>
          <p>${t.greeting[language]} ${name},</p>
          <p>${t.body[language]}</p>
          <a href="${resetUrl}" class="button">${t.button[language]}</a>
          <p>${t.linkFallback[language]}</p>
          <p style="word-break: break-all; color: #8b5cf6;">${resetUrl}</p>
          <div class="warning">
            <p>${t.warning[language]}</p>
          </div>
          <div class="footer">
            <p>${t.footer1[language]}</p>
            <p>${t.footer2[language]}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendStatusUpdateEmail(verification: Verification, language: Language = "fr"): Promise<boolean> {
  const t = emailTranslations.statusUpdate;
  const statusKey = verification.status as keyof typeof t.status;
  const statusInfo = t.status[statusKey] || t.status.pending;
  const statusColors: Record<string, string> = {
    valid: "#22c55e",
    invalid: "#ef4444",
    already_used: "#f59e0b",
    pending: "#8b5cf6",
  };
  const statusColor = statusColors[verification.status] || statusColors.pending;

  // Prepare attachments if coupon image exists
  const attachments: Array<{ filename: string; content: Buffer | string }> = [];
  if (verification.couponImage) {
    try {
      // Extract base64 data from data URL
      const base64Data = verification.couponImage.replace(/^data:image\/[a-z]+;base64,/, "");
      attachments.push({
        filename: `coupon-${verification.couponCode}.png`,
        content: Buffer.from(base64Data, "base64"),
      });
    } catch (error) {
      console.error("[EMAIL] Failed to process coupon image:", error);
    }
  }

  return sendEmail({
    to: verification.email,
    toName: `${verification.firstName} ${verification.lastName}`,
    subject: `${t.subject[language]} - ${statusInfo.label[language]}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          ${emailBaseStyles}
          .status-badge { display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: 600; background: ${statusColor}20; color: ${statusColor}; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">KouponTrust</div>
          <h1>${t.title[language]}</h1>
          <span class="status-badge">${statusInfo.label[language]}</span>
          <p>${statusInfo.message[language]}</p>
          <div class="info-box">
            <div class="info-row"><span class="label">${t.type[language]}</span><span class="value">${verification.couponType}</span></div>
            <div class="info-row"><span class="label">${t.amount[language]}</span><span class="value">${verification.amount} EUR</span></div>
            <div class="info-row"><span class="label">${t.code[language]}</span><span class="value">${verification.couponCode.substring(0, 4)}****</span></div>
          </div>
          <div class="footer">
            <p>${t.footer1[language]}</p>
            <p>${t.footer2[language]}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: attachments.length > 0 ? attachments : undefined,
  });
}
