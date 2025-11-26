import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateQuizPage } from './create-quiz.page';

const routes: Routes = [
  {
    path: '',
    component: CreateQuizPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateQuizPageRoutingModule {}
