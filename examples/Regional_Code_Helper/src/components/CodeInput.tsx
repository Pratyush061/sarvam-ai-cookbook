import React, { useRef } from 'react';
import { Button } from './ui/Layout';
import { Trash2, Upload, FileCode } from 'lucide-react';

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  onExplain: () => void;
  isLoading: boolean;
}

const LANGUAGES = [
  'Auto Detect',
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++',
  'HTML', 'CSS', 'SQL', 'JSON', 'React/JSX', 'Plain Text'
];

export function CodeInput({ code, setCode, language, setLanguage, onExplain, isLoading }: CodeInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50000) { // arbitrary limit ~50KB
        alert("File is too large. Please upload a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setCode((event.target?.result as string) || '');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode size={18} className="text-gray-500" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-sm font-medium focus:outline-none text-gray-700"
            aria-label="Programming Language"
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang === 'Auto Detect' ? '' : lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".py,.js,.ts,.java,.c,.cpp,.html,.css,.sql,.json,.jsx,.tsx,.txt"
          />
          <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} title="Upload file">
            <Upload size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCode('')} disabled={!code} title="Clear editor">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="flex-grow p-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste or type your code here..."
          className="w-full h-full resize-none outline-none font-mono text-sm bg-transparent"
          spellCheck="false"
        />
      </div>

      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {code.length} characters
        </div>
        <Button onClick={onExplain} disabled={!code.trim() || isLoading} className="min-w-[120px]">
          {isLoading ? 'Processing...' : 'Explain Code'}
        </Button>
      </div>
    </div>
  );
}
