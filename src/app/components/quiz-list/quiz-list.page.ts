import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, IonicModule, AlertController } from '@ionic/angular';
import { QuizService } from '../../services/quiz';
import { Quiz } from '../../models/quiz';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.page.html',
  styleUrls: ['./quiz-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class QuizListPage implements OnInit {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  isLoading = false;
  searchQuery = '';

  constructor(
    private quizService: QuizService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
    , private alertController: AlertController
  ) {}

  async confirmDelete(quizId: number): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Delete Quiz',
      message: 'Are you sure you want to delete this quiz? This action cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          cssClass: 'danger',
          handler: () => {
            this.deleteQuiz(quizId);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteQuiz(quizId: number): void {
    this.quizService.deleteQuiz(quizId).subscribe(
      () => {
        this.showToast('Quiz deleted');
        this.loadQuizzes();
      },
      (err) => {
        console.error('Error deleting quiz', err);
        this.showToast('Failed to delete quiz');
      }
    );
  }

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.isLoading = true;
    this.quizService.getQuizzes().subscribe(
      (quizzes) => {
        this.quizzes = quizzes;
        this.filteredQuizzes = quizzes;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading quizzes:', error);
        this.isLoading = false;
        this.showToast('Error loading quizzes');
      }
    );
  }

  searchQuizzes(event: any): void {
    const query = event.detail.value.toLowerCase();
    this.searchQuery = query;

    if (query.trim() === '') {
      this.filteredQuizzes = this.quizzes;
    } else {
      this.filteredQuizzes = this.quizzes.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(query) ||
          quiz.description.toLowerCase().includes(query)
      );
    }
  }

  startQuiz(quiz: Quiz): void {
    this.router.navigate(['/take-quiz', quiz.id], {
      state: { quiz },
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  refreshQuizzes(): void {
    this.loadQuizzes();
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}
