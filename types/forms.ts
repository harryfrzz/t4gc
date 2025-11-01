// Form Types
export interface Form {
  id: number;
  formName: string;
  formDescription: string;
  userQuestions: Question[];
  shareableLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Question Types
export interface Question {
  id: number;
  questionText: string;
  questionType: QuestionType;
  required: boolean;
  options?: string[];
  order?: number;
}

export type QuestionType = 
  | 'SHORT_ANSWER'
  | 'PARAGRAPH'
  | 'MULTIPLE_CHOICE'
  | 'CHECKBOXES'
  | 'DROPDOWN';

// Response Types
export interface Response {
  id: number;
  questionId: number;
  responseText: string;
  submittedAt?: string;
}

export interface FormResponse {
  formId: number;
  responses: Response[];
  submittedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Form Builder State
export interface FormBuilderState {
  formName: string;
  formDescription: string;
  questions: Question[];
}

// Analytics Types
export interface FormAnalytics {
  totalResponses: number;
  questionStats: QuestionStats[];
}

export interface QuestionStats {
  questionId: number;
  questionText: string;
  responses: { [key: string]: number };
}