// main.js

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

  results.classList.add("hidden");
  loading.classList.remove("hidden");

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    const speechRes = await fetch("https://convonote.azurewebsites.net/api/speechToText", {
      method: "POST",
      body: formData,
    });
    const { transcript } = await speechRes.json();

    const summaryRes = await fetch("https://convonote.azurewebsites.net/api/summaryInsights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });
    const { summary, insights, heatmapData } = await summaryRes.json();

    summaryText.textContent = summary;
    heatmap.innerHTML = heatmapData.map((c, i) => `<div>${i + 1}. ${c}</div>`).join('');
    insightsList.innerHTML = insights.map(i => `<li>${i}</li>`).join('');

    loading.classList.add("hidden");
    results.classList.remove("hidden");
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
  const summary = document.getElementById("summaryText").textContent;
  const insights = Array.from(document.querySelectorAll("#insightsList li")).map(li => li.textContent);
  const heatmap = document.getElementById("heatmap").innerText;

  const pdfText = `ConvoNote\n\nSummary:\n${summary}\n\nInsights:\n${insights.join("\n")}\n\nHeatmap:\n${heatmap}`;
  const blob = new Blob([pdfText], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ConvoNote_Summary.pdf";
  link.click();
});
