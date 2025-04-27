document.addEventListener('DOMContentLoaded', () => {
  const processBtn = document.getElementById('processBtn');
  const audioUpload = document.getElementById('audioUpload');

  processBtn.addEventListener('click', async () => {
    const file = audioUpload.files[0];

    if (!file) {
      alert('Please upload an audio file first.');
      return;
    }

    try {
      document.getElementById('loading').classList.remove('hidden');
      document.getElementById('results').classList.add('hidden');

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const response = await fetch('https://convonote.azurewebsites.net/api/speechtotext', {
        method: 'POST',
        headers: {
          'Content-Type': file.type, // example: 'audio/mpeg'
        },
        body: uint8Array,
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      console.log('Transcription result:', data);

      document.getElementById('summaryText').innerText = data.text || 'Summary not available yet.';
      document.getElementById('loading').classList.add('hidden');
      document.getElementById('results').classList.remove('hidden');

    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong during analysis.');
      document.getElementById('loading').classList.add('hidden');
    }
  });
});
