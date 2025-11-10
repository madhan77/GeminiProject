
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


export const generateCleanupScript = async (folders: string[]): Promise<string> => {
    // This check is for developer convenience and should be handled in UI
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        throw new Error("API key is not configured.");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
    const folderQueries = folders.map(folder => {
        if (folder.toLowerCase() === 'junk') {
            return `category:spam`;
        }
        return `category:${folder.toLowerCase()}`;
    });
    
    const folderListString = folders.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ');

    const prompt = `
You are an expert Google Apps Script developer. Generate a complete, single-file Google Apps Script that can be run directly by a user.
The script should perform the following actions:
1. Identify and permanently delete all email threads from the following Gmail categories: ${folderListString}. The corresponding Gmail search queries are: ${folderQueries.join(' and ')}.
2. The script must process emails in batches of 100 to avoid exceeding Google's execution time limits. It should continue processing batches until all matching threads in the specified categories are deleted.
3. For each category, log the total number of threads deleted to the Apps Script logger. The log message should be clear, e.g., "Deleted X threads from Promotions."
4. The main function to be run by the user must be named 'cleanGmailFolders'.
5. Do not include any placeholder functions or comments asking the user to fill in code. The script must be fully functional and self-contained.

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
   