export function generatePDF(summary, insights, heatmapData, actions, decisions) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 0, 0);
  doc.setFontSize(18);
  doc.text("ConvoNote", 20, 20);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Date: ${date}    Time: ${time}`, 20, 30);
  doc.text("Summary:", 20, 40);
  doc.text(summary || "-", 20, 50);

  doc.text("Action Items:", 20, 70);
  (actions || ["-"]).forEach((a, i) => doc.text(`${i + 1}. ${a}`, 25, 80 + i * 10));

  const yStart = 80 + (actions?.length || 1) * 10 + 10;
  doc.text("Decisions:", 20, yStart);
  (decisions || ["-"]).forEach((d, i) => doc.text(`${i + 1}. ${d}`, 25, yStart + 10 + i * 10));

  const yHeatmap = yStart + 10 + (decisions?.length || 1) * 10 + 10;
  doc.text("Heatmap:", 20, yHeatmap);
  doc.text((heatmapData || []).join(" | ") || "-", 25, yHeatmap + 10);

  doc.save(`ConvoNote_MeetingMinutes_${date}.pdf`);
}

