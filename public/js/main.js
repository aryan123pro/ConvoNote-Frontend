document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const audioUpload = document.getElementById('audioUpload');
  const loadingDiv = document.getElementById('loading');
  const resultsDiv = document.getElementById('results');
  const summaryText = document.getElementById('summaryText');
  const copyBtn = document.getElementById('copyBtn');

  analyzeBtn.addEventListener('click', async () => {
    const file = audioUpload.files[0];

    if (!file) {
      alert('Please upload an audio file first.');
      return;
    }

    try {
      loadingDiv.classList.remove('hidden');
      resultsDiv.classList.add('hidden');
      loadingDiv.innerText = "Analyzing... Please wait ⏳";

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const response = await fetch('https://convonote.azurewebsites.net/api/speechtotext', {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'audio/wav',
          'Accept': 'application/json'
        },
        body: uint8Array,
      });

      const data = await response.json();
      console.log('Azure Speech Response:', data);

      loadingDiv.classList.add('hidden');

      if (data.DisplayText) {
        summaryText.innerText = data.DisplayText;
        resultsDiv.classList.remove('hidden');
      } else {
        summaryText.innerText = "No text found.";
        resultsDiv.classList.remove('hidden');
      }

    } catch (error) {
      console.error('Error during analysis:', error);
      loadingDiv.classList.add('hidden');
      alert('Something went wrong. Please try again.');
    }

    const data = await response.json();
console.log('Azure Speech Response:', data);

loadingDiv.classList.add('hidden');

if (data.error) {
  alert('Error during analysis: ' + data.message);
  return;
}

if (data.DisplayText) {
  summaryText.innerText = data.DisplayText;
  resultsDiv.classList.remove('hidden');
} else {
  summaryText.innerText = "No text found.";
  resultsDiv.classList.remove('hidden');
}

  });

  copyBtn.addEventListener('click', () => {
    const text = summaryText.innerText;
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Text copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  });

  
});
