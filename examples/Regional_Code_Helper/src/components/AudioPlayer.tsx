import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, RefreshCcw } from 'lucide-react';
import { Button } from './ui/Layout';

interface AudioPlayerProps {
  audioBase64: string | null;
  onReplay?: () => void;
}

export function AudioPlayer({ audioBase64, onReplay }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    if (audioBase64) {
      try {
        const byteCharacters = atob(audioBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'audio/wav' });
        url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } catch (e) {
        console.error("Error creating audio object URL", e);
      }
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
      setIsPlaying(false);
    };
  }, [audioBase64]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopPlay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  if (!audioUrl) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 shadow-sm mt-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      <Button variant="ghost" size="sm" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </Button>

      <Button variant="ghost" size="sm" onClick={stopPlay} disabled={!isPlaying} aria-label="Stop">
        <Square size={18} />
      </Button>

      {onReplay && (
        <Button variant="ghost" size="sm" onClick={() => { stopPlay(); onReplay(); }} aria-label="Replay or Regenerate">
          <RefreshCcw size={18} />
        </Button>
      )}

      <div className="text-xs text-gray-500 ml-2 font-medium">
        {isPlaying ? 'Playing explanation...' : 'Audio Ready'}
      </div>
    </div>
  );
}
