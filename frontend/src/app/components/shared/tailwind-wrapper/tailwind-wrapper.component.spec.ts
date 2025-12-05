import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailwindWrapperComponent } from './tailwind-wrapper.component';

describe('TailwindWrapperComponent', () => {
  let component: TailwindWrapperComponent;
  let fixture: ComponentFixture<TailwindWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TailwindWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
