import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';
declare let $: any;

@Component({
    selector: 'app-add-role',
    templateUrl: './add-role.component.html',
    styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {

    roleForm: UntypedFormBuilder | any;
    isSubmitted: boolean = false;
    allPermissions: any = [];
    permisson_obj: any;
    allComplete: boolean = false;
    checkedpermissionData: any;
    permissionData: any;

    constructor(
        private formBuilder: UntypedFormBuilder,
        public _authService: AuthService,
        private toastrService: ToastrNotificationService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.roleForm = this.formBuilder.group({
            name: ['', Validators.required],
            permissionId: ['', Validators.required],
        });
        this.getAllPermission();
    }

    get formControls() { return this.roleForm.controls }

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
                this.permisson_obj = this.groupBy(respData.result.data, 'permissionName');
                this.permisson_obj = Object.entries(this.permisson_obj);
            }
        }, (err) => {
            this._authService.setLoader(false);
            this.toastrService.showError(err.message, 'Error');
        });
    }


    onSubmit() {
        this.isSubmitted = true;
        this.allPermissions = [];
        this.permissionData.filter((p:any)=>{
            if(p.completed) {
                this.allPermissions.push(p.id)
            }
        })
        this.roleForm.value.permissionId = this.allPermissions
        const endPoint: string = '/admin-role/create-role';
        this._authService.setLoader(true);
        this._authService.sendRequest('post', endPoint, this.roleForm.value).subscribe((respData: any) => {
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

    
    setAll(completed: boolean,data:any) {
        this.checkedpermissionData = this.permisson_obj.filter((p:any)=> p[0] == data );
                
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
