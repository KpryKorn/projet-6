import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostIdPageComponent } from './post-id-page.component';

describe('PostIdPageComponent', () => {
  let component: PostIdPageComponent;
  let fixture: ComponentFixture<PostIdPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostIdPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostIdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
