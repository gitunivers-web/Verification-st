import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";
import { LanguageSelector } from "@/components/language-selector";

export default function Terms() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  const section3List = t("terms.section3List").split("|");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/")} data-testid="button-back-home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("terms.title")}
            </h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">{t("terms.generalConditions")}</h1>
          
          <p className="text-slate-600 mb-6">{t("terms.lastUpdate")}</p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("terms.section1Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("terms.section1Content")}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("terms.section2Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("terms.section2Content")}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("terms.section3Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("terms.section3Content")}
          </p>
          <ul className="list-disc pl-6 text-slate-600 mb-4">
            {section3List.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("terms.section4Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("terms.section4Content")}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("terms.section5Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("terms.section5Content")}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("terms.section6Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("terms.section6Content")}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">{t("terms.section7Title")}</h2>
          <p className="text-slate-600 mb-4">
            {t("terms.section7Content")}
          </p>
        </div>
      </main>
    </div>
  );
}
