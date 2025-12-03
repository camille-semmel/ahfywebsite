import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { SubscriptionDialog } from '@/components/subscription/SubscriptionDialog';
import { useInstitutionSettings } from '@/hooks/useInstitutionSettings';

const Subscriptions = () => {
  const { data: institution, isLoading } = useInstitutionSettings();

  // Slider state (0-100)
  const [sliderValue, setSliderValue] = useState([90]);
  
  // Dialog states
  const [requestSeatsOpen, setRequestSeatsOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);

  // Dynamic pricing and feature based on slider position
  const getPriceAndFeature = (value: number) => {
    if (value <= 25) {
      return { price: 49, feature: '20K Students +' };
    } else if (value <= 50) {
      return { price: 59, feature: '10K–20K Students' };
    } else if (value <= 75) {
      return { price: 69, feature: '5K–10K Students' };
    } else {
      return { price: 79, feature: 'Less than 5K Students' };
    }
  };

  const { price, feature } = getPriceAndFeature(sliderValue[0]);

  // Static features list (excluding the dynamic first one)
  const staticFeatures = [
    'Emotional Identification Tool',
    'Emotional Regulation Tool',
    'Resources',
    'Crisis Meditation',
    'Therapist Approved Exercises',
    'Mindful Exercises',
    'AI Chatbot',
    'Monthly Analysis',
    'Programs',
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <h1 className="text-2xl md:text-4xl font-bold text-primary">
            Your Subscription
          </h1>

          {/* Seats and Expiry Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left side - Seats */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current seats</p>
                    {isLoading ? (
                      <Skeleton className="h-10 w-40" />
                    ) : (
                      <p className="text-3xl font-bold text-foreground">
                        {institution?.total_seats?.toLocaleString()} seats
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => setRequestSeatsOpen(true)}
                    variant="default"
                    aria-label="Request more seats"
                  >
                    Request More Seats
                  </Button>
                </div>

                {/* Right side - Expiry */}
                <div className="space-y-3 md:text-right">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Subscription period</p>
                    {isLoading ? (
                      <Skeleton className="h-7 w-48 ml-auto" />
                    ) : (
                      <p className="text-lg font-semibold text-foreground">
                        Expiring on {institution?.contract_end_date ? format(new Date(institution.contract_end_date), 'dd/MM/yyyy') : 'N/A'}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => setExtendOpen(true)}
                    variant="outline"
                    aria-label="Extend subscription"
                  >
                    Extend
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Slider Section */}
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-semibold text-foreground">Pricing</h2>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    ${price}
                  </p>
                  <p className="text-sm text-muted-foreground">/student/year</p>
                </div>
              </div>

              {/* Slider */}
              <div className="py-4">
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                  aria-label="Pricing slider"
                  aria-valuetext={`$${price} per student per year`}
                />
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-lg font-semibold text-foreground mb-4">Features</h3>
              <div className="space-y-3">
                {/* Dynamic first feature */}
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground font-medium">{feature}</span>
                </div>

                {/* Static features */}
                {staticFeatures.map((featureName) => (
                  <div key={featureName} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{featureName}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <SubscriptionDialog
        open={requestSeatsOpen}
        onOpenChange={setRequestSeatsOpen}
        title="Request More Seats"
        description="Fill out the form below and we'll get back to you with options to expand your seat capacity."
        formType="request_seats"
      />

      <SubscriptionDialog
        open={extendOpen}
        onOpenChange={setExtendOpen}
        title="Extend Subscription"
        description="Let us know your extension requirements and we'll assist you with renewal options."
        formType="extend_subscription"
      />
    </div>
  );
};

export default Subscriptions;
