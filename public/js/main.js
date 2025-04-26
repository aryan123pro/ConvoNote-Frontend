const fetch = require('node-fetch'); // Ensure node-fetch is installed
const fs = require('fs');
const FormData = require('form-data'); // Import FormData

const API_KEY = 'd94580361cda43abac1fe4b07d6058f9d';

module.exports = async function (context, req) {
  context.log("Function triggered");

  if (!req.body || !req.body.file) {
    context.res = {
      status: 400,
      body: { error: "No file uploaded" }
    };
    return;
  }

  try {
    // Convert the uploaded file from base64
    const audioBuffer = Buffer.from(req.body.file, 'base64');
    const fileName = `audio-${Date.now()}.wav`;
    fs.writeFileSync(fileName, audioBuffer);  // Save file temporarily

    // Upload the audio file to AssemblyAI
    const uploadUrl = await uploadAudioToAssemblyAI(fileName);

    // Request AssemblyAI for transcribing the file
    const transcriptionRes = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'authorization': API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: uploadUrl,  // Use this if you uploaded the file to their server
      })
    });

    const transcriptionResult = await transcriptionRes.json();

    // Polling for transcription status (AssemblyAI processes in steps)
    if (transcriptionResult.status === 'completed') {
      context.res = {
        status: 200,
        body: { transcript: transcriptionResult.text }
      };
    } else {
      context.res = {
        status: 500,
        body: { error: "Transcription failed" }
      };
    }

  } catch (error) {
    context.log("❌ Error:", error);
    context.res = {
      status: 500,
      body: { error: "Speech-to-text failed" }
    };
  }
};

async function uploadAudioToAssemblyAI(fileName) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(fileName));

  const response = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: { 'authorization': API_KEY },
    body: formData,
  });

  const data = await response.json();
  return data.upload_url;  // Return the uploaded URL
}
