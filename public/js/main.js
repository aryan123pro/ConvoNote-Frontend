document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startRecording');
  const stopBtn = document.getElementById('stopRecording');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const downloadPdfBtn = document.getElementById('downloadPdf');
  const liveText = document.getElementById('liveText');
  const summaryText = document.getElementById('summaryText');

  let recognition;
  let fullTranscript = '';

  if (!('webkitSpeechRecognition' in window)) {
    alert('Web Speech API is not supported in your browser.');
  } else {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          fullTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      liveText.innerText = fullTranscript + interimTranscript;
    };
  }

  startBtn.addEventListener('click', () => {
    fullTranscript = '';
    liveText.innerText = '';
    recognition.start();
  });

  stopBtn.addEventListener('click', () => {
    recognition.stop();
  });

  analyzeBtn.addEventListener('click', async () => {
    try {
      if (!fullTranscript.trim()) {
        alert('No transcription available yet.');
        return;
      }

      const response = await fetch('https://convonote.azurewebsites.net/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: fullTranscript }),
      });

      const data = await response.json();
      if (data.summary) {
        summaryText.innerText = data.summary;
      } else {
        alert('Summarization failed.');
      }
    } catch (error) {
      console.error('Summarization Error:', error);
      alert('Something went wrong during summarization.');
    }
  });

  downloadPdfBtn.addEventListener('click', () => {
    generatePdf(summaryText.innerText, fullTranscript);
  });
});
