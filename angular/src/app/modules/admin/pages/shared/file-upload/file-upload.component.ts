import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

    files: any = [];

    constructor(
        public dialogRef: MatDialogRef<FileUploadComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private toastrService: ToastrNotificationService,
        private _authService: AuthService,
        private router: Router
    ) { }

    onClose(val: any): void {
        this.dialogRef.close(val);
    }

    onFileDropped(event: any) {
        const allowedExtensions = /(\.csv|\.xlsx|\.xls|\.xlsm)$/i;
        this.files = event.target.files[0];        
        if (this.files) {            
            if (!allowedExtensions.exec(this.files?.name)) {
                this.toastrService.showError('Invalid file type. Allowed files (csv , xlsx , xls or xlsm)', 'Error');
                this.files = [];
                return;
            }
        }
    }

    fileBrowseHandler(event: any) {
        const allowedExtensions = /(\.csv|\.xlsx|\.xls|\.xlsm)$/i;
        this.files = event.target.files[0];        
        if (this.files) {            
            if (!allowedExtensions.exec(this.files?.name)) {
                this.toastrService.showError('Invalid file type. Allowed files (csv , xlsx , xls or xlsm)', 'Error');
                this.files = [];
                return;
            }
        }
    }

    upload() {
        var formData: any = new FormData();

        formData.append('file', this.files);

        const endPoint: string = '/user-order-creation/import-orders';
        this._authService.setLoader(true);
        this._authService.sendRequest('post', endPoint, formData).subscribe((respData: any) => {
            this._authService.setLoader(false);
            if (respData?.isError == false) {
                this.toastrService.showSuccess(respData?.result.message, 'Success');
                setTimeout(() => {
                    this.router.navigate(['./user/order-list'])
                    this.dialogRef.close();
                }, 100);
            }
        }, (err) => {
            this._authService.setLoader(false);
            this.toastrService.showError(err.message, 'Error');
        });
    }

    deleteFile() {
        this.files = []
    }


}