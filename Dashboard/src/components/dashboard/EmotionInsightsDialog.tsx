import { useState, useEffect } from "react";
import { Download, Printer, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateEmotionPDF, EmotionReportData } from "@/lib/pdf/emotionPdf";

interface EmotionInsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmotionInsightsDialog = ({ open, onOpenChange }: EmotionInsightsDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<EmotionReportData | null>(null);

  useEffect(() => {
    if (open) {
      fetchReportData();
    }
  }, [open]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch emotion usage logs
      const { data: emotionLogs, error: logsError } = await supabase
        .from('emotion_usage_logs')
        .select('id, created_at, user_id, need_id, trigger_detail')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (logsError) throw logsError;

      // Fetch needs with emotion relationships
      const { data: needs, error: needsError } = await supabase
        .from('need')
        .select('id, name, emotion_id');

      if (needsError) throw needsError;

      // Fetch emotions
      const { data: emotions, error: emotionsError } = await supabase
        .from('emotion')
        .select('id, name');

      if (emotionsError) throw emotionsError;

      // Fetch student data from userspub table
      const { data: students, error: studentsError } = await supabase
        .from('userspub')
        .select('id, first_name, last_name, email');

      if (studentsError) throw studentsError;

      // Map user IDs to student names
      const studentMap = new Map(
        students?.map((s) => [s.id, `${s.first_name || ''} ${s.last_name || ''}`.trim()]) || []
      );

      // Create emotion counts
      const emotionCounts: Record<string, number> = {};
      const emotionMap = new Map(emotions?.map(e => [e.id, e.name]) || []);
      const needMap = new Map(needs?.map(n => [n.id, n.emotion_id]) || []);

      emotionLogs?.forEach((log) => {
        const emotionId = needMap.get(log.need_id);
        const emotionName = emotionId ? (emotionMap.get(emotionId) || 'Unknown') : 'Unknown';
        emotionCounts[emotionName] = (emotionCounts[emotionName] || 0) + 1;
      });

      // Calculate percentages and sort
      const total = emotionLogs?.length || 0;
      const emotionBreakdown = Object.entries(emotionCounts)
        .map(([emotion, count]) => ({
          emotion,
          count,
          percentage: total > 0 ? `${((count / total) * 100).toFixed(1)}%` : '0%'
        }))
        .sort((a, b) => b.count - a.count);

      // Get most common emotion
      const mostCommon = emotionBreakdown[0]?.emotion || 'N/A';

      // Get recent entries (last 10)
      const recentEntries = emotionLogs?.slice(0, 10).map((log) => {
        const emotionId = needMap.get(log.need_id);
        const emotionName = emotionId ? (emotionMap.get(emotionId) || 'Unknown') : 'Unknown';
        const studentName = studentMap.get(log.user_id) || 'Unknown Student';
        
        return {
          studentName,
          emotion: emotionName,
          date: new Date(log.created_at).toLocaleDateString(),
          trigger: log.trigger_detail || 'Not specified'
        };
      }) || [];

      setReportData({
        totalLogs: total,
        mostCommon,
        emotionBreakdown,
        recentEntries
      });

    } catch (error: any) {
      console.error('Error fetching emotion data:', error);
      toast({
        title: "Error",
        description: "Failed to load emotion insights data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (reportData) {
      generateEmotionPDF(reportData);
      toast({
        title: "PDF Generated",
        description: "Your emotion insights report has been downloaded."
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
          <DialogTitle>Emotion Distribution Insights</DialogTitle>
          <DialogDescription>
            Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : reportData ? (
          <div className="space-y-6" id="printable-content">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Emotion Logs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.totalLogs.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Most Common Emotion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.mostCommon}</div>
                </CardContent>
              </Card>
            </div>

            {/* Emotion Breakdown Table */}
            <Card>
              <CardHeader>
                <CardTitle>Emotion Distribution Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Emotion</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                      <TableHead className="text-right">% of Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.emotionBreakdown.length > 0 ? (
                      reportData.emotionBreakdown.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.emotion}</TableCell>
                          <TableCell className="text-right">{row.count}</TableCell>
                          <TableCell className="text-right">{row.percentage}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No emotion data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Emotion Entries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Emotion Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Emotion</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Trigger</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.recentEntries.length > 0 ? (
                      reportData.recentEntries.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.studentName}</TableCell>
                          <TableCell>{row.emotion}</TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell className="max-w-xs truncate">{row.trigger}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No recent entries available
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

export default EmotionInsightsDialog;
