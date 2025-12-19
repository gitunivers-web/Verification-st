import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { LanguageSelector } from "@/components/language-selector";

export default function Privacy() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  const section1List = t("privacy.section1List").split("|");
  const section2List = t("privacy.section2List").split("|");
  const section5List = t("privacy.section5List").split("|");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("privacy.title")}
            </h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">{t("privacy.title")}</h1>
          
          <p className="text-slate-600 mb-6">{t("privacy.lastUpdate")}</p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("privacy.section1Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("privacy.section1Content")}
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            {section1List.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("privacy.section2Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("privacy.section2Content")}
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            {section2List.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("privacy.section3Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("privacy.section3Content")}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("privacy.section4Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("privacy.section4Content")}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("privacy.section5Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("privacy.section5Content")}
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            {section5List.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("privacy.section6Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("privacy.section6Content")}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("privacy.section7Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("privacy.section7Content")}
          </p>
        </div>
      </main>
    </div>
  );
}
