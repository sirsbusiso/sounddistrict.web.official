import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagAnimationComponent } from './bag-animation.component';

describe('BagAnimationComponent', () => {
  let component: BagAnimationComponent;
  let fixture: ComponentFixture<BagAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagAnimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
