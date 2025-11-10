
import { GoogleGenAI } from "@google/genai";

const cleanCodeBlock = (text: string): string => {
  const lines = text.split('\n');
  if (lines[0].includes('```')) {
    lines.shift();
  }
  if (lines[lines.length - 1].includes('```')) {
    lines.pop();
  }
  return lines.join('\n').trim();
};

export type ScriptMode = 'preview' | 'delete';

export const generateScript = async (folders: string[], mode: ScriptMode): Promise<string> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        throw new Error("API key is not configured.");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
    const folderQueries = folders.map(folder => {
        if (folder.toLowerCase() === 'junk') {
            return `in:spam`;
        }
        return `category:${folder.toLowerCase()}`;
    });
    
    const folderListString = folders.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ');

    const actionDescription = mode === 'preview'
      ? `1. Identify and COUNT the number of email threads in the following Gmail categories: ${folderListString}.
2. For each category, log the total number of threads that WOULD be deleted. The log message should be clear, e.g., "Found X threads in Promotions."
3. The script must NOT delete any emails. It is for preview purposes only.`
      : `1. Identify and PERMANENTLY DELETE all email threads from the following Gmail categories: ${folderListString}.
2. The script must process emails in batches of 100 to avoid exceeding Google's execution time limits. It should continue processing batches until all matching threads in the specified categories are deleted.
3. For each category, log the total number of threads deleted to the Apps Script logger. The log message should be clear, e.g., "Deleted X threads from Promotions."`;

    const functionName = mode === 'preview' ? 'previewGmailCleanup' : 'cleanGmailFolders';
    const combinedQuery = folderQueries.map(q => `(${q})`).join(' OR ');

    const prompt = `
You are an expert Google Apps Script developer. Generate a complete, single-file Google Apps Script that can be run directly by a user.
The script should perform the following actions:
${actionDescription}
4. The main function to be run by the user must be named '${functionName}'.
5. The script should target emails using the following Gmail search query: '${combinedQuery}'.
6. Do not include any placeholder functions or comments asking the user to fill in code. The script must be fully functional and self-contained.

Provide ONLY the Google Apps Script code inside a single markdown code block. Do not add any introductory or concluding text outside the code block.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const scriptText = response.text;
        
        if (!scriptText) {
            throw new Error("Received an empty response from the API.");
        }
        
        return cleanCodeBlock(scriptText);
        
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate script via Gemini API.");
    }
};
