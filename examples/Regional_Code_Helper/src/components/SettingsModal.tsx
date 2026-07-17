import React, { useState, useEffect } from 'react';
import { Button } from './ui/Layout';
import { Input } from './ui/Input';
import { Settings, X, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySave: (key: string) => void;
  currentKey: string;
}

export function SettingsModal({ isOpen, onClose, onKeySave, currentKey }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');

  useEffect(() => {
    setApiKey(currentKey);
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const testConnection = async () => {
    if (!apiKey) return;
    setStatus('checking');
    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey })
      });
      if (res.ok) {
        setStatus('valid');
      } else {
        setStatus('invalid');
      }
    } catch {
      setStatus('invalid');
    }
  };

  const handleSave = () => {
    onKeySave(apiKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-900" aria-label="Close settings">
          <X size={20} />
        </button>
        <div className="flex items-center gap-2 mb-6">
          <Settings className="text-blue-600" />
          <h2 className="text-xl font-semibold">API Settings</h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Enter your Sarvam API key to use the explanation and TTS features. The key is stored temporarily and passed securely to the server.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sarvam API Key</label>
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setStatus('idle'); }}
                placeholder="Enter your Sarvam API key"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="secondary" size="sm" onClick={testConnection} disabled={status === 'checking' || !apiKey}>
              {status === 'checking' ? 'Testing...' : 'Test Connection'}
            </Button>

            <div className="text-sm font-medium">
              {status === 'valid' && <span className="text-green-600 flex items-center gap-1"><Check size={16} /> Valid</span>}
              {status === 'invalid' && <span className="text-red-600 flex items-center gap-1"><AlertCircle size={16} /> Invalid</span>}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
