import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController, IonicModule } from '@ionic/angular';
import { QuizService } from '../../services/quiz';
import { Question, Quiz } from '../../models/quiz';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.page.html',
  styleUrls: ['./create-quiz.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class CreateQuizPage implements OnInit {
  quizForm: FormGroup;
  questionForm: FormGroup;
  questions: Question[] = [];
  showQuestionForm = false;
  isSubmitting = false;
  String = String;

  constructor(
    private formBuilder: FormBuilder,
    private quizService: QuizService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.quizForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
    });

    this.questionForm = this.formBuilder.group({
      question: ['', [Validators.required, Validators.minLength(5)]],
      option1: ['', Validators.required],
      option2: ['', Validators.required],
      option3: ['', Validators.required],
      option4: ['', Validators.required],
      correctAnswer: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  addQuestion(): void {
    if (this.questionForm.invalid) {
      this.showToast('Please fill all question fields');
      return;
    }

    const formValue = this.questionForm.value;
    
    // Convert correctAnswer to number and validate
    const correctAnswerNum = Number(formValue.correctAnswer);
    
    if (isNaN(correctAnswerNum) || correctAnswerNum < 1 || correctAnswerNum > 4) {
      this.showToast('Correct answer must be between 1 and 4');
      return;
    }

    const newQuestion: Question = {
      id: this.questions.length + 1,
      question: formValue.question,
      options: [
        formValue.option1,
        formValue.option2,
        formValue.option3,
        formValue.option4,
      ],
      correctAnswer: correctAnswerNum - 1, // Convert to 0-based index
      quizId: 0,
    };

    this.questions.push(newQuestion);
    this.questionForm.reset();
    this.showToast('Question added successfully');
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  editQuestion(index: number): void {
    const question = this.questions[index];
    this.questionForm.patchValue({
      question: question.question,
      option1: question.options[0],
      option2: question.options[1],
      option3: question.options[2],
      option4: question.options[3],
      correctAnswer: String(question.correctAnswer + 1), // Convert back to 1-based
    });
    this.removeQuestion(index);
    window.scrollTo(0, 0);
  }

  async submitQuiz(): Promise<void> {
    if (this.quizForm.invalid) {
      this.showToast('Please fill quiz details (Title and Description)');
      return;
    }

    if (this.questions.length === 0) {
      this.showToast('Please add at least one question');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creating quiz...',
    });
    await loading.present();

    const quizData: Omit<Quiz, 'id'> = {
      title: this.quizForm.value.title,
      description: this.quizForm.value.description,
      questions: this.questions.map(q => ({
        ...q,
        correctAnswer: Number(q.correctAnswer) // Ensure it's a number
      })),
      createdAt: new Date(),
    };

    console.log('Submitting quiz data:', JSON.stringify(quizData, null, 2));

    this.quizService.createQuiz(quizData).subscribe(
      async (response) => {
        await loading.dismiss();
        console.log('Quiz created successfully:', response);
        this.showToast('Quiz created successfully!');
        this.quizForm.reset();
        this.questions = [];
        this.showQuestionForm = false;
        setTimeout(() => {
          this.router.navigate(['/quiz-list']);
        }, 1000);
      },
      async (error) => {
        await loading.dismiss();
        console.error('Error creating quiz:', error);
        
        let errorMessage = 'Error creating quiz. Please try again.';
        
        if (error.status === 400) {
          errorMessage = error.error?.error || 'Invalid quiz data';
        } else if (error.status === 500) {
          errorMessage = error.error?.details || 'Server error occurred';
        } else if (error.status === 0) {
          errorMessage = 'Cannot connect to server. Is the backend running?';
        }
        
        this.showToast(errorMessage);
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/home']);
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