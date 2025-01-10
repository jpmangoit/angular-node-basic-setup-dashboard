import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-view-permissions-dialog',
    templateUrl: './view-permissions-dialog.component.html',
    styleUrls: ['./view-permissions-dialog.component.css']
})
export class ViewPermissionsDialogComponent {
    title!: string;
    message!: string;
    sortedData: [] = [];

    constructor(public dialogRef: MatDialogRef<ViewPermissionsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }


    ngOnInit(): void {
        this.data = this.groupBy(this.data, 'permissionName');
        this.data = Object.entries(this.data);
        this.data.forEach((el: any) => {
            if (el[1].length != 4) {
                let i = 0
                while (i <= (5-el[1].length)) {
                    if (el[1].length != 4) el[1].push({ permissionName: 'showClose' })
                    i++;
                }
            }
        });
    }

    groupBy(obj: any, prop: any) {
        return obj.reduce(function (acc: any, item: any) {
            let key = item[prop];
            if (typeof key === "string") {
                key = key.replace(/\s+/g, "");
            }
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {});
    }

    onClose(val: any): void {
        this.dialogRef.close(val);
    }
}
