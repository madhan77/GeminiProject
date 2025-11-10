
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FolderSelector } from './components/FolderSelector';
import { ScriptDisplay } from './components/ScriptDisplay';
import { Instructions } from './components/Instructions';
import { generateScript } from './services/geminiService';
import type { FolderSelection } from './types';
import { SparklesIcon, AlertTriangleIcon, CheckCircleIcon, Trash2Icon } from './components/Icons';

type AppStep = 'initial' | 'preview_generated' | 'final_generated';

const App: React.FC = () => {
  const [folderSelection, setFolderSelection] = useState<FolderSelection>({
    promotions: true,
    social: true,
    junk: false,
  });

  const [appStep, setAppStep] = useState<AppStep>('initial');
  const [previewScript, setPreviewScript] = useState<string>('');
  const [finalScript, setFinalScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getSelectedFolders = useCallback(() => {
    return Object.entries(folderSelection)
      .filter(([, isSelected]) => isSelected)
      .map(([folderName]) => folderName);
  }, [folderSelection]);

  const handleGeneratePreview = useCallback(async () => {
    const selectedFolders = getSelectedFolders();
    if (selectedFolders.length === 0) {
      setError('Please select at least one folder to preview.');
      return;
    }
    setIsLoading(true);
    setError('');
    setPreviewScript('');
    try {
      const script = await generateScript(selectedFolders, 'preview');
      setPreviewScript(script);
      setAppStep('preview_generated');
    } catch (err) {
      setError('Failed to generate preview script. Please ensure your Gemini API key is configured correctly and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [getSelectedFolders]);

  const handleGenerateFinal = useCallback(async () => {
    const selectedFolders = getSelectedFolders();
    if (selectedFolders.length === 0) {
      setError('Cannot generate script, no folders are selected.');
      return;
    }
    setIsLoading(true);
    setError('');
    setFinalScript('');
    try {
      const script = await generateScript(selectedFolders, 'delete');
      setFinalScript(script);
      setAppStep('final_generated');
    } catch (err) {
      setError('Failed to generate deletion script. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [getSelectedFolders]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Select Folders</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Choose which email categories you want to clean up.</p>
          </div>
          
          <FolderSelector selection={folderSelection} setSelection={setFolderSelection} disabled={appStep !== 'initial'} />

          {appStep === 'initial' && (
            <div className="mt-8 text-center">
              <button
                onClick={handleGeneratePreview}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="mr-2 h-5 w-5" />
                    Generate Preview Script
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-3 text-red-500"/>
              <span>{error}</span>
            </div>
          )}
        </div>

        {appStep === 'preview_generated' && (
           <div className="mt-12 space-y-12">
            <div className="bg-blue-50 dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-blue-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">2. Run Preview Script</h2>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-6">This script is safe. It will only COUNT your emails and will NOT delete anything. Run this script and check the 'Execution log' to see how many emails will be affected.</p>
                <ScriptDisplay script={previewScript} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">3. Ready to Clean?</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">If you are happy with the preview counts, generate the final script to permanently delete the emails.</p>
                <div className="mt-6">
                   <button
                    onClick={handleGenerateFinal}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                   >
                     {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                     ) : (
                       <> <Trash2Icon className="mr-2 h-5 w-5" /> Generate Deletion Script </>
                     )}
                   </button>
                </div>
              </div>
            </div>
            <Instructions title="How to Use the Preview Script" functionName="previewGmailCleanup" />
          </div>
        )}

        {appStep === 'final_generated' && finalScript && (
           <div className="mt-12 space-y-12">
            <div className="bg-red-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-2xl shadow-lg border border-red-200 dark:border-red-600">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">4. Run Final Deletion Script</h2>
                <div className="flex items-center justify-center p-3 mb-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-lg">
                    <AlertTriangleIcon className="h-5 w-5 mr-3"/>
                    <strong>Warning:</strong> This action is permanent and cannot be undone.
                </div>
                <ScriptDisplay script={finalScript} />
            </div>
            <Instructions title="How to Use the Deletion Script" functionName="cleanGmailFolders" />
          </div>
        )}
      </main>
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Gmail Cleanup Script Generator. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
