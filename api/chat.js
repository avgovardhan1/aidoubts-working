'use strict';
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST allowed' });
    return;
  }
  try {
    const body = req.body;
    const question = body.question || body.prompt || '';
    if (!question) {
      res.status(400).json({ error: 'No question provided' });
      return;
    }
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY) {
      res.status(500).json({ error: 'OpenAI API key not configured on server' });
      return;
    }
    // call OpenAI chat completions (gpt-3.5-turbo)
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + OPENAI_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant for clarifying technical doubts succinctly.' },
          { role: 'user', content: question }
        ],
        max_tokens: 500,
        temperature: 0.2
      })
    });
    const data = await r.json();
    if (data.error) {
      res.status(500).json({ error: data.error.message || JSON.stringify(data.error) });
      return;
    }
    const answer = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
