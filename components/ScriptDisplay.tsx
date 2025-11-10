import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from './Icons';

interface ScriptDisplayProps {
  script: string;
}

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold p-2 rounded-md transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <ClipboardIcon className="w-5 h-5" />}
        </button>
        <pre className="text-sm text-left text-gray-800 dark:text-gray-200">
          <code className="language-javascript whitespace-pre-wrap font-mono">
            {script}
          </code>
        </pre>
      </div>
  );
};
