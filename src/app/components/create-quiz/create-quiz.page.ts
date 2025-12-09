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
      type: ['multiple-choice', Validators.required]
    });

    this.questionForm = this.formBuilder.group({
      question: ['', [Validators.required, Validators.minLength(5)]],
      option1: ['', Validators.required],
      option2: ['', Validators.required],
      option3: [''],
      option4: [''],
      correctAnswer: ['', Validators.required],
      answerText: [''],
      answerList: ['']
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Ensure validators reflect current quiz type when form is shown/changed
    this.applyQuestionTypeValidators(this.quizForm.value.type || 'multiple-choice');

    this.quizForm.get('type')?.valueChanges.subscribe((t) => {
      this.applyQuestionTypeValidators(t);
    });
  }

  private applyQuestionTypeValidators(type: string) {
    const opt1 = this.questionForm.get('option1');
    const opt2 = this.questionForm.get('option2');
    const opt3 = this.questionForm.get('option3');
    const opt4 = this.questionForm.get('option4');
    const correct = this.questionForm.get('correctAnswer');
    const answerText = this.questionForm.get('answerText');
    const answerList = this.questionForm.get('answerList');

    // clear validators first
    opt1?.clearValidators();
    opt2?.clearValidators();
    opt3?.clearValidators();
    opt4?.clearValidators();
    correct?.clearValidators();
    answerText?.clearValidators();
    answerList?.clearValidators();

    if (type === 'multiple-choice' || type === 'true-false') {
      if (type === 'multiple-choice') {
        // require all four options for multiple choice
        opt1?.setValidators([Validators.required]);
        opt2?.setValidators([Validators.required]);
        opt3?.setValidators([Validators.required]);
        opt4?.setValidators([Validators.required]);
        correct?.setValidators([Validators.required]);
      } else {
        // true-false: we auto-fill the options and don't require user inputs
        opt1?.clearValidators();
        opt2?.clearValidators();
        opt3?.clearValidators();
        opt4?.clearValidators();
        // set default values for TF options so the form is valid without user typing
        this.questionForm.get('option1')?.setValue('True');
        this.questionForm.get('option2')?.setValue('False');
        correct?.setValidators([Validators.required]);
      }
    } else if (type === 'identification' || type === 'fill-in-blank') {
      answerText?.setValidators([Validators.required, Validators.minLength(1)]);
    } else if (type === 'enumeration') {
      answerList?.setValidators([Validators.required, Validators.minLength(1)]);
    }

    opt1?.updateValueAndValidity();
    opt2?.updateValueAndValidity();
    opt3?.updateValueAndValidity();
    opt4?.updateValueAndValidity();
    correct?.updateValueAndValidity();
    answerText?.updateValueAndValidity();
    answerList?.updateValueAndValidity();
  }

  addQuestion(): void {
    if (this.questionForm.invalid) {
      this.showToast('Please fill all question fields');
      return;
    }

    const formValue = this.questionForm.value;
    const qType = this.quizForm.value.type || 'multiple-choice';

    let newQuestion: Question;

    if (qType === 'multiple-choice' || qType === 'true-false') {
      const correctAnswerNum = Number(formValue.correctAnswer);
      const maxOpt = qType === 'true-false' ? 2 : 4;
      if (isNaN(correctAnswerNum) || correctAnswerNum < 1 || correctAnswerNum > maxOpt) {
        this.showToast(`Correct answer must be between 1 and ${maxOpt}`);
        return;
      }
      const options = qType === 'true-false'
        ? ['True', 'False']
        : [formValue.option1, formValue.option2, formValue.option3, formValue.option4];

      newQuestion = {
        id: Date.now(),
        question: formValue.question,
        options,
        correctAnswer: correctAnswerNum - 1,
        quizId: 0,
        type: qType
      } as Question;
    } else if (qType === 'identification' || qType === 'fill-in-blank') {
      const answer = (formValue.answerText || '').trim();
      if (!answer) {
        this.showToast('Please provide the correct answer');
        return;
      }

      newQuestion = {
        id: Date.now(),
        question: formValue.question,
        correctAnswer: answer,
        quizId: 0,
        type: qType
      } as Question;
    } else if (qType === 'enumeration') {
      const list = (formValue.answerList || '').split(',').map((s: string) => s.trim()).filter((s: string) => s);
      if (!list.length) {
        this.showToast('Please provide at least one correct item (comma separated)');
        return;
      }

      newQuestion = {
        id: Date.now(),
        question: formValue.question,
        correctAnswers: list,
        quizId: 0,
        type: qType
      } as Question;
    } else {
      this.showToast('Unsupported question type');
      return;
    }

    this.questions.push(newQuestion);
    // reset the question form safely
    this.questionForm.reset();
    // clear option values
    this.questionForm.patchValue({ option1: '', option2: '', option3: '', option4: '', correctAnswer: '' });
    this.showToast('Question added successfully');
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  editQuestion(index: number): void {
    const question = this.questions[index];
    // populate form depending on question type
    const qType = question.type || 'multiple-choice';
    const patch: any = { question: question.question, type: qType };

    if (qType === 'multiple-choice' || qType === 'true-false') {
      patch.option1 = question.options?.[0] ?? '';
      patch.option2 = question.options?.[1] ?? '';
      patch.option3 = question.options?.[2] ?? '';
      patch.option4 = question.options?.[3] ?? '';
      patch.correctAnswer = question.correctAnswer !== undefined ? String(Number(question.correctAnswer) + 1) : '';
    } else if (qType === 'identification' || qType === 'fill-in-blank') {
      patch.answerText = typeof question.correctAnswer === 'string' ? question.correctAnswer : '';
    } else if (qType === 'enumeration') {
      patch.answerList = (question.correctAnswers || []).join(', ');
    }

    this.questionForm.patchValue(patch);
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
      type: this.quizForm.value.type,
      questions: this.questions.map(q => ({
        ...q,
        correctAnswer: typeof q.correctAnswer !== 'undefined' ? Number(q.correctAnswer as any) : undefined // Ensure it's a number when present
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