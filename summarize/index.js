const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async function (context, req) {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const text = req.body.text;

    if (!OPENAI_API_KEY) {
      throw new Error('Missing OpenAI API Key.');
    }

    if (!text || text.trim().length < 5) {
      throw new Error('Transcript is too short.');
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    const messages = [
      {
        role: "system",
        content: "You are an assistant that first corrects punctuation and grammar in a transcript, then summarizes it into 3–5 clean sentences."
      },
      {
        role: "user",
        content: `Transcript:\n\n${text}`
      }
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.3
      })
    });

    const responseBody = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", JSON.stringify(responseBody, null, 2));
      throw new Error(responseBody.error?.message || "OpenAI API call failed");
    }

    let outputText = responseBody.choices[0].message.content.trim();

    // Add line breaks after each full stop
    const formattedText = outputText.replace(/\. /g, ".\n\n");

    context.res = {
      status: 200,
      body: {
        summary: formattedText
      }
    };
  } catch (error) {
    console.error("Summarization Error:", JSON.stringify(error, null, 2));
    context.res = {
      status: 500,
      body: { error: error.message || "Summarization failed" }
    };
  }
};
