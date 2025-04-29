function generatePdf(summary, transcript) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const currentDate = new Date().toLocaleString();

  // Header: ConvoNote and Date/Time
  doc.setTextColor(255, 0, 0); // red
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.text('ConvoNote', 10, 15);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Date: ${currentDate}`, 150, 15); // right-aligned date

  // Title: Meeting Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text('Meeting Summary', 105, 30, null, null, 'center');

  // Section: Summary
  doc.setFontSize(14);
  doc.text('Summary:', 10, 45);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const summaryLines = doc.splitTextToSize(summary, 180);
  doc.text(summaryLines, 10, 55);

  // Dynamic Y for Transcript
  const summaryHeight = 55 + summaryLines.length * 6;

  // Section: Full Transcript
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text('Full Transcript:', 10, summaryHeight + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const transcriptLines = doc.splitTextToSize(transcript, 180);
  doc.text(transcriptLines, 10, summaryHeight + 20);

  // Save PDF
  doc.save('ConvoNote-Meeting-Summary.pdf');
}
