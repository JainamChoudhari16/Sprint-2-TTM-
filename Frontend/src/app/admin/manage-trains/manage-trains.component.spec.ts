import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTrainsComponent } from './manage-trains.component';

describe('ManageTrainsComponent', () => {
  let component: ManageTrainsComponent;
  let fixture: ComponentFixture<ManageTrainsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTrainsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageTrainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
