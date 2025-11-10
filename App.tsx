
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { EmailInput } from './components/EmailInput';
import { FolderSelector } from './components/FolderSelector';
import { ActionSelector } from './components/ActionSelector';
import { SummaryDisplay } from './components/SummaryDisplay';
import { SecurityReportDisplay } from './components/SecurityReportDisplay';
import { ScriptDisplay } from './components/ScriptDisplay';
import { Instructions } from './components/Instructions';
import { generateScriptAndReports } from './services/geminiService';
import type { FolderSelection, ActionSelection, GeminiResponse } from './types';

type AppStep = 'email' | 'config' | 'result';

function App() {
  const [step, setStep] = useState<AppStep>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [folderSelection, setFolderSelection] = useState<FolderSelection>({
    promotions: true,
    social: false,
    junk: false,
  });
  const [actionSelection, setActionSelection] = useState<ActionSelection>('delete');

  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse | null>(null);

  const handleEmailConfirm = (confirmedEmail: string) => {
    setEmail(confirmedEmail);
    setStep('config');
  };

  const handleGenerateScript = useCallback(async () => {
    const selectedFolders = Object.values(folderSelection).some(v => v);
    if (!selectedFolders) {
        setError('Please select at least one category to clean up.');
        return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeminiResponse(null);

    try {
      const response = await generateScriptAndReports(folderSelection, actionSelection, email);
      setGeminiResponse(response);
      setStep('result');
    } catch (err) {
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [folderSelection, actionSelection, email]);
  
  const handleReset = () => {
    setStep('email');
    setEmail('');
    setGeminiResponse(null);
    setError(null);
    setFolderSelection({ promotions: true, social: false, junk: false });
    setActionSelection('delete');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
            {step === 'email' && (
                <EmailInput onConfirm={handleEmailConfirm} isLoading={isLoading} />
            )}

            {step === 'config' && (
                <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-8">
                    <div>
                        <h2 className="text-xl font-bold text-center mb-1">Select Categories to Clean</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">Choose which Gmail categories you want to generate a cleanup script for.</p>
                        <FolderSelector selection={folderSelection} setSelection={setFolderSelection} disabled={isLoading} />
                    </div>
                    <hr className="border-gray-200 dark:border-gray-700"/>
                    <div>
                        <h2 className="text-xl font-bold text-center mb-1">Choose an Action</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">Select whether to permanently delete or archive the emails.</p>
                        <ActionSelector selection={actionSelection} setSelection={setActionSelection} disabled={isLoading}/>
                    </div>
                    <div className="pt-4">
                        <button
                            onClick={handleGenerateScript}
                            disabled={isLoading || !Object.values(folderSelection).some(v => v)}
                            className="flex w-full justify-center rounded-md bg-primary-600 px-3 py-4 text-base font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                             {isLoading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Script...
                              </>
                            ) : (
                              'Generate Cleanup Script'
                            )}
                        </button>
                    </div>
                </div>
            )}
            
            {error && (
                 <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                 </div>
            )}

            {step === 'result' && geminiResponse && (
                <div className="space-y-8">
                    <SummaryDisplay summary={geminiResponse.emailSummary} />
                    <SecurityReportDisplay report={geminiResponse.securityReport} />
                    <div>
                        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">Your Custom Script</h2>
                        <ScriptDisplay script={geminiResponse.cleanupScript} />
                    </div>
                    <Instructions 
                        title="How to Use Your Script"
                        functionName={geminiResponse.functionName}
                    />
                     <div className="text-center pt-4">
                        <button
                            onClick={handleReset}
                            className="rounded-md bg-gray-200 dark:bg-gray-700 px-6 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Start Over
                        </button>
                    </div>
                </div>
            )}

        </div>
      </main>
    </div>
  );
}

export default App;
