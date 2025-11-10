
import React from 'react';
import type { ActionSelection } from '../types';
import { TrashIcon, ArchiveBoxIcon } from './Icons';

interface ActionSelectorProps {
  selection: ActionSelection;
  setSelection: React.Dispatch<React.SetStateAction<ActionSelection>>;
  disabled?: boolean;
}

const actionOptions = [
  { id: 'delete', label: 'Delete Permanently', icon: <TrashIcon className="w-6 h-6" />, description: 'Emails will be moved to Trash and permanently deleted after 30 days.' },
  { id: 'archive', label: 'Archive', icon: <ArchiveBoxIcon className="w-6 h-6" />, description: 'Emails will be removed from your inbox but kept in "All Mail".' },
] as const;


export const ActionSelector: React.FC<ActionSelectorProps> = ({ selection, setSelection, disabled = false }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {actionOptions.map(option => (
        <label
          key={option.id}
          htmlFor={option.id}
          className={`relative flex flex-col items-start justify-start p-5 rounded-lg border-2 transition-all duration-200 text-left ${
            selection === option.id
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
          } ${
            disabled
              ? 'cursor-not-allowed opacity-60'
              : 'cursor-pointer hover:border-primary-400 dark:hover:border-primary-500'
          }`}
        >
          <input
            type="radio"
            id={option.id}
            name="action"
            checked={selection === option.id}
            onChange={() => setSelection(option.id)}
            disabled={disabled}
            className="sr-only"
          />
          <div className="flex items-center">
            {React.cloneElement(option.icon, {
              className: `w-8 h-8 mr-4 ${selection === option.id ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`
            })}
            <span className="font-semibold text-gray-800 dark:text-gray-200">{option.label}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 pl-12">{option.description}</p>

           {selection === option.id && (
             <div className="absolute top-2 right-2 h-5 w-5 bg-primary-600 rounded-full flex items-center justify-center">
               <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
               </svg>
             </div>
           )}
        </label>
      ))}
    </div>
  );
};
