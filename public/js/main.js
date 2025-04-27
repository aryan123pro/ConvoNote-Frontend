const analyzeBtn = document.getElementById('analyzeBtn');
const fileInput = document.querySelector('input[type="file"]');

analyzeBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];

  if (!file) {
    alert('Please upload a file first.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    // Show analyzing status
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

    // You can now display summary, heatmap, whatever you want here
    document.getElementById('status').innerText = 'Summary Ready ✅';
    // Example: Display result somewhere
    document.getElementById('result').innerText = JSON.stringify(data, null, 2);

  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again.');
    document.getElementById('status').innerText = '';
  }
});
