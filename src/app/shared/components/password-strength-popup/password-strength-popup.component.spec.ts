import {ComponentFixture, TestBed} from '@angular/core/testing';

import {
  PasswordStrengthPopupComponent
} from './password-strength-popup.component';

describe('PasswordStrengthPopupComponent', () => {
  let component: PasswordStrengthPopupComponent;
  let fixture: ComponentFixture<PasswordStrengthPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordStrengthPopupComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PasswordStrengthPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
