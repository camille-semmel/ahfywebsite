import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Languages, User, BookOpen, LogOut } from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const SettingsIndex = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const settingsCards = [
    {
      id: 'security',
      icon: Shield,
      title: t('security_privacy'),
      path: '/settings/security',
    },
    {
      id: 'language',
      icon: Languages,
      title: t('language'),
      path: '/settings/language',
    },
    {
      id: 'profile',
      icon: User,
      title: t('profile_settings'),
      path: '/settings/profile',
    },
    {
      id: 'onboarding',
      icon: BookOpen,
      title: t('onboarding'),
      path: '/settings/onboarding',
    },
  ];

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary">{t('settings')}</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(card.path)}
              >
                <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                  <Icon className="w-12 h-12 text-primary" />
                  <h3 className="text-xl font-semibold text-center text-foreground">
                    {card.title}
                  </h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SettingsIndex;
