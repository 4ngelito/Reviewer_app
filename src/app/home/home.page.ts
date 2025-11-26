import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from '../services/quiz';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class HomePage implements OnInit {
  totalQuizzes = 0;
  totalResults = 0;

  constructor(private router: Router, private quizService: QuizService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.quizService.getQuizzes().subscribe(
      (quizzes) => (this.totalQuizzes = quizzes.length),
      (error) => console.error('Error loading quizzes:', error)
    );

    this.quizService.getResults().subscribe(
      (results) => (this.totalResults = results.length),
      (error) => console.error('Error loading results:', error)
    );
  }

  goToCreateQuiz(): void {
    this.router.navigate(['/create-quiz']);
  }

  goToQuizList(): void {
    this.router.navigate(['/quiz-list']);
  }

  goToResults(): void {
    this.router.navigate(['/quiz-results']);
  }
}
