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
      loadingDiv.innerText = "Uploading and starting analysis...⏳";

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const startResponse = await fetch('https://convonote.azurewebsites.net/api/speechtotext', {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'audio/wav',
        },
        body: uint8Array,
      });

      const startData = await startResponse.json();
      console.log('Start Transcript Response:', startData);

      if (startData.error) {
        alert('Error during upload: ' + startData.message);
        loadingDiv.classList.add('hidden');
        return;
      }

      const transcriptId = startData.transcriptId;
      console.log('Transcript ID:', transcriptId);

      loadingDiv.innerText = "Processing... Please wait ⏳ (around 15 seconds)";
      await new Promise(resolve => setTimeout(resolve, 15000)); // Wait 15 seconds

      const checkResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        method: 'GET',
        headers: {
          'authorization': 'd94580361cda43abac1fe4b07d6058f9',  // <-- AssemblyAI API Key directly here
        },
      });

      const checkData = await checkResponse.json();
      console.log('Final Transcript Data:', checkData);

      loadingDiv.classList.add('hidden');

      if (checkData.status === 'completed') {
        summaryText.innerText = checkData.text;
        resultsDiv.classList.remove('hidden');
      } else {
        alert('Transcription not completed yet. Please try again later.');
      }

    } catch (error) {
      console.error('Frontend Error during analysis:', error);
      loadingDiv.classList.add('hidden');
      alert('Something went wrong: ' + (error.message || 'Unknown error.'));
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
