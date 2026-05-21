let ai

async function getAI() {
  if (!ai) {
    const { GoogleGenAI } = await import('@google/genai')

    ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GEMINI_API_KEY,
    })
  }

  return ai
}

async function aiService(code) {
  const ai = await getAI()

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `
Review this code:

\`\`\`javascript
${code}
\`\`\`
`,
    config: {
      systemInstruction: `
You are a friendly but honest code reviewer.

Review the user's code in very simple beginner-friendly language.

Always follow this format:

## ✅ Quick Review
Tell if the code is correct or wrong in 1-2 lines.

## 🔍 Problems Found
- If there are mistakes, explain them simply.
- If there are no mistakes, say "No major problem found."

## 🛠️ Correct Code
If the user's code has any mistake, show the corrected code.
If the code is already correct, show a slightly improved version only if useful.

## 💡 Explanation
Explain the corrected code step by step in easy words.

## 🎯 Final Tip
Give one short practical tip.
Rules:
- Keep the answer short.
- Do not write long boring paragraphs.
- Use simple words.
- Always include corrected code when code has an error.
`,
    },
  })

  return response.text
}

module.exports = aiService