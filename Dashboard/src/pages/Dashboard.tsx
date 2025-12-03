import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import MetricCard from "@/components/dashboard/MetricCard";
import SeatUploadDialog from "@/components/dashboard/SeatUploadDialog";
import EngagementReportDialog from "@/components/dashboard/EngagementReportDialog";
import EmotionInsightsDialog from "@/components/dashboard/EmotionInsightsDialog";
import SeatIncreaseConfirmDialog from "@/components/dashboard/SeatIncreaseConfirmDialog";
import SeatRequestFormDialog from "@/components/dashboard/SeatRequestFormDialog";
import TherapeuticEngagementDialog from "@/components/dashboard/TherapeuticEngagementDialog";
import { useTherapeuticEngagementGrowth } from "@/lib/services/therapeuticEngagement";
import { useInstitutionSettings } from "@/hooks/useInstitutionSettings";
import { useStudents } from "@/hooks/useStudents";
import { useActiveEngagements } from "@/hooks/useActiveEngagements";
import { useEmotionDistribution } from "@/hooks/useEmotionDistribution";

const Dashboard = () => {
  const [showSeatDialog, setShowSeatDialog] = useState(false);
  const [showEngagementReport, setShowEngagementReport] = useState(false);
  const [showEmotionInsights, setShowEmotionInsights] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRequestFormDialog, setShowRequestFormDialog] = useState(false);
  const [showEngagementGrowth, setShowEngagementGrowth] = useState(false);

  // Fetch institution settings for total seats
  const { data: institutionSettings, isLoading: isLoadingSettings } = useInstitutionSettings();
  
  // Fetch all students to count used seats
  const { data: students, isLoading: isLoadingStudents } = useStudents();
  
  // Calculate dynamic seat data
  const usedSeats = students?.length || 0;
  const totalSeats = institutionSettings?.total_seats || 0;
  const studentSeats = {
    used: usedSeats,
    total: totalSeats
  };
  
  // Fetch therapeutic engagement data
  const { data: engagementGrowth, isLoading: isLoadingGrowth } = 
    useTherapeuticEngagementGrowth();
  
  // Fetch active engagements and emotion distribution data
  const { data: engagementData, isLoading: isLoadingEngagements } = useActiveEngagements();
  const { data: emotionData, isLoading: isLoadingEmotions } = useEmotionDistribution();

  return (
    <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-foreground">Welcome back</h1>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Seats Card */}
            <MetricCard title="Student seats">
              {isLoadingSettings || isLoadingStudents ? (
                <div className="flex items-center justify-center h-32">
                  <span className="text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <>
              <div className="flex items-center justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="hsl(var(--muted))"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="hsl(var(--primary))"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 56 * (1 - studentSeats.used / studentSeats.total)
                        }`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-foreground">
                        {studentSeats.used}/{studentSeats.total}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full w-12 h-12"
                  onClick={() => setShowConfirmDialog(true)}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <Button
                className="w-full mt-4"
                size="lg"
                onClick={() => setShowSeatDialog(true)}
              >
                Fill in seats
              </Button>
              </>
              )}
            </MetricCard>

            {/* Active Engagements Card */}
            <MetricCard title="Active engagements">
              {isLoadingEngagements ? (
                <div className="flex items-center justify-center h-48">
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : engagementData.length === 0 ? (
                <div className="flex items-center justify-center h-48">
                  <span className="text-sm text-muted-foreground">No engagement data available</span>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {engagementData.map((engagement) => (
                        <div key={engagement.label}>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{engagement.label}</span>
                            <span className="text-sm font-medium">{engagement.count}</span>
                          </div>
                          <Progress value={engagement.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-4" 
                    size="lg"
                    onClick={() => setShowEngagementReport(true)}
                  >
                    See report
                  </Button>
                </>
              )}
            </MetricCard>

            {/* Emotion Distribution Card */}
            <MetricCard title="Emotion Distribution">
              {isLoadingEmotions ? (
                <div className="flex items-center justify-center h-48">
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : emotionData.length === 0 ? (
                <div className="flex items-center justify-center h-48">
                  <span className="text-sm text-muted-foreground">No emotion data available</span>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {emotionData.map((emotion) => (
                      <div key={emotion.emotion}>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{emotion.emotion}</span>
                          <span className="text-sm font-medium">{emotion.count}</span>
                        </div>
                        <Progress value={emotion.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-2" 
                    size="lg"
                    onClick={() => setShowEmotionInsights(true)}
                  >
                    View insights
                  </Button>
                </>
              )}
            </MetricCard>

            {/* Therapeutic Engagement Growth Card */}
            <MetricCard title="Therapeutic Engagement Growth">
              {isLoadingGrowth ? (
                <div className="h-48 flex items-center justify-center">
                  <span className="text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Bar Chart - Last 5 Weeks */}
                  <div className="h-32 flex items-end gap-2">
                    {engagementGrowth?.weeklyTrend.slice(0, 5).reverse().map((week, index) => {
                      const maxActivities = Math.max(
                        ...engagementGrowth.weeklyTrend.slice(0, 5).map((w) => w.total_activities)
                      );
                      const heightPercentage = maxActivities > 0 
                        ? (week.total_activities / maxActivities) * 100 
                        : 0;

                      return (
                        <div
                          key={week.week_start}
                          className="flex-1 bg-chart-primary rounded-t-lg transition-all hover:opacity-80 cursor-pointer group relative min-h-[20px]"
                          style={{
                            height: `${Math.max(heightPercentage, 15)}%`,
                          }}
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                            {new Date(week.week_start).toLocaleDateString()}: {week.total_activities} activities
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Growth Metric */}
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-foreground">
                      {engagementGrowth?.isGrowing ? "+" : ""}
                      {engagementGrowth?.growthPercentage || 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {engagementGrowth?.currentWeek?.total_activities || 0} activities this week
                    </p>
                    <p className="text-xs text-muted-foreground">
                      vs {engagementGrowth?.previousWeek?.total_activities || 0} last week
                    </p>
                  </div>
                </div>
              )}

              <Button 
                variant="outline" 
                className="w-full mt-4" 
                size="lg"
                onClick={() => setShowEngagementGrowth(true)}
              >
                View insights
              </Button>
            </MetricCard>
          </div>
        </div>

        <SeatUploadDialog open={showSeatDialog} onOpenChange={setShowSeatDialog} />
        <EngagementReportDialog open={showEngagementReport} onOpenChange={setShowEngagementReport} />
        <EmotionInsightsDialog open={showEmotionInsights} onOpenChange={setShowEmotionInsights} />
        <TherapeuticEngagementDialog
          open={showEngagementGrowth}
          onOpenChange={setShowEngagementGrowth}
        />
        <SeatIncreaseConfirmDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={() => {
            setShowConfirmDialog(false);
            setShowRequestFormDialog(true);
          }}
        />
        <SeatRequestFormDialog
          open={showRequestFormDialog}
          onOpenChange={setShowRequestFormDialog}
          currentSeats={studentSeats}
        />
      </div>
  );
};

export default Dashboard;
