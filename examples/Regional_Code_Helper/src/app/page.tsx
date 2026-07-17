"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SettingsModal } from '@/components/SettingsModal';
import { CodeInput } from '@/components/CodeInput';
import { ExplanationPanel } from '@/components/ExplanationPanel';
import { Button } from '@/components/ui/Layout';
import { Settings, Code2 } from 'lucide-react';

type AppState = 'IDLE' | 'VALIDATING_KEY' | 'ANALYZING_CODE' | 'GENERATING_EXPLANATION' | 'GENERATING_AUDIO' | 'READY' | 'ERROR';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [apiKey, setApiKey] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [code, setCode] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const codeParam = params.get('code');
      if (codeParam) {
        setCode(decodeURIComponent(codeParam));
      }
    }
  }, []);
  const [codeLanguage, setCodeLanguage] = useState(''); // auto detect by default

  const [explanationLanguage, setExplanationLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [speaker, setSpeaker] = useState('meera');

  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Attempt to load API key from session storage on mount
  useEffect(() => {
    const savedKey = sessionStorage.getItem('sarvam_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    sessionStorage.setItem('sarvam_api_key', key); // Only session storage per requirements
  };

  const handleExplain = async () => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setAppState('ANALYZING_CODE');
    setError(null);
    setExplanation('');
    setAudioBase64(null);

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: codeLanguage,
          explanationLanguage,
          apiKey
        }),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to explain code');
      }

      const data = await res.json();
      setExplanation(data.explanation);
      setAppState('READY');

    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      console.error(err);
      setError((err as Error).message || 'An unexpected error occurred');
      setAppState('ERROR');
    }
  };

  const handleGenerateAudio = async () => {
    if (!explanation) return;
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setAppState('GENERATING_AUDIO');

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: explanation,
          language: explanationLanguage,
          speaker,
          apiKey
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate audio');
      }

      const data = await res.json();
      setAudioBase64(data.audioBase64);
      setAppState('READY');

    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || 'Failed to generate audio');
      setAppState('ERROR');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex flex-col">
      <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Code2 className="text-blue-600" />
            Sarvam Talk
          </h1>
          <p className="text-gray-500 text-sm mt-1">Understand code in English or Hindi, with Voice AI.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={explanationLanguage}
            onChange={(e) => setExplanationLanguage(e.target.value as 'en-IN' | 'hi-IN')}
            className="text-sm bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Explanation Language"
          >
            <option value="en-IN">English Explanation</option>
            <option value="hi-IN">Hindi Explanation</option>
          </select>

          <Button variant="secondary" onClick={() => setIsSettingsOpen(true)} className="gap-2">
            <Settings size={16} />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </header>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        <div className="h-[60vh] lg:h-auto min-h-[400px]">
          <CodeInput
            code={code}
            setCode={setCode}
            language={codeLanguage}
            setLanguage={setCodeLanguage}
            onExplain={handleExplain}
            isLoading={appState === 'ANALYZING_CODE'}
          />
        </div>

        <div className="h-[60vh] lg:h-auto min-h-[400px]">
          <ExplanationPanel
            explanation={explanation}
            isLoading={appState === 'ANALYZING_CODE'}
            error={error}
            audioBase64={audioBase64}
            isAudioLoading={appState === 'GENERATING_AUDIO'}
            onGenerateAudio={handleGenerateAudio}
            speaker={speaker}
            setSpeaker={setSpeaker}
            language={explanationLanguage}
          />
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeySave={handleSaveKey}
        currentKey={apiKey}
      />
    </div>
  );
}
