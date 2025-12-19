import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { LanguageSelector } from "@/components/language-selector";

export default function Cookies() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("cookies.title")}
            </h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">{t("cookies.title")}</h1>
          
          <p className="text-slate-600 mb-6">{t("cookies.lastUpdate")}</p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("cookies.section1Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("cookies.section1Content")}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("cookies.section2Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("cookies.section2Content")}
          </p>
          
          <h3 className="text-lg font-medium text-slate-800 mt-6 mb-3">{t("cookies.essentialCookies")}</h3>
          <p className="text-slate-600 mb-4">
            {t("cookies.essentialCookiesDesc")}
          </p>

          <h3 className="text-lg font-medium text-slate-800 mt-6 mb-3">{t("cookies.preferenceCookies")}</h3>
          <p className="text-slate-600 mb-4">
            {t("cookies.preferenceCookiesDesc")}
          </p>

          <h3 className="text-lg font-medium text-slate-800 mt-6 mb-3">{t("cookies.analyticsCookies")}</h3>
          <p className="text-slate-600 mb-4">
            {t("cookies.analyticsCookiesDesc")}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("cookies.section3Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("cookies.section3Content")}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("cookies.section4Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("cookies.section4Content")}
          </p>
        </div>
      </main>
    </div>
  );
}
