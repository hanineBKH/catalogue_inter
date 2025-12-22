import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestUser } from './gest-user';

describe('GestUser', () => {
  let component: GestUser;
  let fixture: ComponentFixture<GestUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
