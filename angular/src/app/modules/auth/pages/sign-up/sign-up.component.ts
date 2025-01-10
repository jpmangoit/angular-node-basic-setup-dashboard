import { Component } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';
import { MustMatch } from 'src/app/validators/must-match.validator';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

    registerForm: UntypedFormBuilder | any;
    isSubmitted: boolean = false;
    imageSrc!: string;
    iconSrc!: string;
    errorImage: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    errorIcon: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    userRoles: any;
    get formControls() { return this.registerForm.controls }

    constructor(
        private formBuilder: UntypedFormBuilder,
        public _authService: AuthService,
        private toastrService: ToastrNotificationService,
        private router: Router,
    ) { }

    ngOnInit(): void {

        

        this.registerForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            roleId: ['2'],
            status: ['1'],
            companyName: ['', Validators.required],
            image: [''],
            mobileNumber: ['', Validators.required],
            address: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
    }


    
    onSubmit() {
        this.isSubmitted = true;
       
        if (this.registerForm.invalid) {
            this.toastrService.showError('Invalid Form data', 'Error');
            return ;
        } else {
            const endPoint: string = '/auth/signup';
            this._authService.setLoader(true);
            this._authService.sendRequest('post', endPoint, this.registerForm.value).subscribe((respData: any) => {
                if (respData?.isError == false) {
                    this.toastrService.showSuccess('Registered Successfully, Please check email for verification', 'Success');
                    setTimeout(() => {
                        this._authService.setLoader(false);
                        this.router.navigate(['./auth/login'])
                    }, 2000);
                }
            }, (err) => {
                this._authService.setLoader(false);
                this.toastrService.showError(err.message, 'Error');
            });
        }
    }


}
