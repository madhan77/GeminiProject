
import { GoogleGenAI } from "@google/genai";
import type { FolderSelection, ActionSelection, GeminiResponse } from '../types';

const getSelectedFolders = (selection: FolderSelection): string[] => {
    const folders = [];
    if (selection.promotions) folders.push("Promotions");
    if (selection.social) folders.push("Social");
    if (selection.junk) folders.push("Junk/Spam");
    return folders;
}

const generatePrompt = (folders: string[], action: ActionSelection, email: string): string => {
    const folderList = folders.join(', ');
    const actionVerb = action === 'delete' ? 'delete' : 'archive';
    const actionDescription = action === 'delete' ? 'moves them to the trash' : 'archives them';

    return `
Generate a Google Apps Script to clean up a Gmail inbox. The user's email is ${email}.
The script should target emails in the following categories/tabs: ${folderList}.
The action to perform is: ${actionVerb}.

The output must be a single, valid JSON object with the following structure and no other text or formatting:
{
  "cleanupScript": "A string containing the full Google Apps Script code. The main function must be named 'cleanGmailInbox'. The script should find all threads in the specified categories and ${actionDescription}. It should log the number of threads processed.",
  "functionName": "The name of the main function in the script, which must be 'cleanGmailInbox'.",
  "emailSummary": [
    { "sender": "Example Sender", "subject": "Example Subject", "snippet": "A brief example snippet of an email that would be affected.", "date": "A recent example date in ISO format." }
  ],
  "securityReport": {
    "title": "Script is safe to run.",
    "details": [
      "A brief explanation of what the script does.",
      "A point about not accessing or storing personal data.",
      "A point about only performing the requested action (${actionVerb})."
    ]
  }
}

- The 'emailSummary' should contain 3-5 realistic but entirely fictional examples of emails that would be targeted by this script. Use generic names like 'Newsletter Co', 'Social Site', 'Online Store'.
- The 'securityReport' should provide a concise, positive summary of the script's safety, reassuring the user.
- The Google Apps Script must be complete, functional, and ready to run. It should use the GmailApp service.
- For finding emails in categories like 'Promotions' or 'Social', use the query 'category:[category_name]'. For 'Junk/Spam', use 'in:spam'.
`;
}

export const generateScriptAndReports = async (
    folderSelection: FolderSelection,
    actionSelection: ActionSelection,
    email: string,
): Promise<GeminiResponse> => {
    // A new GoogleGenAI instance should be created for each call to ensure it uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const selectedFolders = getSelectedFolders(folderSelection);
    if (selectedFolders.length === 0) {
        throw new Error("Please select at least one folder to clean up.");
    }
    
    const prompt = generatePrompt(selectedFolders, actionSelection, email);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    try {
        const jsonText = response.text.trim();
        const parsedResponse: GeminiResponse = JSON.parse(jsonText);
        return parsedResponse;
    } catch (e) {
        console.error("Failed to parse Gemini response as JSON:", response.text);
        throw new Error("Failed to get a valid response from the AI. The response was not valid JSON.");
    }
};
