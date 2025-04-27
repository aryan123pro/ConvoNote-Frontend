document.addEventListener('DOMContentLoaded', () => {
  const processBtn = document.getElementById('processBtn');
  const audioUpload = document.getElementById('audioUpload');

  processBtn.addEventListener('click', async () => {
    const file = audioUpload.files[0];

    if (!file) {
      alert('Please upload an audio file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      document.getElementById('loading').classList.remove('hidden');
      document.getElementById('results').classList.add('hidden');

      const response = await fetch('https://convonote.azurewebsites.net/api/speechtotext', {
        method: 'POST',
        body: formData,
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
