import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueFormtion } from './catalogue-formtion';

describe('CatalogueFormtion', () => {
  let component: CatalogueFormtion;
  let fixture: ComponentFixture<CatalogueFormtion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogueFormtion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogueFormtion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
