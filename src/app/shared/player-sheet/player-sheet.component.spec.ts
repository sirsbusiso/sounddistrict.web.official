import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSheetComponent } from './player-sheet.component';

describe('PlayerSheetComponent', () => {
  let component: PlayerSheetComponent;
  let fixture: ComponentFixture<PlayerSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
