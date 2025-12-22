import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormateurComponent } from './formateur-component';

describe('FormateurComponent', () => {
  let component: FormateurComponent;
  let fixture: ComponentFixture<FormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormateurComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
