function generatePdf(summary, transcript) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Red, Bold, Orbitron-style header (simulated)
  doc.setTextColor(255, 0, 0); // red
  doc.setFont("helvetica", "bold"); // simulate Orbitron bold
  doc.setFontSize(18);
  doc.text("ConvoNote", 10, 15);

  // Meeting Summary Title
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0); // black
  doc.setFont("helvetica", "normal");
  doc.text("Meeting Summary", 105, 30, null, null, "center");

  // Summary Section
  doc.setFontSize(14);
  doc.text("Summary:", 10, 45);
  doc.setFontSize(12);
  doc.text(summary, 10, 55, { maxWidth: 190 });

  // Transcript Section
  const transcriptStart = 70 + summary.split(" ").length / 2; // rough adjustment
  doc.setFontSize(14);
  doc.text("Full Transcript:", 10, transcriptStart);
  doc.setFontSize(12);
  doc.text(transcript, 10, transcriptStart + 10, { maxWidth: 190 });

  doc.save("ConvoNote-Meeting-Summary.pdf");
}
