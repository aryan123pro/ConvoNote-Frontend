function generatePdf(summary, transcript) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // ConvoNote Header
  doc.setTextColor(255, 0, 0); // Red color
  doc.setFont("helvetica", "bold"); // Bold font to simulate Orbitron feel
  doc.setFontSize(18);
  doc.text('ConvoNote', 10, 15);

  // Reset for the rest of the PDF
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0); // Back to black
  doc.setFont("helvetica", "normal");
  doc.text('Meeting Summary', 105, 30, null, null, 'center');

  // Summary Section
  doc.setFontSize(14);
  doc.text('Summary:', 10, 45);
  doc.setFontSize(12);
  doc.text(summary, 10, 55, { maxWidth: 190 });

  // Transcript Section
  let transcriptStart = 70 + summary.split(' ').length / 2; // Adjust based on summary length
  doc.setFontSize(14);
  doc.text('Full Transcript:', 10, transcriptStart);
  doc.setFontSize(12);
  doc.text(transcript, 10, transcriptStart + 10, { maxWidth: 190 });

  doc.save('ConvoNote-Meeting-Summary.pdf');
}
