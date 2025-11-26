import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'quiz-list',
    loadChildren: () => import('./components/quiz-list/quiz-list.module').then( m => m.QuizListPageModule)
  },
  {
    path: 'create-quiz',
    loadChildren: () => import('./components/create-quiz/create-quiz.module').then( m => m.CreateQuizPageModule)
  },
  {
    path: 'take-quiz',
    loadChildren: () => import('./components/take-quiz/take-quiz.module').then( m => m.TakeQuizPageModule)
  },
  {
    path: 'quiz-results',
    loadChildren: () => import('./components/quiz-results/quiz-results.module').then( m => m.QuizResultsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
