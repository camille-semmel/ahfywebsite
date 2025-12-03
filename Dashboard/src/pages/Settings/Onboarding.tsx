import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Stethoscope,
  Activity,
  TrendingUp,
  Heart,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/lib/i18n/i18n';

const Onboarding = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-bold text-primary">{t('onboarding')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              {t('onboarding_intro')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="getting-started" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="getting-started">{t('getting_started')}</TabsTrigger>
                <TabsTrigger value="dashboard">{t('dashboard_deep_dive')}</TabsTrigger>
                <TabsTrigger value="students">{t('students_management')}</TabsTrigger>
                <TabsTrigger value="team">{t('team_collaboration')}</TabsTrigger>
                <TabsTrigger value="therapist">{t('therapist_tools')}</TabsTrigger>
              </TabsList>

              {/* Getting Started Tab */}
              <TabsContent value="getting-started" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t('welcome_message')}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {t('platform_workflow')}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {t('quick_start_checklist')}
                  </h4>
                  <div className="space-y-2 ml-7">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {t('fill_student_seats')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {t('invite_team_members')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {t('assign_therapists')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {t('monitor_engagement')}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={() => navigate('/dashboard')} className="w-full">
                    {t('go_to_dashboard')}
                  </Button>
                </div>
              </TabsContent>

              {/* Dashboard Deep Dive Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                {/* Student Seats */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">{t('student_seats')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('student_seats_desc')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('student_seats_features')}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Active Engagements */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <Activity className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">{t('active_engagements')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('active_engagements_desc')}
                    </p>
                    <ul className="space-y-1 ml-4">
                      <li className="text-sm text-muted-foreground list-disc">
                        {t('therapy_sessions')}
                      </li>
                      <li className="text-sm text-muted-foreground list-disc">
                        {t('self_assessments')}
                      </li>
                      <li className="text-sm text-muted-foreground list-disc">
                        {t('resources_accessed')}
                      </li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      {t('engagement_feature')}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Emotion Distribution */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">{t('emotion_distribution')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('emotion_distribution_desc')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('emotion_use_case')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('emotion_feature')}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Therapeutic Engagement Growth */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">{t('therapeutic_engagement')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('therapeutic_engagement_desc')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('therapeutic_visual')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('therapeutic_feature')}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={() => navigate('/dashboard')} className="w-full">
                    {t('go_to_dashboard')}
                  </Button>
                </div>
              </TabsContent>

              {/* Students Management Tab */}
              <TabsContent value="students" className="space-y-6">
                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t('students_management')}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {t('students_desc')}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={() => navigate('/students')} className="w-full">
                    {t('go_to_students')}
                  </Button>
                </div>
              </TabsContent>

              {/* Team Collaboration Tab */}
              <TabsContent value="team" className="space-y-6">
                <div className="flex items-start gap-4">
                  <UserCog className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t('team_collaboration')}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {t('team_desc')}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={() => navigate('/team')} className="w-full">
                    {t('go_to_team')}
                  </Button>
                </div>
              </TabsContent>

              {/* Therapist Tools Tab */}
              <TabsContent value="therapist" className="space-y-6">
                <div className="flex items-start gap-4">
                  <Stethoscope className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t('therapist_tools')}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {t('therapist_desc')}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={() => navigate('/therapist')} className="w-full">
                    {t('go_to_therapist')}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
