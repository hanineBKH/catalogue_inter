import { ComponentFixture, TestBed } from '@angular/core/testing';

import { formation } from './formation';

describe('Formation', () => {
  let component: formation;
  let fixture: ComponentFixture<formation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [formation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(formation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
