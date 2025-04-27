document.addEventListener('DOMContentLoaded', () => {
  const processBtn = document.getElementById('processBtn');
  const audioUpload = document.getElementById('audioUpload');

  const loadingDiv = document.getElementById('loading');
  const resultsDiv = document.getElementById('results');
  const summaryText = document.getElementById('summaryText');

  processBtn.addEventListener('click', async () => {
    const file = audioUpload.files[0];

    if (!file) {
      alert('Please upload an audio file first.');
      return;
    }

    try {
      // Show "Analyzing..." text
      loadingDiv.classList.remove('hidden');
      resultsDiv.classList.add('hidden');
      loadingDiv.innerText = "Analyzing... Please wait ⏳";

      // Prepare audio buffer
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Send to backend
      const response = await fetch('https://convonote.azurewebsites.net/api/speechtotext', {
        method: 'POST',
        headers: {
          'Content-Type': file.type,  // Set correct audio type
        },
        body: uint8Array,
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      console.log('Transcription result:', data);

      // Hide "Analyzing..." and show result
      loadingDiv.classList.add('hidden');
      resultsDiv.classList.remove('hidden');

      if (data.text) {
        summaryText.innerText = data.text;
      } else {
        summaryText.innerText = 'Transcription completed but no text found.';
      }

    } catch (error) {
      console.error('Error:', error);
      loadingDiv.classList.add('hidden');
      alert('Something went wrong during analysis.');
    }
  });
});
