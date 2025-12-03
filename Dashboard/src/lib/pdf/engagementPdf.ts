import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface EngagementReportData {
  totalTherapy: number;
  totalAssessments: number;
  totalResources: number;
  uniqueStudents: number;
  studentRows: Array<{
    name: string;
    email: string;
    therapy: number;
    assessments: number;
    resources: number;
  }>;
}

export const generateEngagementPDF = (data: EngagementReportData) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('Active Engagements Report', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, 28, { align: 'center' });
  
  // Summary Box
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Summary Statistics', 14, 42);
  
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(`Total Therapy Sessions: ${data.totalTherapy}`, 14, 52);
  doc.text(`Total Self-Assessments: ${data.totalAssessments}`, 14, 59);
  doc.text(`Total Resources Accessed: ${data.totalResources}`, 14, 66);
  doc.text(`Unique Students: ${data.uniqueStudents}`, 14, 73);
  
  // Student Activity Table
  const tableData = data.studentRows.map(row => [
    row.name,
    row.email,
    row.therapy.toString(),
    row.assessments.toString(),
    row.resources.toString()
  ]);
  
  autoTable(doc, {
    startY: 82,
    head: [['Student Name', 'Email', 'Therapy Sessions', 'Self-Assessments', 'Resources']],
    body: tableData,
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
  
  // Footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
  }
  
  // Save the PDF
  doc.save(`engagement-report-${new Date().toISOString().split('T')[0]}.pdf`);
};
