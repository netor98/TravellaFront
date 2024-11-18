import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TestCitiesComponent} from './test-cities.component';

describe('TestCitiesComponent', () => {
  let component: TestCitiesComponent;
  let fixture: ComponentFixture<TestCitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestCitiesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TestCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
