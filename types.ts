
export interface FolderSelection {
  promotions: boolean;
  social: boolean;
  junk: boolean;
}

export type ActionSelection = 'delete' | 'archive';

export interface EmailSummary {
  sender: string;
  subject: string;
  snippet: string;
  date: string;
}

export interface SecurityReport {
  title: string;
  details: string[];
}

export interface GeminiResponse {
  cleanupScript: string;
  functionName: string;
  emailSummary: EmailSummary[];
  securityReport: SecurityReport;
}
