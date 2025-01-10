import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { imagePath } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ViewDetailsDialogComponent } from '../../shared/view-details-dialog/view-details-dialog.component';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
}) 
export class UserListComponent implements OnInit {
    displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'verified', 'status', 'actions'];
    dataSource!: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    resultData: any = [];
    search = new FormControl('');
    filter = new FormControl('');
    searchOptions: any = '';
    lastSearchValue: any;
    loading: any;
    lastfilterValue: any;
    filterOptions: any;
    totalRows: number = 0;
    pageSize: number = 10;
    currentPage: any = 0;
    pageSizeOptions: number[] = [10, 25, 50, 100];
    imagePath: any = imagePath;
    packagesList:any = [];

    constructor(
        private _authService: AuthService,
        private toastrService: ToastrNotificationService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.getPackage();
        this.getUser();

        this.search.valueChanges.pipe(debounceTime(1000)).subscribe((res: any) => {
            this.searchOptions = '';
            if (res) {
                this.lastSearchValue = res;
                this.searchOptions += '&search=' + res;
                this.getUser();
            } else {
                this.searchOptions = this.searchOptions.replace('&search=' + this.lastSearchValue, '');
                this.loading = true;
                this.getUser();
            }

        });

        this.filter.valueChanges.subscribe((res: any) => {
            this.searchOptions = '';
            if (res) {
                let option = res.split(':')[0];
                let value = res.split(':')[1];
                this.searchOptions += '&filter=' + true + '&' + option + '=' + value;

                this.getUser();
            } else {
                this.getUser();
            }

        });
    }

    getUser() {
        var pageNo = this.currentPage + 1
        const endPoint: string = '/admin-user/get-user?page=' + pageNo + '&pageSize=' + this.pageSize + this.searchOptions;
        this._authService.setLoader(true);
        this._authService.sendRequest('get', endPoint, '').subscribe((respData: any) => {
            this._authService.setLoader(false);
            if (respData?.isError == false) {
                this.resultData = respData?.result?.data               
                this.totalRows = respData?.result?.data?.count;
            }
        }, (err) => {
            this._authService.setLoader(false);
            this.toastrService.showError(err.message, 'Error');
        });
    }

    
    getPackage() {
        const endPoint: string = '/admin-package/get-all-package';
        this._authService.setLoader(true);
        this._authService.sendRequest('get', endPoint, '').subscribe((respData: any) => {
            this.packagesList = respData?.result?.data;
            this._authService.setLoader(false);
        }, (err) => {
            this._authService.setLoader(false);
            this.toastrService.showError(err.message, 'Error');
        });
    }

    viewDetails(data: any) {
        data.page_title = 'User Details';
        data.page = 'User'
        this.dialog.open(ViewDetailsDialogComponent, { data });
    }

    pageChanged(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.currentPage = event.pageIndex;
        this.getUser();
    }

    updateData(data: any, id: any) {
        if (!data) {
            return;
        } else {
            const endPoint: string = '/admin-user/update-user/' + id;
            this._authService.setLoader(true);
            this._authService.sendRequest('post', endPoint, data).subscribe((respData: any) => {
                this._authService.setLoader(false);
                if (respData?.isError == false) {
                    this.getUser();
                    this.toastrService.showSuccess(respData?.result.message, 'Success');
                }
            }, (err) => {
                this._authService.setLoader(false);
                this.toastrService.showError(err.message, 'Error');
            });
        }
    }

    deleteUser(categoryId: number) {
        const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: 'Confirm Delete User',
                message: 'Are you sure, you want to delete this user?'
            },
            disableClose: true,
            // hasBackdrop: false    
        });
        confirmDialog.afterClosed().subscribe(result => {
            if (result) {
                const endPoint: string = '/admin-user/delete-user/' + categoryId;
                this._authService.sendRequest('delete', endPoint, '').subscribe((respData: any) => {
                    confirmDialog.close();
                    if (respData?.isError == false) {
                        this.toastrService.showSuccess('User deleted successfully', 'Success');
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

    reset() {
        this.filter.reset();
        this.searchOptions = '';
        this.getUser();
    }

}
