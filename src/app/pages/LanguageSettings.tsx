import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Globe, Check } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧", enabled: true },
  { code: "hi", name: "Hindi", flag: "🇮🇳", enabled: true },
  { code: "ml", name: "Malayalam", flag: "🇮🇳", enabled: false },
  { code: "ar", name: "Arabic", flag: "🇸🇦", enabled: false },
];

const sampleTranslations = {
  en: {
    dishName: "Chicken Biryani",
    description: "Aromatic basmati rice with tender chicken pieces",
    category: "Main Course",
  },
  hi: {
    dishName: "चिकन बिरयानी",
    description: "कोमल चिकन के टुकड़ों के साथ सुगंधित बासमती चावल",
    category: "मुख्य व्यंजन",
  },
  ml: {
    dishName: "ചിക്കൻ ബിരിയാണി",
    description: "മൃദുവായ ചിക്കൻ കഷണങ്ങളോടുകൂടിയ സുഗന്ധമുള്ള ബാസ്മതി അരി",
    category: "പ്രധാന വിഭവം",
  },
  ar: {
    dishName: "برياني دجاج",
    description: "أرز بسمتي عطري مع قطع دجاج طرية",
    category: "الطبق الرئيسي",
  },
};

export function LanguageSettings() {
  const [enabledLanguages, setEnabledLanguages] = useState(
    languages.filter((lang) => lang.enabled).map((lang) => lang.code)
  );

  const toggleLanguage = (code: string) => {
    if (enabledLanguages.includes(code)) {
      setEnabledLanguages(enabledLanguages.filter((lang) => lang !== code));
    } else {
      setEnabledLanguages([...enabledLanguages, code]);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Language Settings</h1>
        <p className="text-gray-500 mt-1">Manage menu translations for different languages</p>
      </div>

      {/* Language Selection */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Available Languages</CardTitle>
          <p className="text-sm text-gray-500">Enable languages for your menu</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {languages.map((language) => {
              const isEnabled = enabledLanguages.includes(language.code);
              return (
                <Card
                  key={language.code}
                  className={`cursor-pointer transition-all ${
                    isEnabled
                      ? "border-2 border-[#1E88E5] bg-blue-50"
                      : "border border-gray-200 hover:shadow-md"
                  }`}
                  onClick={() => toggleLanguage(language.code)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{language.flag}</span>
                        <div>
                          <p className="font-semibold">{language.name}</p>
                          <p className="text-xs text-gray-500">{language.code.toUpperCase()}</p>
                        </div>
                      </div>
                      {isEnabled && (
                        <div className="w-8 h-8 rounded-full bg-[#1E88E5] flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Translation Editor */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Translation Editor</CardTitle>
              <p className="text-sm text-gray-500">Translate menu items to different languages</p>
            </div>
            <Badge className="bg-[#00C853] flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {enabledLanguages.length} Languages Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {languages.map((lang) => (
                <TabsTrigger
                  key={lang.code}
                  value={lang.code}
                  disabled={!enabledLanguages.includes(lang.code)}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {languages.map((lang) => (
              <TabsContent key={lang.code} value={lang.code} className="space-y-4 pt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Sample Menu Item - {lang.name}
                  </p>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`dishName-${lang.code}`}>Dish Name</Label>
                      <Input
                        id={`dishName-${lang.code}`}
                        defaultValue={sampleTranslations[lang.code as keyof typeof sampleTranslations].dishName}
                        className="mt-1 bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`description-${lang.code}`}>Description</Label>
                      <Input
                        id={`description-${lang.code}`}
                        defaultValue={sampleTranslations[lang.code as keyof typeof sampleTranslations].description}
                        className="mt-1 bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`category-${lang.code}`}>Category</Label>
                      <Input
                        id={`category-${lang.code}`}
                        defaultValue={sampleTranslations[lang.code as keyof typeof sampleTranslations].category}
                        className="mt-1 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="bg-[#1E88E5] hover:bg-[#1976D2]">
                    Save {lang.name} Translation
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Auto-Translation */}
      <Card className="bg-white shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Auto-Translation</CardTitle>
          <p className="text-sm text-gray-500">Automatically translate your menu items</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Pro Tip:</strong> Use our AI-powered translation service to automatically translate your entire menu. Review and edit translations for accuracy.
            </p>
          </div>
          <Button className="bg-[#00C853] hover:bg-[#00B248]">
            <Globe className="w-4 h-4 mr-2" />
            Auto-Translate All Items
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
