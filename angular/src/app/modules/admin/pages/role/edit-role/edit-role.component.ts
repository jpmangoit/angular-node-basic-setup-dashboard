import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';
import { imagePath } from 'src/environments/environment';

declare let $: any;
@Component({
    selector: 'app-edit-role',
    templateUrl: './edit-role.component.html',
    styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit {

    roleForm: UntypedFormBuilder | any;
    isSubmitted: boolean = false;
    categoryId: any;
    hasPicture: boolean = false;
    imagePreview!: string;
    hasIcon: boolean = false;
    iconPreview!: string;
    imagePath: any = imagePath
    permissionData: any;
    permisson_obj: any;
    checkedpermissionData: any;
    allComplete: boolean = false;
    permissionIds: any = [];
    allPermissions: any = [];
    roleNames: any = [];

    get formControls() { return this.roleForm.controls }

    constructor(
        private formBuilder: UntypedFormBuilder,
        public _authService: AuthService,
        private toastrService: ToastrNotificationService,
        private router: Router,
        private activateRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.roleForm = this.formBuilder.group({
            name: ['', Validators.required],
        });
        this.categoryId = this.activateRoute.snapshot.paramMap.get('id');
        this.getRole()
        this.getAllPermission();
    }


    getRole() {
        const endPoint: string = '/admin-role/get-role/' + this.categoryId;
        this._authService.setLoader(true);
        this._authService.sendRequest('get', endPoint, '').subscribe((respData: any) => {
            this._authService.setLoader(false);
            if (respData?.isError == false) {
                this.setValue(respData?.result?.data);
                
                respData?.result?.data?.Permissions.forEach((per: any) => {
                    this.permissionIds.push(per.id);

                    if (this.roleNames.indexOf(per.permissionName) === -1) {
                        this.roleNames.push(per.permissionName);
                    }
                });

            } else {
                this.toastrService.showError(respData?.message, 'Error');
            }
        }, (err) => {
            this._authService.setLoader(false);
            this.toastrService.showError(err.error.message, 'Error');
        });

    }

    getAllPermission() {
        const endPoint: string = '/admin-permission/get-permission';
        this._authService.setLoader(true);
        this._authService.sendRequest('get', endPoint, '').subscribe((respData: any) => {
            this._authService.setLoader(false);

            respData.result.data.map((res: any) => {
                res.completed = false;
                res.permissionType = res.permissionType.toLowerCase() == 'get' ? 'view' : res.permissionType;
            })

            this.permissionData = respData.result.data;
           
            if (respData?.isError == false) {
                this.permissionData.map((p:any)=>{
                    if (this.permissionIds.includes(p.id)) {
                        p.completed = true
                    }
                });

                this.permisson_obj = this.groupBy(respData.result.data, 'permissionName');
                this.permisson_obj = Object.entries(this.permisson_obj);
                
            }

        }, (err) => {
            this._authService.setLoader(false);
            this.toastrService.showError(err.message, 'Error');
        });
    }

    setAll(completed: boolean, data: any) {

        this.checkedpermissionData = this.permisson_obj.filter((p: any) => p[0] == data);

        this.allComplete = completed;

        if (this.checkedpermissionData[0][1] == null) {
            return;
        }
        this.checkedpermissionData[0][1].forEach((t: any) => (t.completed = completed));
    }

    updateAllComplete() {
        this.allComplete = this.checkedpermissionData != null && this.checkedpermissionData.every((t: any) => t.completed);
    }

    someComplete(): boolean {

        if (this.checkedpermissionData == null) {
            return false;
        }
        return this.checkedpermissionData.filter((t: any) => t.completed).length > 0 && !this.allComplete;
    }

    setValue(formValue: any) {
        this.roleForm.controls["name"].setValue(formValue.roleName);
    }

    onSubmit() {
        this.isSubmitted = true;
        this.allPermissions = [];
        this.permissionData.filter((p: any) => {
            if (p.completed) {
                this.allPermissions.push(p.id)
            }
        })
        this.roleForm.value.permissionId = this.allPermissions
        const endPoint: string = '/admin-role/update-role/' + this.categoryId;
        this._authService.setLoader(true);
        this._authService.sendRequest('put', endPoint, this.roleForm.value).subscribe((respData: any) => {
            this._authService.setLoader(false);
            if (respData?.isError == false) {
                this.toastrService.showSuccess(respData?.result.message, 'Success');
                setTimeout(() => {
                    this.router.navigate(['./admin/role-list'])
                }, 2000);
            }
        }, (err) => {
            this._authService.setLoader(false);
            this.toastrService.showError(err.message, 'Error');
        });
    }

    groupBy(obj: any, prop: any) {
        return obj.reduce((acc: any, item: any) => {
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

}
