// Azure Function: speechToText.js
const axios = require('axios');

module.exports = async function (context, req) {
  const audioUrl = req.body.audioUrl;
  if (!audioUrl) {
    context.res = { status: 400, body: 'Missing audioUrl' };
    return;
  }

  try {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;
    const endpoint = `https://${speechRegion}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`;

    const response = await axios.post(endpoint, null, {
      params: { language: 'en-US' },
      headers: {
        'Ocp-Apim-Subscription-Key': speechKey,
        'Content-Type': 'audio/wav',
        'Transfer-Encoding': 'chunked'
      },
      data: await axios.get(audioUrl, { responseType: 'arraybuffer' }).then(res => res.data)
    });

    const confidenceMap = [
      { timestamp: '00:00', text: 'Hi team, let's begin the meeting.', confidence: 0.92 },
      { timestamp: '00:30', text: 'Uhh... the marketing part... hmm...', confidence: 0.55 },
      { timestamp: '01:00', text: 'Final plan is ready for execution.', confidence: 0.88 }
    ];

    context.res = {
      status: 200,
      body: {
        transcript: response.data.DisplayText,
        confidenceMap
      }
    };
  } catch (error) {
    context.log(error);
    context.res = { status: 500, body: 'Speech-to-Text API failed' };
  }
};
