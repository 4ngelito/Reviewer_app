import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Quiz, QuizResult, Question } from '../models/quiz';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = environment.apiUrl;
  
  private quizzesSubject = new BehaviorSubject<Quiz[]>([]);
  public quizzes$ = this.quizzesSubject.asObservable();

  private resultsSubject = new BehaviorSubject<QuizResult[]>([]);
  public results$ = this.resultsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadQuizzes();
    this.loadResults();
  }

  // Load all quizzes
  loadQuizzes(): void {
    this.http.get<Quiz[]>(`${this.apiUrl}/quizzes`).subscribe(
      (data) => this.quizzesSubject.next(data),
      (error) => console.error('Error loading quizzes:', error)
    );
  }

  // Get all quizzes
  getQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.apiUrl}/quizzes`);
  }

  // Get quiz by ID
  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/quizzes/${id}`);
  }

  // Create new quiz
  createQuiz(quiz: Omit<Quiz, 'id'>): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.apiUrl}/quizzes`, quiz);
  }

  // Update quiz
  updateQuiz(id: number, quiz: Partial<Quiz>): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.apiUrl}/quizzes/${id}`, quiz);
  }

  // Delete quiz
  deleteQuiz(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/quizzes/${id}`);
  }

  // Add question to quiz
  addQuestion(quizId: number, question: Omit<Question, 'id'>): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/quizzes/${quizId}/questions`, question);
  }

  // Submit quiz answers
  submitQuizAnswers(quizId: number, answers: any[]): Observable<QuizResult> {
    return this.http.post<QuizResult>(`${this.apiUrl}/quizzes/${quizId}/submit`, {
      answers,
    });
  }

  // Load all results
  loadResults(): void {
    this.http.get<QuizResult[]>(`${this.apiUrl}/results`).subscribe(
      (data) => this.resultsSubject.next(data),
      (error) => console.error('Error loading results:', error)
    );
  }

  // Get all results
  getResults(): Observable<QuizResult[]> {
    return this.http.get<QuizResult[]>(`${this.apiUrl}/results`);
  }

  // Get results for specific quiz
  getQuizResults(quizId: number): Observable<QuizResult[]> {
    return this.http.get<QuizResult[]>(`${this.apiUrl}/quizzes/${quizId}/results`);
  }
}
