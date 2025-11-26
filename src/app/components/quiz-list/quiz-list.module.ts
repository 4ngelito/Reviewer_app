import { NgModule } from '@angular/core';
import { QuizListPageRoutingModule } from './quiz-list-routing.module';
import { QuizListPage } from './quiz-list.page';

@NgModule({
  imports: [
    QuizListPageRoutingModule,
    QuizListPage
  ]
})
export class QuizListPageModule {}
