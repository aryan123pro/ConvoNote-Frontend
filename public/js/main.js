const uploadInput = document.getElementById("audioUpload");
const processBtn = document.getElementById("processBtn");
const loading = document.getElementById("loading");
const summaryText = document.getElementById("summaryText");
const results = document.getElementById("results");
const downloadBtn = document.getElementById("downloadPdf");

processBtn.addEventListener("click", async () => {
  const file = uploadInput.files[0];

  if (!file) {
    alert("Please upload an audio file first.");
    return;
  }

  summaryText.innerText = "";
  results.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    const formData = new FormData();
    formData.append("file", file);

    // Call speech-to-text endpoint
    const transcriptRes = await fetch("/api/speechtotext", {
      method: "POST",
      body: formData,
    });

    const transcriptData = await transcriptRes.json();
    const rawTranscript = transcriptData.transcript;

    // Call summarize endpoint
    const summaryRes = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: rawTranscript }),
    });

    const result = await summaryRes.json();

    if (!summaryRes.ok) throw new Error(result.error || "Summarization failed");

    // Display formatted summary in browser (handle \n\n as visual line breaks)
    summaryText.innerHTML = result.summary.replace(/\n\n/g, "<br><br>");

    loading.classList.add("hidden");
    results.classList.remove("hidden");

  } catch (error) {
    loading.classList.add("hidden");
    alert("Something went wrong during analysis: " + error.message);
    console.error("Frontend Error:", error);
  }
});

// Download summary as PDF
downloadBtn.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const currentDate = new Date().toLocaleString();

  const formattedText = summaryText.innerText;

  doc.setFontSize(14);
  doc.setTextColor(200, 0, 0);
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
