import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TakeQuizPage } from './take-quiz.page';

const routes: Routes = [
  {
    path: ':id',  // Changed from '' to ':id'
    component: TakeQuizPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TakeQuizPageRoutingModule {}