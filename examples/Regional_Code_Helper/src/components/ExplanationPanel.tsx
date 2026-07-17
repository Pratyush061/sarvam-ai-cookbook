import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AlertCircle } from 'lucide-react';
import { Button } from './ui/Layout';
import { AudioPlayer } from './AudioPlayer';

interface ExplanationPanelProps {
  explanation: string;
  isLoading: boolean;
  error: string | null;
  audioBase64: string | null;
  isAudioLoading: boolean;
  onGenerateAudio: () => void;
  speaker: string;
  setSpeaker: (speaker: string) => void;
  language: string; // hi-IN or en-IN
}

export function ExplanationPanel({
  explanation, isLoading, error,
  audioBase64, isAudioLoading, onGenerateAudio,
  speaker, setSpeaker
}: ExplanationPanelProps) {

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col items-center animate-pulse">
          <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Analyzing code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-red-50 rounded-xl shadow-sm border border-red-200 p-6 text-center">
        <div>
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error Occurred</h3>
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-200 text-center p-8">
        <div>
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Ready to Explain</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Paste your code and click Explain to see a detailed, easy-to-understand breakdown here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-semibold text-gray-800">Explanation</h3>

        <div className="flex items-center gap-2">
          <select
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            className="text-sm bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none"
            aria-label="Select Speaker"
          >
            <option value="meera">Meera (Female)</option>
            <option value="aravind">Aravind (Male)</option>
          </select>

          <Button
            variant="secondary"
            size="sm"
            onClick={onGenerateAudio}
            disabled={isAudioLoading}
          >
            {isAudioLoading ? 'Generating Audio...' : 'Listen'}
          </Button>
        </div>
      </div>

      <div className="flex-grow p-6 overflow-y-auto">
        <div className="markdown-body">
          <ReactMarkdown>{explanation}</ReactMarkdown>
        </div>

        {audioBase64 && (
          <AudioPlayer audioBase64={audioBase64} onReplay={onGenerateAudio} />
        )}
      </div>
    </div>
  );
}
