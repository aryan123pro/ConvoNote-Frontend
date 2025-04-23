// pdfGenerator.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

window.generatePDF = function (transcript, insights, confidenceMap) {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor(255, 0, 0);
  doc.text('ConvoNote', 105, 20, null, null, 'center');

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text('Meeting Summary & Analysis', 105, 30, null, null, 'center');
  doc.line(20, 32, 190, 32);

  doc.setFontSize(12);
  doc.text('📌 Insights:', 20, 45);
  insights.forEach((insight, index) => {
    doc.text(`- ${insight}`, 25, 55 + index * 7);
  });

  let yOffset = 55 + insights.length * 7 + 10;
  doc.text('📊 Confidence Heatmap:', 20, yOffset);
  yOffset += 5;
  confidenceMap.forEach((c, i) => {
    doc.text(`${c.emoji} ${c.timestamp}: ${c.text}`, 25, yOffset + i * 6);
  });

  yOffset += confidenceMap.length * 6 + 10;
  doc.text('📝 Full Transcript:', 20, yOffset);
  const lines = doc.splitTextToSize(transcript, 170);
  doc.text(lines, 25, yOffset + 10);

  doc.save('ConvoNote_Report.pdf');
};
