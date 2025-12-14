import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsCardComponent } from './subjects-card.component';

describe('SubjectsCardComponent', () => {
  let component: SubjectsCardComponent;
  let fixture: ComponentFixture<SubjectsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
