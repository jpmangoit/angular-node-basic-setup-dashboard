import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';
import { CustomPasswordValidators } from 'src/app/validators/confirmedPassword.validator';
@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    resetPassword: UntypedFormGroup | any;
    isSubmitted: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private _authService: AuthService,
        private toastrService: ToastrNotificationService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.resetPassword = this.formBuilder.group({
            password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
            confirmPassword: [null, Validators.required],
            token: [null]
        },
            {
                validators: [CustomPasswordValidators.mustMatch('password', 'confirmPassword')],
            });

        this.route.queryParams.subscribe((params: any) => {
            this.resetPassword.controls["token"].setValue(params?.token);
        });
    }

    get formControls() { return this.resetPassword.controls; }

    onSubmit() {
        this.isSubmitted = true;
        if (this.resetPassword.invalid) {
            return;
        } else {
            this._authService.setLoader(true);
            const endPoint: string = '/auth/reset-password';
            this._authService.sendRequest('post', endPoint, this.resetPassword.value).subscribe((respData: any) => {
                if (respData?.isError == false) {
                    this.toastrService.showSuccess(respData?.result, 'Success');
                    setTimeout(() => {
                        this.router.navigate(['./admin/login']);
                        this._authService.setLoader(false);

                    }, 1000);
                }
            }, (err) => {
                this._authService.setLoader(false);
                this.toastrService.showError(err.message, 'Error');
            });

        }
    }

}
