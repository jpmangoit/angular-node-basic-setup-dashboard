import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';

@Component({
    selector: 'app-forget-password',
    templateUrl: './forget-password.component.html',
    styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

    forgetPassword: UntypedFormGroup | any;
    isSubmitted: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private _authService: AuthService,
        private toastrService: ToastrNotificationService) { }

    ngOnInit(): void {
        this.forgetPassword = this.formBuilder.group({
            email: [null, Validators.required],
        });
    }

    get formControls() { return this.forgetPassword.controls; }

    onSubmit() {
        this.isSubmitted = true;
        if (this.forgetPassword.invalid) {
            return;
        } else {
            this._authService.setLoader(true);
            const endPoint: string = '/auth/forgot-password';
            this._authService.sendRequest('post', endPoint, this.forgetPassword.value).subscribe((respData: any) => {
                if (respData?.isError == false) {
                    this.toastrService.showSuccess(respData?.result, 'Success');
                    this.isSubmitted = false;
                    this.forgetPassword.reset();
                    this._authService.setLoader(false);
                }
            }, (err) => {
                this._authService.setLoader(false);
                this.toastrService.showError(err.message, 'Error');
            });

        }
    }

}
