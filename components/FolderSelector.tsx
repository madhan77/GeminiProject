
import React from 'react';
import type { FolderSelection } from '../types';
import { TagIcon, UsersIcon, TrashIcon } from './Icons';

interface FolderSelectorProps {
  selection: FolderSelection;
  setSelection: React.Dispatch<React.SetStateAction<FolderSelection>>;
  disabled?: boolean;
}

const folderOptions = [
  { id: 'promotions', label: 'Promotions', icon: <TagIcon className="w-6 h-6" /> },
  { id: 'social', label: 'Social', icon: <UsersIcon className="w-6 h-6" /> },
  { id: 'junk', label: 'Junk / Spam', icon: <TrashIcon className="w-6 h-6" /> },
] as const;


export const FolderSelector: React.FC<FolderSelectorProps> = ({ selection, setSelection, disabled = false }) => {
  const handleToggle = (folder: keyof FolderSelection) => {
    setSelection(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {folderOptions.map(option => (
        <label
          key={option.id}
          htmlFor={option.id}
          className={`relative flex flex-col items-center justify-center p-5 rounded-lg border-2 transition-all duration-200 ${
            selection[option.id]
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
          } ${
            disabled
              ? 'cursor-not-allowed opacity-60'
              : 'cursor-pointer hover:border-primary-400 dark:hover:border-primary-500'
          }`}
        >
          <input
            type="checkbox"
            id={option.id}
            checked={selection[option.id]}
            onChange={() => handleToggle(option.id)}
            disabled={disabled}
            className="sr-only"
          />
          <div className="flex flex-col items-center">
            {React.cloneElement(option.icon, {
              className: `w-8 h-8 mb-2 ${selection[option.id] ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`
            })}
            <span className="font-semibold text-gray-800 dark:text-gray-200">{option.label}</span>
          </div>
           {selection[option.id] && (
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
