import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface EmotionReportData {
  totalLogs: number;
  mostCommon: string;
  emotionBreakdown: Array<{
    emotion: string;
    count: number;
    percentage: string;
  }>;
  recentEntries: Array<{
    studentName: string;
    emotion: string;
    date: string;
    trigger: string;
  }>;
}

export const generateEmotionPDF = (data: EmotionReportData) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('Emotion Distribution Insights', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, 28, { align: 'center' });
  
  // Summary
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Summary Statistics', 14, 42);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Total Emotion Logs: ${data.totalLogs.toLocaleString()}`, 14, 52);
  doc.text(`Most Common Emotion: ${data.mostCommon}`, 14, 59);
  
  // Emotion breakdown table
  const breakdownData = data.emotionBreakdown.map(row => [
    row.emotion,
    row.count.toString(),
    row.percentage
  ]);
  
  autoTable(doc, {
    startY: 70,
    head: [['Emotion', 'Count', '% of Total']],
    body: breakdownData,
    theme: 'striped',
    headStyles: { 
      fillColor: [255, 149, 80],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: { 
      fontSize: 9,
      cellPadding: 3
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });
  
  // Recent entries table
  const finalY = (doc as any).lastAutoTable.finalY || 70;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Recent Emotion Entries', 14, finalY + 15);
  
  const recentData = data.recentEntries.map(row => [
    row.studentName,
    row.emotion,
    row.date,
    row.trigger
  ]);
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [['Student', 'Emotion', 'Date', 'Trigger']],
    body: recentData,
    theme: 'grid',
    headStyles: { 
      fillColor: [255, 149, 80],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: { 
      fontSize: 8,
      cellPadding: 2
    }
  });
  
  // Footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
  }
  
  // Save the PDF
  doc.save(`emotion-insights-${new Date().toISOString().split('T')[0]}.pdf`);
};
