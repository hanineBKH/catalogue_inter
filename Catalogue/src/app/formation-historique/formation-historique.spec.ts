import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationHistorique } from './formation-historique';

describe('FormationHistorique', () => {
  let component: FormationHistorique;
  let fixture: ComponentFixture<FormationHistorique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationHistorique]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationHistorique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
