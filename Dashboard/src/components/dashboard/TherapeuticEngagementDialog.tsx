import { Download, Printer, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTherapeuticEngagementGrowth } from "@/lib/services/therapeuticEngagement";
import { generateTherapeuticEngagementPDF } from "@/lib/pdf/therapeuticEngagementPdf";
import { toast } from "@/hooks/use-toast";

interface TherapeuticEngagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TherapeuticEngagementDialog = ({
  open,
  onOpenChange,
}: TherapeuticEngagementDialogProps) => {
  const { data: engagementGrowth, isLoading } = useTherapeuticEngagementGrowth();

  const handleDownloadPDF = () => {
    if (engagementGrowth) {
      generateTherapeuticEngagementPDF(engagementGrowth);
      toast({
        title: "PDF Generated",
        description: "Your therapeutic engagement report has been downloaded.",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Therapeutic Engagement Growth Insights</DialogTitle>
          <DialogDescription>
            Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : engagementGrowth ? (
          <div className="space-y-6" id="printable-content">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Growth Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {engagementGrowth.isGrowing ? "+" : ""}
                    {engagementGrowth.growthPercentage}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {engagementGrowth.currentWeek?.total_activities || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Last Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {engagementGrowth.previousWeek?.total_activities || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {engagementGrowth.currentWeek?.unique_users || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Breakdown (Current Week)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Exercise Feedback</span>
                    <span className="text-2xl font-bold">
                      {engagementGrowth.currentWeek?.exercise_count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Journal Entries</span>
                    <span className="text-2xl font-bold">
                      {engagementGrowth.currentWeek?.journal_count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">CERQ Assessments</span>
                    <span className="text-2xl font-bold">
                      {engagementGrowth.currentWeek?.assessment_count || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Trend Table */}
            <Card>
              <CardHeader>
                <CardTitle>6-Week Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Week Start</TableHead>
                      <TableHead>Week End</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Exercises</TableHead>
                      <TableHead className="text-right">Journals</TableHead>
                      <TableHead className="text-right">Assessments</TableHead>
                      <TableHead className="text-right">Students</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {engagementGrowth.weeklyTrend.map((week) => (
                      <TableRow key={week.week_start}>
                        <TableCell className="font-medium">
                          {new Date(week.week_start).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(week.week_end).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {week.total_activities}
                        </TableCell>
                        <TableCell className="text-right">
                          {week.exercise_count}
                        </TableCell>
                        <TableCell className="text-right">
                          {week.journal_count}
                        </TableCell>
                        <TableCell className="text-right">
                          {week.assessment_count}
                        </TableCell>
                        <TableCell className="text-right">
                          {week.unique_users}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <DialogFooter className="gap-2 no-print">
          <Button variant="outline" onClick={handlePrint} disabled={isLoading}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownloadPDF} disabled={isLoading || !engagementGrowth}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TherapeuticEngagementDialog;
