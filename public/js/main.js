document.getElementById("processBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("audioUpload");
  const loading = document.getElementById("loading");
  const results = document.getElementById("results");
  const summaryText = document.getElementById("summaryText");
  const heatmap = document.getElementById("heatmap");
  const insightsList = document.getElementById("insightsList");

  // Check if a file is selected
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
  const file = fileInput.files[0];

  // Append the file to FormData
  formData.append("file", file);

  try {
    // Send the file to the backend for speech-to-text
    const response = await fetch("https://convonote.azurewebsites.net/api/speechtotext", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error: " + response.statusText);
    }

    const data = await response.json();

    if (data.transcript) {
      // Send the transcript for summary and insights processing
      const summaryRes = await fetch("https://convonote.azurewebsites.net/api/summaryinsights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: data.transcript }),
      });

      if (!summaryRes.ok) {
        throw new Error("Error: " + summaryRes.statusText);
      }

      const { summary, insights, heatmapData } = await summaryRes.json();

      // Display results on the frontend
      summaryText.textContent = summary;
      heatmap.innerHTML = heatmapData.map((c, i) => `<div>${i + 1}. ${c}</div>`).join('');
      insightsList.innerHTML = insights.map(i => `<li>${i}</li>`).join('');

      loading.classList.add("hidden");
      results.classList.remove("hidden");
    } else {
      alert("Failed to get transcript");
      loading.classList.add("hidden");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong. Please try again.");
    loading.classList.add("hidden");
  }
});
