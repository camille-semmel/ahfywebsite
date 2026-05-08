import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n/i18n';
import { useInstitutionSettings } from '@/hooks/useInstitutionSettings';
import { format } from 'date-fns';

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { data: institution, isLoading, isError } = useInstitutionSettings();

  const UNAVAILABLE = 'Unavailable';

  const institutionName = institution?.institution_name || UNAVAILABLE;
  const totalSeats = institution?.total_seats?.toString() || UNAVAILABLE;
  const contractEnd = institution?.contract_end_date
    ? format(new Date(institution.contract_end_date), 'MMMM dd, yyyy')
    : UNAVAILABLE;
  const subscriptionPlan = institution?.subscription_plan
    ? `${institution.subscription_plan}/student/year`
    : UNAVAILABLE;

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
          <h1 className="text-4xl font-bold text-primary">{t('profile_settings')}</h1>
        </div>

        {isError && (
          <p className="text-destructive">
            Error loading institution settings. Please try again later.
          </p>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t('university_name')}</CardTitle>
            <CardDescription>Your institution name</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 max-w-md" />
            ) : (
              <Input value={institutionName} disabled className="max-w-md" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('seats')}</CardTitle>
            <CardDescription>Number of student licenses</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 max-w-md" />
            ) : (
              <Input value={totalSeats} disabled className="max-w-md" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('contract_end')}</CardTitle>
            <CardDescription>Your subscription end date</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 max-w-md" />
            ) : (
              <Input value={contractEnd} disabled className="max-w-md" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>Your current pricing tier</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 max-w-md" />
            ) : (
              <Input value={subscriptionPlan} disabled className="max-w-md" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
