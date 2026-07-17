import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, language, speaker, apiKey } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (!apiKey && !process.env.SARVAM_API_KEY) {
      return NextResponse.json({ error: 'API Key is required' }, { status: 401 });
    }

    const keyToUse = apiKey || process.env.SARVAM_API_KEY;
    const targetLanguageCode = language === 'hi-IN' || language === 'Hindi' ? 'hi-IN' : 'en-IN';
    const selectedSpeaker = speaker || 'meera'; // Default to meera if not provided

    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': keyToUse
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: targetLanguageCode,
        speaker: selectedSpeaker,
        pitch: 0,
        pace: 1.0,
        loudness: 1.5,
        speech_sample_rate: 16000,
        enable_preprocessing: true,
        model: 'bulbul:v3'
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Sarvam TTS API error:', response.status, errText);
      return NextResponse.json({ error: 'Failed to generate audio from provider' }, { status: response.status });
    }

    const data = await response.json();

    if (data && data.audios && data.audios.length > 0) {
      return NextResponse.json({ audioBase64: data.audios[0] });
    } else {
      return NextResponse.json({ error: 'No audio returned' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error in tts API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
