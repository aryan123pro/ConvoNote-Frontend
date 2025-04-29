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

// Analyze Recording
analyzeBtn.addEventListener("click", async () => {
  const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

  loading.classList.remove("hidden");
  summarySection.classList.add("hidden");

  try {
    const formData = new FormData();
    formData.append("file", audioBlob);

    // Call speech-to-text backend
    const transcriptRes = await fetch("/api/speechtotext", {
      method: "POST",
      body: formData,
    });

    const transcriptData = await transcriptRes.json();
    const rawTranscript = transcriptData.transcript;

    // Call summarize backend
    const summaryRes = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: rawTranscript }),
    });

    const result = await summaryRes.json();

    if (!summaryRes.ok) throw new Error(result.error || "Summarization failed");

    // Display formatted summary
    summaryText.innerHTML = result.summary.replace(/\n\n/g, "<br><br>");

    loading.classList.add("hidden");
    summarySection.classList.remove("hidden");

  } catch (error) {
    loading.classList.add("hidden");
    alert("Something went wrong during analysis: " + error.message);
    console.error("Frontend Error:", error);
  }
});

// Download PDF
downloadBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const currentDate = new Date().toLocaleString();

  const formattedText = summaryText.innerText;

  doc.setFontSize(14);
  doc.setTextColor(255, 0, 0);
  doc.text("ConvoNote", 15, 15);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Date: ${currentDate}`, 15, 25);
  doc.text("Summary:", 15, 35);

  doc.setFontSize(11);
  const lines = doc.splitTextToSize(formattedText, 180);
  doc.text(lines, 15, 45);

  doc.save("meeting-summary.pdf");
});

// Theme Toggle
function setTheme(mode) {
  document.body.classList.toggle('dark-mode', mode === 'dark');
  localStorage.setItem('theme', mode);
}

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.body.classList.add('dark-mode');
});
