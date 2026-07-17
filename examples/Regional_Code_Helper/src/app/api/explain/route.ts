import { NextResponse } from 'next/server';

const MAX_CODE_LENGTH = 10000;

export async function POST(req: Request) {
  try {
    const { code, language, explanationLanguage, apiKey } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    if (code.length > MAX_CODE_LENGTH) {
      return NextResponse.json({ error: 'Code exceeds maximum length allowed' }, { status: 400 });
    }

    if (!apiKey && !process.env.SARVAM_API_KEY) {
      return NextResponse.json({ error: 'API Key is required' }, { status: 401 });
    }

    const keyToUse = apiKey || process.env.SARVAM_API_KEY;

    let systemPrompt = `You are a senior developer and an expert coding tutor.
Analyze the provided code and explain it.
Structure your response clearly with:
1. Brief summary
2. Step-by-step explanation
3. Important variables and functions
4. Input and output behavior
5. Possible bugs or risks
6. Time and space complexity when relevant
7. A beginner-friendly interpretation
`;

    if (explanationLanguage === 'hi-IN' || explanationLanguage === 'Hindi') {
      systemPrompt += `
Crucial Instructions for Hindi:
- Explain the concept naturally in Hindi.
- Keep ALL code identifiers, technical terms, variables, function names, and keywords in English. DO NOT translate them.
- Display code using its original syntax.
- For example, keep words like "Function", "Variable", "Array", "Loop", "API", "Promise", "Component", "State", "Database" in English.
- Do not produce excessively formal or machine-translated Hindi.
- Format the response beautifully using Markdown.
`;
    } else {
      systemPrompt += `
Format the response beautifully using Markdown.
Explain in English.
`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Language: ${language || 'auto'}\n\nCode:\n${code}\n\nPlease explain this code according to the instructions.` }
    ];

    const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keyToUse}`
      },
      body: JSON.stringify({
        model: 'sarvam-105b',
        messages,
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      // safe error normalization
      console.error('Sarvam API error:', response.status);
      return NextResponse.json({ error: 'Failed to generate explanation from provider' }, { status: response.status });
    }

    const data = await response.json();
    const explanation = data?.choices?.[0]?.message?.content || '';

    return NextResponse.json({ explanation });

  } catch (error) {
    console.error('Error in explain API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
