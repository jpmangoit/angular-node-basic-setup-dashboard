import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { imagePath } from 'src/environments/environment';

@Component({
    selector: 'app-view-details-dialog',
    templateUrl: './view-details-dialog.component.html',
    styleUrls: ['./view-details-dialog.component.css']
})
export class ViewDetailsDialogComponent {
    title!: string;
    message!: string;
    imagePath: any = imagePath;
      
    constructor(public dialogRef: MatDialogRef<ViewDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, 
        ) { 
        }

    ngOnInit(): void {
        console.log(this.data);
        
    }

    onClose(val: any): void {
        this.dialogRef.close(val);
    }
}
