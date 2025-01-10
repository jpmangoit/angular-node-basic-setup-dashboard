import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ViewPermissionsDialogComponent } from '../view-permissions-dialog/view-permissions-dialog.component';

@Component({
    selector: 'app-role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.css']
})

export class RoleListComponent implements OnInit {
    resultData: any = [];
    constructor(
        private _authService: AuthService,
        private toastrService: ToastrNotificationService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.getRole();
    }

    getRole() {
        const endPoint: string = '/admin-role/get-role';
        this._authService.sendRequest('get', endPoint, '').subscribe((respData: any) => {
            if (respData?.isError == false) {
                this.resultData = respData.result.data;
            }
        }, (err) => {
            this.toastrService.showError(err.message, 'Error');
        });
    }

    viewPermissions(data:any) {
        this.dialog.open(ViewPermissionsDialogComponent, { data });   
    }

    deleteRole(id: number) {
        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Confirm Delete Role',
                message: 'Are you sure, you want to delete this Role'
            },
            disableClose: true
        });
        confirmDialog.afterClosed().subscribe(result => {
            if (result) {
                const endPoint: string = '/admin-role/delete-role/' + id;
                this._authService.sendRequest('delete', endPoint, '').subscribe((respData: any) => {
                    confirmDialog.close();
                    if (respData?.isError == false) {
                        this.toastrService.showSuccess(respData?.result.message, 'Success');
                        this.ngOnInit();
                    }
                }, (err) => {
                    this.toastrService.showError(err.message, 'Error');
                });
            } else {
                confirmDialog.close();
            }

        });
    }

}
