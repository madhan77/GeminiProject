
import React from 'react';

const steps = [
  {
    title: "Open Google Apps Script",
    description: "Go to script.google.com in a new browser tab. You may need to log in to your Google Account."
  },
  {
    title: "Create a New Project",
    description: "Click the '+ New project' button in the top-left corner to start a new script."
  },
  {
    title: "Paste the Code",
    description: "Delete any existing code in the editor (the `function myFunction() { ... }` block) and paste the script you copied from this page."
  },
  {
    title: "Save the Project",
    description: "Click the save icon (floppy disk) at the top. Give your project a name, like 'Gmail Cleaner', and click 'Rename'."
  },
  {
    title: "Run the Script",
    description: "With the `cleanGmailFolders` function selected in the dropdown menu, click the '▶️ Run' button."
  },
  {
    title: "Authorize the Script",
    description: "The first time you run it, a pop-up will ask for authorization. Follow the prompts: click 'Review permissions', choose your account, click 'Advanced', then 'Go to (your project name) (unsafe)', and finally 'Allow'. This is standard for personal scripts."
  },
  {
    title: "Check Execution Log",
    description: "The script will run and may take a few moments. You can view the 'Execution log' at the bottom to see how many email threads were deleted from each category."
  }
];

export const Instructions: React.FC = () => {
  return (
    <div className="mt-12 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">3. How to Use Your Script</h2>
      <ol className="space-y-6">
        {steps.map((step, index) => (
          <li key={index} className="flex">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
              {index + 1}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-300">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
   