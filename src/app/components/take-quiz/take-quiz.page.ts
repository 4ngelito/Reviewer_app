import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController, IonicModule } from '@ionic/angular';
import { QuizService } from '../../services/quiz';
import { Quiz, Question } from '../../models/quiz';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-take-quiz',
  templateUrl: './take-quiz.page.html',
  styleUrls: ['./take-quiz.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class TakeQuizPage implements OnInit {
  quiz: Quiz | null = null;
  currentQuestionIndex = 0;
  userAnswers: any[] = [];
  isQuizSubmitted = false;
  isLoading = false;
  String = String;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.loadQuiz();
  }

  loadQuiz(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['quiz']) {
      this.quiz = navigation.extras.state['quiz'];
      this.initializeAnswers();
    } else {
      const quizId = this.route.snapshot.paramMap.get('id');
      if (quizId) {
        this.isLoading = true;
        this.quizService.getQuizById(Number(quizId)).subscribe(
          (quiz) => {
            this.quiz = quiz;
            this.initializeAnswers();
            this.isLoading = false;
          },
          (error) => {
            console.error('Error loading quiz:', error);
            this.isLoading = false;
            this.showToast('Error loading quiz');
          }
        );
      }
    }
  }

  initializeAnswers(): void {
    if (this.quiz) {
      // initialize with nulls; each entry may be number, string, or string[] depending on question type
      this.userAnswers = new Array(this.quiz.questions.length).fill(null);
    }
  }

  getCurrentQuestion(): Question | undefined {
    return this.quiz?.questions[this.currentQuestionIndex];
  }

  selectAnswer(optionIndex: number): void {
    this.userAnswers[this.currentQuestionIndex] = optionIndex;
  }

  // for binding in template
  isAnswerSelected(optionIndex: number): boolean {
    return this.userAnswers[this.currentQuestionIndex] === optionIndex;
  }

  setTextAnswer(value: string): void {
    this.userAnswers[this.currentQuestionIndex] = value;
  }

  setEnumerationAnswer(value: string): void {
    // store as array of trimmed strings
    const list = value.split(',').map(s => s.trim()).filter(s => s.length);
    this.userAnswers[this.currentQuestionIndex] = list;
  }

  nextQuestion(): void {
    if (
      this.quiz &&
      this.currentQuestionIndex < this.quiz.questions.length - 1
    ) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  getProgressPercentage(): number {
    if (!this.quiz) return 0;
    return (
      ((this.currentQuestionIndex + 1) / this.quiz.questions.length) * 100
    );
  }

  async submitQuiz(): Promise<void> {
    // Check if all questions are answered
    const unanswered = this.userAnswers.some((answer) => answer === -1);
    if (unanswered) {
      const alert = await this.alertController.create({
        header: 'Unanswered Questions',
        message: 'You have not answered all questions. Continue anyway?',
        buttons: [
          {
            text: 'Continue',
            handler: () => this.completeSubmission(),
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      });
      await alert.present();
    } else {
      this.completeSubmission();
    }
  }

  private async completeSubmission(): Promise<void> {
    if (!this.quiz) return;

    const loading = await this.loadingController.create({
      message: 'Submitting quiz...',
    });
    await loading.present();

    // Build answers payload matching QuizService expectations
    const answers = this.userAnswers.map((answer, index) => ({
      questionId: this.quiz!.questions[index].id,
      answer,
    }));

    this.quizService.submitQuizAnswers(this.quiz.id, answers).subscribe(
      async (result) => {
        await loading.dismiss();
        this.isQuizSubmitted = true;
        this.showToast('Quiz submitted successfully!');
        setTimeout(() => {
          this.router.navigate(['/quiz-results'], {
            state: { result },
          });
        }, 1500);
      },
      async (error) => {
        await loading.dismiss();
        console.error('Error submitting quiz:', error);
        // Show result anyway with local calculation
        this.calculateAndShowResult();
      }
    );
  }

  private calculateAndShowResult(): void {
    if (!this.quiz) return;

    let score = 0;
    this.userAnswers.forEach((answer, index) => {
      if (
        answer === this.quiz!.questions[index].correctAnswer
      ) {
        score++;
      }
    });

    const percentage = (score / this.quiz.questions.length) * 100;
    this.router.navigate(['/quiz-results'], {
      state: {
        result: {
          quizId: this.quiz.id,
          quizTitle: this.quiz.title,
          score,
          totalQuestions: this.quiz.questions.length,
          percentage: Math.round(percentage),
          completedAt: new Date(),
        },
      },
    });
  }

  goBack(): void {
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
