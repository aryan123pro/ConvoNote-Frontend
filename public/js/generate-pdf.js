function generatePdf(summary, transcript) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    // Logo
    doc.setFontSize(16);
    doc.text('ConvoNote', 10, 15);
  
    // Title
    doc.setFontSize(20);
    doc.text('Meeting Summary', 105, 30, null, null, 'center');
  
    // Summary
    doc.setFontSize(14);
    doc.text('Summary:', 10, 45);
    doc.setFontSize(12);
    doc.text(summary, 10, 55, { maxWidth: 190 });
  
    // Transcript
    let transcriptStart = 70 + summary.split(' ').length / 2; // Adjust based on summary length
    doc.setFontSize(14);
    doc.text('Full Transcript:', 10, transcriptStart);
    doc.setFontSize(12);
    doc.text(transcript, 10, transcriptStart + 10, { maxWidth: 190 });
  
    doc.save('ConvoNote-Meeting-Summary.pdf');
  }
  