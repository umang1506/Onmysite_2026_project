import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. If Gemini API Key is configured, call Google Gemini 1.5 Flash API!
    if (geminiKey) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `You are an expert Clinical AI Assistant on the Onmysite Triage Gateway. Answer concisely and professionally to: "${message}"` }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return res.json({ reply: data.candidates[0].content.parts[0].text, source: 'gemini-api' });
      }
    }

    // 2. Fallback Smart Conversational NLP Engine
    const lower = message.toLowerCase().trim();

    // Thank you / Appreciation shorthand list
    const thanks = ['tq', 'thx', 'thanks', 'thank you', 'ty', 'appreciate it', 'cool', 'great', 'awesome', 'ok', 'okay'];
    if (thanks.some(t => lower === t || lower.startsWith(t + ' ') || lower.startsWith(t + '!'))) {
      return res.json({
        reply: 'You are very welcome! 👋 Let me know if you have any other clinical questions or need to record patient symptoms.',
        source: 'assistant-nlp'
      });
    }

    // Greetings list
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'hi there'];
    if (greetings.some(g => lower === g || lower.startsWith(g + ' '))) {
      return res.json({
        reply: 'Hello! 👋 How can I assist you on the Clinical Triage Gateway today? You can:\n• Describe patient symptoms (e.g. "Chest pain and cold sweat")\n• Ask rule questions\n• Test emergency vitals',
        source: 'assistant-nlp'
      });
    }

    // Conversational Q&A
    if (lower.includes('who are you') || lower.includes('what can you do')) {
      return res.json({
        reply: 'I am your Clinical Intelligence AI Assistant on the Onmysite Triage Gateway. I assist doctors and nurses by processing patient symptom feeds, evaluating SpO2 vital overrides (< 90%), and resolving patient identities.',
        source: 'assistant-nlp'
      });
    }

    return res.json({ reply: null, isClinicalIntake: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process chat: ' + err.message });
  }
});

export default router;
