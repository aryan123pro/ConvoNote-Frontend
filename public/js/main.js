document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const fileInput = document.getElementById('fileInput');

  analyzeBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];

    if (!file) {
      alert('Please upload a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      document.getElementById('status').innerText = 'Analyzing... 🧠';

      const response = await fetch('https://convonote.azurewebsites.net/api/speechtotext', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server returned error');
      }

      const data = await response.json();
      console.log('Transcription result:', data);

      document.getElementById('status').innerText = 'Summary Ready ✅';
      document.getElementById('result').innerText = JSON.stringify(data, null, 2);

    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
      document.getElementById('status').innerText = '';
    }
  });
});
