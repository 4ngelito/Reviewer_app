import { NgModule } from '@angular/core';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    HomePageRoutingModule,
    HomePage
  ]
})
export class HomePageModule {}
