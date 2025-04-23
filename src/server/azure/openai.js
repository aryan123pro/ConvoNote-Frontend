// Azure Function: openai.js
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');

module.exports = async function (context, req) {
  const transcript = req.body.transcript;
  if (!transcript) {
    context.res = { status: 400, body: 'Missing transcript' };
    return;
  }

  try {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const key = process.env.AZURE_OPENAI_KEY;
    const deploymentId = process.env.AZURE_OPENAI_DEPLOYMENT_ID;

    const client = new OpenAIClient(endpoint, new AzureKeyCredential(key));
    const prompt = `Summarize this meeting transcript and give 3 key suggestions:\n${transcript}`;

    const completion = await client.getCompletions(deploymentId, prompt, {
      maxTokens: 300,
      temperature: 0.6
    });

    const resultText = completion.choices[0].text.trim();
    const lines = resultText.split('\n').filter(line => line.trim());

    context.res = {
      status: 200,
      body: {
        summary: lines[0],
        insights: lines.slice(1)
      }
    };
  } catch (err) {
    context.log(err);
    context.res = { status: 500, body: 'Failed to call Azure OpenAI' };
  }
};
