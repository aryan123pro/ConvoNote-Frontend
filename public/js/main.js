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

  // Validate file type (MP3 or WAV)
  const validTypes = ['audio/mpeg', 'audio/wav'];
  if (!validTypes.includes(fileInput.files[0].type)) {
    alert("Only MP3 or WAV audio files are allowed.");
    return;
  }

  results.classList.add("hidden");
  loading.classList.remove("hidden");

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  // Log the form data to verify it's being sent properly
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }

  try {
    // Send the file to the backend for speech-to-text
    const speechRes = await fetch("https://convonote.azurewebsites.net/api/speechtotext", {
      method: "POST",
      body: formData,
    });

    // Handle non-200 responses (400, 500, etc.)
    if (!speechRes.ok) {
      throw new Error(`Error: ${speechRes.statusText}`);
    }

    // Parse the response as JSON
    const response = await speechRes.json();

    // Check if the 'transcript' field is present in the response
    if (!response.transcript) {
      throw new Error("Missing transcript in the response.");
    }

    // Send the transcript for summary and insights processing
    const summaryRes = await fetch("https://convonote.azurewebsites.net/api/summaryinsights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: response.transcript }),
    });

    // Check if the response from summary insights is valid
    if (!summaryRes.ok) {
      throw new Error(`Error: ${summaryRes.statusText}`);
    }

    const { summary, insights, heatmapData } = await summaryRes.json();

    // Display results on the frontend
    summaryText.textContent = summary;
    heatmap.innerHTML = heatmapData.map((c, i) => `<div>${i + 1}. ${c}</div>`).join('');
    insightsList.innerHTML = insights.map(i => `<li>${i}</li>`).join('');

    loading.classList.add("hidden");
    results.classList.remove("hidden");

  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong. Please try again.");
    loading.classList.add("hidden");
  }
});
