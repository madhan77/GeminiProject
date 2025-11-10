
import React from 'react';
import type { EmailSummary } from '../types';
import { FileTextIcon } from './Icons';

interface SummaryDisplayProps {
  summary: EmailSummary[];
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-6">
        <FileTextIcon className="mx-auto h-12 w-12 text-primary-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Your Latest Email Summary</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here are the most recent emails from your primary inbox.
        </p>
      </div>
      <div className="flow-root">
        {summary.length > 0 ? (
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {summary.map((email, index) => (
              <li key={index} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                       <span className="text-lg font-bold text-primary-600 dark:text-primary-300">
                        {email.sender.charAt(0).toUpperCase()}
                       </span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white" title={email.subject}>
                      {email.subject}
                    </p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400" title={email.sender}>
                      {email.sender}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                      {new Date(email.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {email.snippet}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No recent emails were found in your primary inbox to summarize.</p>
          </div>
        )}
      </div>
    </div>
  );
};
