import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Quiz, QuizResult, Question, UserAnswer, QuizType, QuestionType } from '../models/quiz';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private quizzesSubject = new BehaviorSubject<Quiz[]>([]);
  public quizzes$ = this.quizzesSubject.asObservable();

  private resultsSubject = new BehaviorSubject<QuizResult[]>([]);
  public results$ = this.resultsSubject.asObservable();

  private readonly QUIZZES_KEY = 'quiz_reviewer_quizzes';
  private readonly RESULTS_KEY = 'quiz_reviewer_results';

  constructor() {
    this.loadQuizzes();
    this.loadResults();
  }

  // --- Storage helpers ---
  private saveQuizzesToStorage() {
    localStorage.setItem(this.QUIZZES_KEY, JSON.stringify(this.quizzesSubject.value));
  }

  private saveResultsToStorage() {
    localStorage.setItem(this.RESULTS_KEY, JSON.stringify(this.resultsSubject.value));
  }

  // --- Loaders ---
  loadQuizzes(): void {
    const raw = localStorage.getItem(this.QUIZZES_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as any[];
        const quizzes: Quiz[] = parsed.map(q => ({
          ...q,
          createdAt: q.createdAt ? new Date(q.createdAt) : new Date()
        }));
        this.quizzesSubject.next(quizzes);
        return;
      } catch (e) {
        console.error('Failed to parse stored quizzes:', e);
      }
    }
    this.quizzesSubject.next([]);
  }

  loadResults(): void {
    const raw = localStorage.getItem(this.RESULTS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as any[];
        const results: QuizResult[] = parsed.map(r => ({
          ...r,
          completedAt: r.completedAt ? new Date(r.completedAt) : new Date()
        }));
        this.resultsSubject.next(results);
        return;
      } catch (e) {
        console.error('Failed to parse stored results:', e);
      }
    }
    this.resultsSubject.next([]);
  }

  // --- Public API (keeps same signatures used by the app) ---
  getQuizzes(): Observable<Quiz[]> {
    return of(this.quizzesSubject.value);
  }

  getQuizById(id: number): Observable<Quiz> {
    const q = this.quizzesSubject.value.find(x => x.id === id);
    if (!q) return throwError(() => new Error('Quiz not found'));
    return of(q);
  }

  createQuiz(quiz: Omit<Quiz, 'id' | 'createdAt'>): Observable<Quiz> {
    const current = this.quizzesSubject.value.slice();
    const nextId = current.length ? Math.max(...current.map(q => q.id)) + 1 : 1;
    // ensure questions have ids
    const questions: Question[] = (quiz.questions || []).map((qq, idx) => ({
      id: Date.now() + idx,
      quizId: nextId,
      type: qq.type || (quiz.type as QuestionType) || 'multiple-choice',
      question: qq.question,
      options: qq.options ? qq.options.slice() : undefined,
      correctAnswer: (qq as any).correctAnswer,
      correctAnswers: (qq as any).correctAnswers
    } as Question));

    const newQuiz: Quiz = {
      id: nextId,
      title: quiz.title,
      description: quiz.description,
      questions,
      createdAt: new Date()
    };

    current.unshift(newQuiz);
    this.quizzesSubject.next(current);
    this.saveQuizzesToStorage();
    return of(newQuiz);
  }

  updateQuiz(id: number, patch: Partial<Quiz>): Observable<Quiz> {
    const current = this.quizzesSubject.value.slice();
    const idx = current.findIndex(q => q.id === id);
    if (idx === -1) return throwError(() => new Error('Quiz not found'));
    const updated: Quiz = { ...current[idx], ...patch } as Quiz;
    // keep Date object
    if (patch.createdAt) updated.createdAt = new Date(patch.createdAt as any);
    current[idx] = updated;
    this.quizzesSubject.next(current);
    this.saveQuizzesToStorage();
    return of(updated);
  }

  deleteQuiz(id: number): Observable<any> {
    const current = this.quizzesSubject.value.slice();
    const filtered = current.filter(q => q.id !== id);
    this.quizzesSubject.next(filtered);
    this.saveQuizzesToStorage();
    // Also remove related results
    const results = this.resultsSubject.value.filter(r => r.quizId !== id);
    this.resultsSubject.next(results);
    this.saveResultsToStorage();
    return of({ message: 'Quiz deleted' });
  }

  addQuestion(quizId: number, question: Omit<Question, 'id' | 'quizId'>): Observable<Question> {
    const current = this.quizzesSubject.value.slice();
    const idx = current.findIndex(q => q.id === quizId);
    if (idx === -1) return throwError(() => new Error('Quiz not found'));
    const newQuestion: Question = {
      id: Date.now(),
      quizId,
      type: question.type || current[idx].type || 'multiple-choice',
      question: question.question,
      options: question.options ? question.options.slice() : undefined,
      correctAnswer: (question as any).correctAnswer,
      correctAnswers: (question as any).correctAnswers
    };
    current[idx].questions.push(newQuestion);
    this.quizzesSubject.next(current);
    this.saveQuizzesToStorage();
    return of(newQuestion);
  }

  submitQuizAnswers(quizId: number, answers: { answer: any }[]): Observable<QuizResult> {
    const quiz = this.quizzesSubject.value.find(q => q.id === quizId);
    if (!quiz) return throwError(() => new Error('Quiz not found'));
    const questions = quiz.questions;
    let score = 0;
    const userAnswers: UserAnswer[] = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const qType: QuestionType = (q.type as QuestionType) || (quiz.type as QuestionType) || 'multiple-choice';
      const rawUser = answers[i] ? answers[i].answer : null;
      let isCorrect = false;

      if (qType === 'multiple-choice' || qType === 'true-false') {
        // correctAnswer expected as index or string
        if (typeof q.correctAnswer === 'number' && typeof rawUser === 'number') {
          isCorrect = rawUser === q.correctAnswer;
        } else if (typeof q.correctAnswer === 'string' && typeof rawUser === 'string') {
          isCorrect = rawUser.trim().toLowerCase() === (q.correctAnswer as string).trim().toLowerCase();
        }
      } else if (qType === 'identification' || qType === 'fill-in-blank') {
        if (typeof q.correctAnswer === 'string' && typeof rawUser === 'string') {
          isCorrect = rawUser.trim().toLowerCase() === (q.correctAnswer as string).trim().toLowerCase();
        }
      } else if (qType === 'enumeration') {
        // correctAnswers: string[] ; rawUser: string[]
        const required = (q.correctAnswers || []).map(s => s.trim().toLowerCase());
        const provided = Array.isArray(rawUser) ? rawUser.map((s: any) => ('' + s).trim().toLowerCase()) : [];
        // check that every required item is present in provided
        isCorrect = required.length > 0 && required.every(r => provided.includes(r));
      }

      if (isCorrect) score++;

      userAnswers.push({
        questionId: q.id,
        question: q.question,
        userAnswer: rawUser,
        correctAnswer: typeof q.correctAnswer !== 'undefined' ? q.correctAnswer : undefined,
        correctAnswers: q.correctAnswers,
        isCorrect
      });
    }

    const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;
    const nextId = this.resultsSubject.value.length ? Math.max(...this.resultsSubject.value.map(r => r.id)) + 1 : 1;

    const result: QuizResult = {
      id: nextId,
      quizId: quiz.id,
      quizTitle: quiz.title,
      score,
      totalQuestions: questions.length,
      percentage,
      completedAt: new Date(),
      answers: userAnswers
    };

    const all = this.resultsSubject.value.slice();
    all.unshift(result);
    this.resultsSubject.next(all);
    this.saveResultsToStorage();
    return of(result);
  }

  // Delete a single result by id
  deleteResult(resultId: number): Observable<any> {
    const all = this.resultsSubject.value.filter(r => r.id !== resultId);
    this.resultsSubject.next(all);
    this.saveResultsToStorage();
    return of({ message: 'Result deleted' });
  }

  getResults(): Observable<QuizResult[]> {
    return of(this.resultsSubject.value);
  }

  getQuizResults(quizId: number): Observable<QuizResult[]> {
    return of(this.resultsSubject.value.filter(r => r.quizId === quizId));
  }
}
