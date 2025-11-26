export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  quizId: number;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
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

export interface UserAnswer {
  questionId: number;
  question: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
}
