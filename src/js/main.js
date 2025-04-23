// main.js

const audioInput = document.getElementById('audioInput');
const loadingSpinner = document.getElementById('loadingSpinner');
const insightsSection = document.getElementById('insightsSection');
const heatmapSection = document.getElementById('heatmapSection');
const insightsList = document.getElementById('insightsList');
const heatmapGraphic = document.getElementById('heatmapGraphic');

const toggleInsights = document.getElementById('toggleInsights');
const toggleHeatmap = document.getElementById('toggleHeatmap');
const downloadPDFBtn = document.getElementById('downloadPDF');

const API_BASE = 'https://convonote.azurewebsites.net/api';

let finalTranscript = '';
let finalInsights = [];
let finalConfidenceMap = [];

function toggleSection(section) {
  section.classList.toggle('hidden');
}

toggleInsights.addEventListener('click', () => toggleSection(insightsSection));
toggleHeatmap.addEventListener('click', () => toggleSection(heatmapSection));

audioInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  loadingSpinner.classList.remove('hidden');

  try {
    // Upload to Azure Blob
    const blobUploadRes = await fetch(`${API_BASE}/uploadBlob`, {
      method: 'POST',
      headers: { 'Content-Type': file.type },
      body: file
    });
    const { blobUrl } = await blobUploadRes.json();

    // Transcribe audio
    const speechRes = await fetch(`${API_BASE}/speechToText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioUrl: blobUrl })
    });
    const { transcript, confidenceMap } = await speechRes.json();
    finalTranscript = transcript;
    finalConfidenceMap = confidenceMap;

    // Get AI Summary + Insights
    const openaiRes = await fetch(`${API_BASE}/summaryInsights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript })
    });
    const { summary, insights } = await openaiRes.json();
    finalInsights = insights;

    // Render insights and heatmap
    insightsList.innerHTML = insights.map(i => `<li>${i}</li>`).join('');
    heatmapGraphic.innerHTML = confidenceMap.map(c => `${c.emoji} ${c.timestamp}: ${c.text}`).join('<br>');

    downloadPDFBtn.disabled = false;
  } catch (err) {
    console.error('Error:', err);
    alert('An error occurred while processing the audio.');
  } finally {
    loadingSpinner.classList.add('hidden');
  }
});

downloadPDFBtn.addEventListener('click', () => {
  generatePDF(finalTranscript, finalInsights, finalConfidenceMap);
});
