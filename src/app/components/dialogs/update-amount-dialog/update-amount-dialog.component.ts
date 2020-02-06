import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UpdateAmountDialogData } from '../UpdateAmountDialogData';

@Component({
  selector: 'app-update-amount-dialog',
  templateUrl: './update-amount-dialog.component.html',
  styleUrls: ['./update-amount-dialog.component.scss']
})
export class UpdateAmountDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<UpdateAmountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateAmountDialogData
    ) { }


    onCancelClick(): void {
      this.dialogRef.close();
    }

}
