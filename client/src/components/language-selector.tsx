import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n, languageNames, type Language } from "@/lib/i18n";

const languageFlags: Record<Language, string> = {
  fr: "🇫🇷",
  nl: "🇳🇱",
  de: "🇩🇪",
  it: "🇮🇹",
  en: "🇬🇧",
};

export function LanguageSelector() {
  const { language, setLanguage } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" data-testid="button-language-selector">
          <span className="text-base">{languageFlags[language]}</span>
          <span className="hidden sm:inline text-sm">{language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(languageNames) as Language[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            data-testid={`menu-item-lang-${lang}`}
          >
            <span className="text-base mr-2">{languageFlags[lang]}</span>
            <span className="font-medium mr-2">{lang.toUpperCase()}</span>
            <span className="text-muted-foreground">{languageNames[lang]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
