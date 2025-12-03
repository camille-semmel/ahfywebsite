import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n/i18n';
import { Language as LanguageType } from '@/lib/i18n/translations';

const Language = () => {
  const navigate = useNavigate();
  const { t, lang, setLang } = useI18n();

  const languages: { value: LanguageType; label: string }[] = [
    { value: 'en', label: t('english') },
    { value: 'fr', label: t('french') },
    { value: 'de', label: t('german') },
    { value: 'ru', label: t('russian') },
  ];

  const handleLanguageChange = (value: string) => {
    setLang(value as LanguageType);
    toast({
      title: t('language_saved'),
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-bold text-primary">{t('language')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('select_language')}</CardTitle>
            <CardDescription>
              Choose your preferred language for the interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={lang} onValueChange={handleLanguageChange}>
              <div className="space-y-4">
                {languages.map((language) => (
                  <div
                    key={language.value}
                    className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => handleLanguageChange(language.value)}
                  >
                    <RadioGroupItem value={language.value} id={language.value} />
                    <Label
                      htmlFor={language.value}
                      className="flex-1 cursor-pointer text-base"
                    >
                      {language.label}
                    </Label>
                    {lang === language.value && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Language;
