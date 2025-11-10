
import React from 'react';
import type { SecurityReport } from '../types';
import { ShieldCheckIcon } from './Icons';

interface SecurityReportDisplayProps {
  report: SecurityReport;
}

export const SecurityReportDisplay: React.FC<SecurityReportDisplayProps> = ({ report }) => {
  if (!report) {
    return null;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-6">
        <ShieldCheckIcon className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Script Security Report</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          An automated analysis of the generated script to ensure its safety.
        </p>
      </div>
      <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-md">
        <h3 className="font-bold text-green-800 dark:text-green-200">{report.title}</h3>
        <ul className="mt-2 list-disc list-inside space-y-1 text-green-700 dark:text-green-300">
          {report.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
