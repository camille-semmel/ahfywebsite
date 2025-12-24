import { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  generateEngagementPDF,
  EngagementReportData,
} from "@/lib/pdf/engagementPdf";

interface EngagementReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EngagementReportDialog = ({
  open,
  onOpenChange,
}: EngagementReportDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<EngagementReportData | null>(
    null
  );

  useEffect(() => {
    if (open) {
      fetchReportData();
    }
  }, [open]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch exercise feedback (therapy sessions)
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("public.exercise_feedback")
        .select("user_id, therapist_exercise_id, mediation_id");

      if (feedbackError) throw feedbackError;

      // Fetch emotion usage logs (self-assessments)
      const { data: emotionData, error: emotionError } = await supabase
        .from("public.emotion_usage_logs")
        .select("user_id, need_id")
        .eq("is_deleted", false);

      if (emotionError) throw emotionError;

      // Fetch student data from userspub table
      const { data: studentData, error: studentError } = await supabase
        .from("public.userspub")
        .select("id, first_name, last_name, email, created_at");

      if (studentError) throw studentError;

      // Create activity map by user_id
      const activityMap = new Map<
        string,
        { therapy: number; assessments: number; resources: number }
      >();

      // Count therapy sessions per user
      feedbackData?.forEach((feedback) => {
        const userId = feedback.user_id;
        if (!activityMap.has(userId)) {
          activityMap.set(userId, { therapy: 0, assessments: 0, resources: 0 });
        }
        activityMap.get(userId)!.therapy += 1;
      });

      // Count self-assessments per user
      emotionData?.forEach((log) => {
        const userId = log.user_id;
        if (!activityMap.has(userId)) {
          activityMap.set(userId, { therapy: 0, assessments: 0, resources: 0 });
        }
        activityMap.get(userId)!.assessments += 1;
      });

      // Build student rows
      const studentRows =
        studentData?.map((student) => {
          const activity = activityMap.get(student.id) || {
            therapy: 0,
            assessments: 0,
            resources: 0,
          };
          return {
            name: `${student.first_name || "N/A"} ${
              student.last_name || ""
            }`.trim(),
            email: student.email || "N/A",
            therapy: activity.therapy,
            assessments: activity.assessments,
            resources: activity.therapy + activity.assessments,
          };
        }) || [];

      // Calculate totals
      const totalTherapy = feedbackData?.length || 0;
      const totalAssessments = emotionData?.length || 0;
      const totalResources = studentRows.reduce(
        (sum, row) => sum + row.resources,
        0
      );
      const uniqueStudents = studentData?.length || 0;

      setReportData({
        totalTherapy,
        totalAssessments,
        totalResources,
        uniqueStudents,
        studentRows,
      });
    } catch (error: any) {
      console.error("Error fetching engagement data:", error);
      toast({
        title: "Error",
        description: "Failed to load engagement report data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (reportData) {
      generateEngagementPDF(reportData);
      toast({
        title: "PDF Generated",
        description: "Your engagement report has been downloaded.",
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
          <DialogTitle>Active Engagements Report</DialogTitle>
          <DialogDescription>
            Generated on {new Date().toLocaleDateString()} at{" "}
            {new Date().toLocaleTimeString()}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : reportData ? (
          <div className="space-y-6" id="printable-content">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Therapy Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.totalTherapy}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Self-Assessments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.totalAssessments}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Resources Accessed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.totalResources}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Unique Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {reportData.uniqueStudents}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Student Activity Table */}
            <Card>
              <CardHeader>
                <CardTitle>Student Activity Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">
                        Therapy Sessions
                      </TableHead>
                      <TableHead className="text-right">
                        Self-Assessments
                      </TableHead>
                      <TableHead className="text-right">Resources</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.studentRows.length > 0 ? (
                      reportData.studentRows.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {row.name}
                          </TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell className="text-right">
                            {row.therapy}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.assessments}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.resources}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground"
                        >
                          No student data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <DialogFooter className="gap-2 no-print">
          <Button variant="outline" onClick={handlePrint} disabled={loading}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownloadPDF} disabled={loading || !reportData}>
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

export default EngagementReportDialog;
