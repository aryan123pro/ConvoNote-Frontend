let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const loading = document.getElementById("loading");
const summaryText = document.getElementById("summaryText");
const summarySection = document.getElementById("summarySection");
const recordingStatus = document.getElementById("recordingStatus");
const downloadBtn = document.getElementById("downloadPdf");

let finalTranscript = ""; // Store for PDF

// Start Recording
startBtn.addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start();
  audioChunks = [];

  mediaRecorder.addEventListener("dataavailable", (event) => {
    audioChunks.push(event.data);
  });

  startBtn.disabled = true;
  stopBtn.disabled = false;
  analyzeBtn.disabled = true;
  recordingStatus.classList.remove("hidden");
});

// Stop Recording
stopBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
  analyzeBtn.disabled = false;
  recordingStatus.classList.add("hidden");
});

// Analyze (Fake version for demo)
analyzeBtn.addEventListener("click", async () => {
  loading.classList.remove("hidden");
  summarySection.classList.add("hidden");

  try {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate AI processing

    // Fake content
    const fakeSummary = `
- The team discussed upcoming deadlines and responsibilities.
- Development blockers were identified and resolved.
- The client’s feedback was reviewed and integrated.
- Action items were assigned to all stakeholders.
    `.trim();

    finalTranscript = "Hello, my name is Aryan and I am here to test my new app named ConvoNote."; // Fake transcript

    summaryText.innerHTML = fakeSummary.replace(/\n/g, "<br><br>");

    loading.classList.add("hidden");
    summarySection.classList.remove("hidden");

  } catch (error) {
    loading.classList.add("hidden");
    alert("Something went wrong: " + error.message);
  }
});

// Download PDF
downloadBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const currentDate = new Date().toLocaleString();

  // Header: ConvoNote + Date
  doc.setTextColor(255, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ConvoNote", 10, 15);

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Date: ${currentDate}`, 150, 15);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Meeting Summary", 105, 30, null, null, "center");

  // Summary
  doc.setFontSize(14);
  doc.text("Summary:", 105, 45, null, null, "center");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const summaryLines = doc.splitTextToSize(summaryText.innerText, 180);
  doc.text(summaryLines, 10, 55);

  const summaryHeight = 55 + summaryLines.length * 6;

  // Transcript
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Full Transcript:", 105, summaryHeight + 10, null, null, "center");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const transcriptLines = doc.splitTextToSize(finalTranscript, 180);
  doc.text(transcriptLines, 10, summaryHeight + 20);

  doc.save("ConvoNote-Meeting-Summary.pdf");
});

// Theme toggle
function setTheme(mode) {
  document.body.classList.toggle("dark-mode", mode === "dark");
  localStorage.setItem("theme", mode);
}

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.body.classList.add("dark-mode");
});
