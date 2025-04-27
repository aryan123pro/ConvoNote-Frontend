module.exports = async function (context, req) {
  if (req.method !== 'POST') {
    context.res = {
      status: 405,
      body: { error: true, message: 'Method Not Allowed' },
    };
    return;
  }

  try {
    const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
    const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION;

    if (!AZURE_SPEECH_KEY || !AZURE_SPEECH_REGION) {
      throw new Error('Azure Speech credentials missing.');
    }

    const endpoint = `https://${AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
        'Content-Type': req.headers['content-type'] || 'audio/wav',
        'Accept': 'application/json',
      },
      body: req.body,
    });

    const resultText = await response.text(); // 🔥 Important - read as text

    try {
      const parsed = JSON.parse(resultText);

      if (parsed.RecognitionStatus && parsed.RecognitionStatus === "Success") {
        context.res = {
          status: 200,
          body: parsed, // ✅ Successfully recognized
        };
      } else {
        throw new Error(parsed.RecognitionStatus || "Azure Speech API error.");
      }

    } catch (jsonError) {
      throw new Error("Failed parsing Azure Speech response: " + resultText);
    }

  } catch (error) {
    console.error('REAL BACKEND ERROR:', error);
    context.res = {
      status: 200, // Always send safe 200 to frontend
      body: {
        error: true,
        message: error.message || 'Unknown server error',
      },
    };
  }
};
