import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TakeQuizPage } from './take-quiz.page';

describe('TakeQuizPage', () => {
  let component: TakeQuizPage;
  let fixture: ComponentFixture<TakeQuizPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeQuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
