export type QuizType =
  | 'multiple-choice'
  | 'identification'
  | 'enumeration'
  | 'true-false'
  | 'fill-in-blank';

export type QuestionType = QuizType;

export interface Question {
  id: number;
  quizId: number;
  type?: QuestionType; // if absent, defaults to quiz type or multiple-choice
  question: string;
  // For multiple-choice and true-false
  options?: string[];
  // For multiple-choice: index (number). For identification/fill-in-blank: string. Either may be used.
  correctAnswer?: number | string;
  // For enumeration: array of accepted answers
  correctAnswers?: string[];
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  type?: QuizType; // overall quiz type
  questions: Question[];
  createdAt: Date;
}

export interface UserAnswer {
  questionId: number;
  question: string;
  // can be index (number), text (string), or array of strings for enumeration
  userAnswer: number | string | string[];
  // mirror of correctAnswer(s)
  correctAnswer?: number | string;
  correctAnswers?: string[];
  isCorrect: boolean;
}

export interface QuizResult {
  id: number;
  quizId: number;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: Date;
  answers: UserAnswer[];
}
