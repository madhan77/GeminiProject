
import React from 'react';
import { ShieldCheckIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary-600 dark:text-primary-400">
          Gmail Cleanup Script Generator
        </h1>
        <div className="mt-4 max-w-2xl mx-auto flex items-start justify-center p-4 bg-primary-50 dark:bg-gray-700/50 rounded-lg border border-primary-200 dark:border-gray-600">
          <ShieldCheckIcon className="h-8 w-8 text-primary-500 dark:text-primary-400 flex-shrink-0 mr-4 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Security is Our Priority</h2>
            <p className="text-gray-600 dark:text-gray-300 text-left mt-1">
              This app <strong className="font-semibold">does not</strong> ask for your password or access to your Gmail account. Instead, it uses Gemini to generate a safe Google Apps Script for you to review and run yourself. You remain in full control.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
   