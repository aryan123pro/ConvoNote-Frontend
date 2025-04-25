// audioProcessor.js

const API_BASE = 'https://convonote.azurewebsites.net/api';

export async function uploadAudioToBlob(file) {
  const res = await fetch(`${API_BASE}/uploadBlob`, {
    method: 'POST',
    headers: { 'Content-Type': file.type },
    body: file
  });

  if (!res.ok) throw new Error('Failed to upload to Blob');
  return await res.json(); // { blobUrl }
}

export async function transcribeAudio(blobUrl) {
  const res = await fetch(`${API_BASE}/speechToText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioUrl: blobUrl })
  });

  if (!res.ok) throw new Error('Failed to transcribe audio');
  return await res.json(); // { transcript, confidenceMap }
}
