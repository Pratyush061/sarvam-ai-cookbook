import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json();

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json({ valid: false, error: 'Invalid API key format' }, { status: 400 });
    }

    // We can do a lightweight request to a sarvam endpoint or just mock a successful check.
    // For Sarvam, we can attempt a dummy translation or similar lightweight endpoint.
    // Since there's no official "/me" endpoint documented here, we'll try to hit models or a simple chat completion with max_tokens=1
    // to verify the key.

    // As per the instructions: "Validate: API key presence"
    // And "We can test connection". Let's do a minimal chat completion request.

    const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'sarvam-105b',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1
      })
    });

    if (response.ok) {
      return NextResponse.json({ valid: true });
    } else {
      // For privacy, don't return raw error back to the client if it could expose credentials.
      return NextResponse.json({ valid: false, error: 'Invalid API Key or unauthorized' }, { status: 401 });
    }

  } catch {
    return NextResponse.json({ valid: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
