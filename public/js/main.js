const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const loading = document.getElementById("loading");
const summaryText = document.getElementById("summaryText");
const summarySection = document.getElementById("summarySection");
const recordingStatus = document.getElementById("recordingStatus");
const downloadBtn = document.getElementById("downloadPdf");

let finalTranscript = "";
let recognition;

// Setup Web Speech API
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    finalTranscript = transcript;
    recordingStatus.innerText = `📝 Captured: ${transcript}`;
  };
} else {
  alert("Sorry, your browser does not support speech recognition.");
}

// Start listening
startBtn.addEventListener("click", () => {
  recognition.start();
  finalTranscript = "";
  recordingStatus.innerText = "🔴 Listening...";
  startBtn.disabled = true;
  stopBtn.disabled = false;
  analyzeBtn.disabled = true;
});

// Stop listening
stopBtn.addEventListener("click", () => {
  recognition.stop();
  recordingStatus.innerText = "";
  stopBtn.disabled = true;
  analyzeBtn.disabled = false;
});

// Analyze and summarize
analyzeBtn.addEventListener("click", async () => {
  if (!finalTranscript || finalTranscript.trim().length < 5) {
    alert("Transcript is empty or too short.");
    return;
  }

  loading.classList.remove("hidden");
  summarySection.classList.add("hidden");
  downloadBtn.classList.add("hidden");

  try {
    const response = await fetch("https://convonote.azurewebsites.net/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: finalTranscript })
    });

    const data = await response.json();

    summaryText.innerText = `📝 Summary:\n\n${data.summary}`;
    summarySection.classList.remove("hidden");
    downloadBtn.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    alert("Error contacting summarizer API.");
  } finally {
    loading.classList.add("hidden");
    analyzeBtn.disabled = true;
    startBtn.disabled = false;
  }
});

// PDF download
downloadBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 0, 0);
  doc.setFontSize(16);
  doc.text("ConvoNote", 15, 20);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);

  const date = new Date().toLocaleString();
  const summary = summaryText.innerText;
  const transcript = finalTranscript.replace(/\. /g, ".\n");

  let y = 35;
  doc.text(`📄 Filename: realtime_recording`, 15, y);
  y += 8;
  doc.text(`📅 Date & Time: ${date}`, 15, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("📝 Summary:", 15, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text(doc.splitTextToSize(summary, 180), 15, y);
  y += doc.getTextDimensions(summary).h + 10;

  doc.setFont("helvetica", "bold");
  doc.text("🗣️ Transcript:", 15, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text(doc.splitTextToSize(transcript, 180), 15, y);

  doc.save("ConvoNote_Summary.pdf");
});
