import { Resend } from 'resend';
import type { Verification } from "@shared/schema";

const SENDER_EMAIL = process.env.SENDER_EMAIL || "noreply@koupontrust.com";
const SENDER_NAME = process.env.SENDER_NAME || "KouponTrust";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

interface EmailParams {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
}

async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.log("[EMAIL] Resend API key not configured, skipping email:", params.subject);
    return false;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: [params.to],
      subject: params.subject,
      html: params.htmlContent,
    });

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

export async function sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
  // Use FRONTEND_URL env var, fallback to koupontrust.com in production, localhost in development
  const frontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === "production" ? "https://koupontrust.com" : "http://localhost:5000");
  const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;
  
  return sendEmail({
    to: email,
    toName: name,
    subject: "Confirmez votre inscription - KouponTrust",
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0f; color: #ffffff; margin: 0; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1)); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 16px; padding: 40px; }
          .logo { font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 30px; }
          h1 { color: #ffffff; font-size: 24px; margin-bottom: 20px; }
          p { color: #a0a0a0; line-height: 1.6; margin-bottom: 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #06b6d4); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">KouponTrust</div>
          <h1>Bienvenue, ${name} !</h1>
          <p>Merci de vous être inscrit sur KouponTrust. Pour activer votre compte et accéder à toutes les fonctionnalités, veuillez confirmer votre adresse email.</p>
          <a href="${verifyUrl}" class="button">Confirmer mon email</a>
          <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
          <p style="word-break: break-all; color: #8b5cf6;">${verifyUrl}</p>
          <div class="footer">
            <p>Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, ignorez cet email.</p>
            <p>KouponTrust - Vérification sécurisée de coupons prépayés</p>
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

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Nouvelle demande de vérification - ${verification.couponType}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0f; color: #ffffff; margin: 0; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1)); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 16px; padding: 40px; }
          .logo { font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 30px; }
          h1 { color: #ffffff; font-size: 24px; margin-bottom: 20px; }
          .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .label { color: #a0a0a0; width: 140px; }
          .value { color: #ffffff; font-weight: 500; }
          .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .badge-guest { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
          .badge-user { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
          .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6, #06b6d4); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
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
          <a href="${process.env.FRONTEND_URL || (process.env.NODE_ENV === "production" ? "https://koupontrust.com" : "http://localhost:5000")}/admin" class="button">Voir dans l'admin</a>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendStatusUpdateEmail(verification: Verification): Promise<boolean> {
  const statusLabels: Record<string, { label: string; color: string; message: string }> = {
    valid: {
      label: "Valide",
      color: "#22c55e",
      message: "Bonne nouvelle ! Votre code coupon a été vérifié et est valide. Vous pouvez l'utiliser en toute confiance.",
    },
    invalid: {
      label: "Invalide",
      color: "#ef4444",
      message: "Nous avons vérifié votre code coupon et malheureusement, il n'est pas valide. Veuillez vérifier le code et réessayer, ou contactez notre support.",
    },
    already_used: {
      label: "Déjà utilisé",
      color: "#f59e0b",
      message: "Votre code coupon a déjà été utilisé. Si vous pensez qu'il s'agit d'une erreur, veuillez contacter notre support.",
    },
  };

  const statusInfo = statusLabels[verification.status] || { label: "En attente", color: "#8b5cf6", message: "" };

  return sendEmail({
    to: verification.email,
    toName: `${verification.firstName} ${verification.lastName}`,
    subject: `Résultat de votre vérification - ${statusInfo.label}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a0f; color: #ffffff; margin: 0; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1)); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 16px; padding: 40px; }
          .logo { font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 30px; }
          h1 { color: #ffffff; font-size: 24px; margin-bottom: 20px; }
          p { color: #a0a0a0; line-height: 1.6; margin-bottom: 20px; }
          .status-badge { display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: 600; background: ${statusInfo.color}20; color: ${statusInfo.color}; margin-bottom: 20px; }
          .info-box { background: rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin: 20px 0; }
          .info-row { display: flex; padding: 8px 0; }
          .label { color: #a0a0a0; width: 120px; }
          .value { color: #ffffff; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">KouponTrust</div>
          <h1>Résultat de votre vérification</h1>
          <span class="status-badge">${statusInfo.label}</span>
          <p>${statusInfo.message}</p>
          <div class="info-box">
            <div class="info-row"><span class="label">Type</span><span class="value">${verification.couponType}</span></div>
            <div class="info-row"><span class="label">Montant</span><span class="value">${verification.amount} EUR</span></div>
            <div class="info-row"><span class="label">Code</span><span class="value">${verification.couponCode.substring(0, 4)}****</span></div>
          </div>
          <div class="footer">
            <p>Merci d'avoir utilisé KouponTrust pour sécuriser vos transactions.</p>
            <p>KouponTrust - Vérification sécurisée de coupons prépayés</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
