import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, IonicModule, AlertController } from '@ionic/angular';
import { QuizService } from '../../services/quiz';
import { QuizResult } from '../../models/quiz';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.page.html',
  styleUrls: ['./quiz-results.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class QuizResultsPage implements OnInit {
  allResults: QuizResult[] = [];
  selectedResult: QuizResult | null = null;
  isLoading = false;
  showResultDetails = false;

  constructor(
    private router: Router,
    private quizService: QuizService,
    private loadingController: LoadingController,
    private toastController: ToastController
    , private alertController: AlertController
  ) {}

  async confirmDeleteResult(resultId: number): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Delete Result',
      message: 'Are you sure you want to delete this result? This action cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          cssClass: 'danger',
          handler: () => {
            this.deleteResult(resultId);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteResult(resultId: number): void {
    this.quizService.deleteResult(resultId).subscribe(
      () => {
        this.showToast('Result deleted');
        this.loadResults();
        this.showResultDetails = false;
      },
      (err) => {
        console.error('Error deleting result', err);
        this.showToast('Failed to delete result');
      }
    );
  }

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    this.isLoading = true;
    this.quizService.getResults().subscribe(
      (results) => {
        this.allResults = results.sort(
          (a, b) =>
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime()
        );
        this.isLoading = false;

        // Check if navigating from take-quiz with a new result
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state?.['result']) {
          this.selectedResult = navigation.extras.state['result'];
          this.showResultDetails = true;
        }
      },
      (error) => {
        console.error('Error loading results:', error);
        this.isLoading = false;
        this.showToast('Error loading results');
      }
    );
  }

  selectResult(result: QuizResult): void {
    this.selectedResult = result;
    this.showResultDetails = true;
  }

  getResultColor(percentage: number): string {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  }

  getResultMessage(percentage: number): string {
    if (percentage >= 90) return 'Outstanding! 🌟';
    if (percentage >= 80) return 'Great! 👏';
    if (percentage >= 70) return 'Good 👍';
    if (percentage >= 60) return 'Fair 📚';
    return 'Keep Practicing 💪';
  }

  getGradeIcon(percentage: number): string {
    if (percentage >= 90) return 'star';
    if (percentage >= 80) return 'trophy';
    if (percentage >= 70) return 'thumbs-up';
    if (percentage >= 60) return 'school';
    return 'flame';
  }

  closeResultDetails(): void {
    this.showResultDetails = false;
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  goToQuizList(): void {
    this.router.navigate(['/quiz-list']);
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
