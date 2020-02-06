import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAmountDialogComponent } from './update-amount-dialog.component';

describe('UpdateAmountDialogComponent', () => {
  let component: UpdateAmountDialogComponent;
  let fixture: ComponentFixture<UpdateAmountDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAmountDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAmountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
