import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EngagementGrowthData } from '../services/therapeuticEngagement';

export const generateTherapeuticEngagementPDF = (data: EngagementGrowthData) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('Therapeutic Engagement Growth Report', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, 28, { align: 'center' });
  
  // Summary Box
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Week-Over-Week Growth', 14, 42);
  
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Growth Rate: ${data.isGrowing ? '+' : ''}${data.growthPercentage}%`, 14, 52);
  doc.text(`Current Week Activities: ${data.currentWeek?.total_activities || 0}`, 14, 59);
  doc.text(`Previous Week Activities: ${data.previousWeek?.total_activities || 0}`, 14, 66);
  doc.text(`Active Students (This Week): ${data.currentWeek?.unique_users || 0}`, 14, 73);
  
  // Current Week Breakdown
  doc.setFontSize(14);
  doc.text('Activity Breakdown (Current Week)', 14, 88);
  
  const breakdownData = [
    ['Exercise Feedback', (data.currentWeek?.exercise_count || 0).toString()],
    ['Journal Entries', (data.currentWeek?.journal_count || 0).toString()],
    ['CERQ Assessments', (data.currentWeek?.assessment_count || 0).toString()],
  ];
  
  autoTable(doc, {
    startY: 92,
    head: [['Activity Type', 'Count']],
    body: breakdownData,
    theme: 'striped',
    headStyles: { 
      fillColor: [255, 149, 80],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: { 
      fontSize: 10,
      cellPadding: 4
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });
  
  // Weekly Trend Table
  const finalY = (doc as any).lastAutoTable.finalY || 92;
  doc.setFontSize(14);
  doc.text('6-Week Trend Analysis', 14, finalY + 15);
  
  const trendData = data.weeklyTrend.map(week => [
    new Date(week.week_start).toLocaleDateString(),
    new Date(week.week_end).toLocaleDateString(),
    week.total_activities.toString(),
    week.exercise_count.toString(),
    week.journal_count.toString(),
    week.assessment_count.toString(),
    week.unique_users.toString()
  ]);
  
  autoTable(doc, {
    startY: finalY + 20,
    head: [['Week Start', 'Week End', 'Total', 'Exercises', 'Journals', 'Assessments', 'Students']],
    body: trendData,
    theme: 'grid',
    headStyles: { 
      fillColor: [255, 149, 80],
      textColor: [255, 255, 255],
      fontSize: 9,
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
  doc.save(`therapeutic-engagement-${new Date().toISOString().split('T')[0]}.pdf`);
};
