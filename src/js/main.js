// main.js - Final version with meeting minutes export

document.getElementById("processBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("audioUpload");
  const loading = document.getElementById("loading");
  const results = document.getElementById("results");
  const summaryText = document.getElementById("summaryText");
  const heatmap = document.getElementById("heatmap");
  const insightsList = document.getElementById("insightsList");

  if (!fileInput.files[0]) {
    alert("Please upload an audio file first.");
    return;
  }

  const validTypes = ['audio/mpeg', 'audio/wav'];
  if (!validTypes.includes(fileInput.files[0].type)) {
    alert("Only MP3 or WAV audio files are allowed.");
    return;
  }

  results.classList.add("hidden");
  loading.classList.remove("hidden");

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    const speechRes = await fetch("https://convonote.azurewebsites.net/api/speechtotext", {
      method: "POST",
      body: formData,
    });
    const { transcript } = await speechRes.json();

    const summaryRes = await fetch("https://convonote.azurewebsites.net/api/summaryinsights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });

    const { summary, insights, heatmapData, actions, decisions } = await summaryRes.json();

    summaryText.textContent = summary;
    heatmap.innerHTML = heatmapData.map((c, i) => `<div>${i + 1}. ${c}</div>`).join('');
    insightsList.innerHTML = insights.map(i => `<li>${i}</li>`).join('');

    loading.classList.add("hidden");
    results.classList.remove("hidden");

    // Save for export
    window.meetingData = { summary, insights, heatmapData, actions, decisions };

  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong. Try again.");
    loading.classList.add("hidden");
  }
});

document.getElementById("toggleHeatmap").addEventListener("click", () => {
  document.getElementById("heatmap").classList.toggle("hidden");
});

document.getElementById("toggleInsights").addEventListener("click", () => {
  document.getElementById("insightsList").classList.toggle("hidden");
});

document.getElementById("downloadPdf").addEventListener("click", () => {
  const { summary, insights, heatmapData, actions, decisions } = window.meetingData || {};
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  const content = `ConvoNote – Meeting Minutes\n\nDate: ${date}\nTime: ${time}\n\nSummary:\n${summary}\n\nAction Items:\n${(actions || []).map((a, i) => `${i + 1}. ${a}`).join("\n") || "-"}\n\nDecisions:\n${(decisions || []).map((d, i) => `${i + 1}. ${d}`).join("\n") || "-"}\n\nHeatmap:\n${(heatmapData || []).join(" | ")}`;

  const blob = new Blob([content], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `ConvoNote_MeetingMinutes_${date}.pdf`;
  link.click();
});
