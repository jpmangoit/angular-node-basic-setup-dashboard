import { Component, OnInit } from '@angular/core';
import {
    UntypedFormGroup,
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    loginForm: UntypedFormGroup | any;
    isSubmitted: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private _authService: AuthService,
        private router: Router,
        private toastrService: ToastrNotificationService
    ) { }

    ngOnInit(): void {



        this.loginForm = this.formBuilder.group({
            email: [null, Validators.required],
            password: [null, Validators.required],
            remember: [null],
        });
    }

    get formControls() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.loginForm.invalid) {
            return;
        } else {
            this._authService.setLoader(true);
            const endPoint: string = '/auth/login';
            this.loginForm.value['userType'] = "user";
            this._authService
                .sendRequest('post', endPoint, this.loginForm.value)
                .subscribe(
                    (respData: any) => {
                        if (respData?.isError == false) {
                            // if (respData?.result?.user?.role[0].roleName == 'admin') {
                            //     localStorage.setItem('admin-data', JSON.stringify(respData.result.user));
                            //     this.router.navigate(['./admin/dashboard']);
                            // } else {
                            if (respData?.result?.user?.role[0].roleName != 'admin') {
                                this._authService.handleAuthentication(
                                    respData.result.user.email,
                                    respData.result.user.id,
                                    respData.result.token,
                                    +respData.expiresIn
                                );

                                localStorage.setItem('token', JSON.stringify(respData.result.token));
                                localStorage.setItem('user-data', JSON.stringify(respData.result.user));

                                if (respData.result.user?.allowAccess == '1') {
                                    if ((respData.result.user.amazonAuthorize == '1' || respData.result.user.walmartAuthorize == '1')) {
                                        this.router.navigate(['./user/dashboard']);
                                    } else {
                                        this.router.navigate(['./user/configure-platform']);
                                    }
                                } else {
                                    this.router.navigate(['./auth/info']);
                                }
                                this._authService.setLoader(false);
                                this.toastrService.showSuccess(respData.result.message, '');
                            }


                        }
                    },
                    (err) => {
                        this._authService.setLoader(false);
                        this.toastrService.showError(err.message, 'Error');
                    }
                );
        }
    }
}
