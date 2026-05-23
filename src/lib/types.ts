export interface ResumeAnalysis {
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  tips: string[];
  questions: string[];
}

export interface InterviewFeedback {
  score: number;
  feedback: string;
  betterAnswer: string;
}

export interface AnalysisRecord {
  id: string;
  user_id: string;
  file_name: string;
  ats_score: number;
  summary: string; // Stored as JSON string containing ResumeAnalysis
  created_at: string;
}
