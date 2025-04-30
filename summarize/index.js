const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async function (context, req) {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const text = req.body.text;

    if (!OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API Key.");
    }

    if (!text || text.trim().length < 5) {
      throw new Error("Transcript is too short.");
    }

    const url = "https://api.openai.com/v1/chat/completions";

    const messages = [
      {
        role: "system",
        content: "You are an assistant that corrects punctuation and grammar in a transcript, and then summarizes it into 3–5 clear sentences."
      },
      {
        role: "user",
        content: `Transcript:\n\n${text}`
      }
    ];

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.6,
        max_tokens: 300
      })
    });

    const data = await response.json();
    const summary = data.choices[0].message.content;

    context.res = {
      body: {
        summary: summary.trim()
      }
    };
  } catch (err) {
    console.error("Summarize Error:", err);
    context.res = {
      status: 500,
      body: { error: err.message || "Internal Server Error" }
    };
  }
};
