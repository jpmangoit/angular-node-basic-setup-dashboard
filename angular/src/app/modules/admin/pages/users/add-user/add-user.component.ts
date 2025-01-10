import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';
import { MustMatch } from 'src/app/validators/must-match.validator';

declare let $: any;

@Component({
    selector: 'app-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

    userForm: UntypedFormBuilder | any;
    isSubmitted: boolean = false;
    imageSrc!: string;
    iconSrc!: string;
    errorImage: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    errorIcon: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    userRoles: any;
    get formControls() { return this.userForm.controls }
    packagesList:any = [];
    constructor(
        private formBuilder: UntypedFormBuilder,
        public _authService: AuthService,
        private toastrService: ToastrNotificationService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.getPackage();
        this.userForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],

            address: ['', Validators.required],
            companyName: ['', Validators.required],
            roleId: ['2'],
            packageId: [],
            status: [],
            image: [''],
            mobileNumber: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
        }, {
            validator: MustMatch('password', 'confirmPassword')
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



    uploadImage(event: any) {
        const file = event.target.files[0];
        const mimeType: string = file.type;
        const mimeType1: number = file.size;
        if (mimeType.match(/image\/*/) == null) {
            this.errorImage = { isError: true, errorMessage: 'It is not valid' };
        }
        else {
            this.errorImage = { isError: false, errorMessage: '' };
            this.imageSrc = file;
            this.userForm.patchValue({
                image: file
            });
            this.userForm.controls["image"].updateValueAndValidity();
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        var url: any;
        let self = this
        reader.onload = function (_event) {
            url = reader.result;
            var imagee = new Image();
            imagee.src = URL.createObjectURL(file);
            imagee.onload = (e: any) => {
                const imagee: any = e.path ? e.path[0] as HTMLImageElement : '';
                var imgHeight = imagee.height
                var imgWidth = imagee.width
            }
            $('#imagePreview').attr('src', url);
        }
    }


    onSubmit() {


        const filtered: any = {};
        this.isSubmitted = true;

        if (this.userForm.invalid || this.errorImage.isError || this.errorIcon.isError) {
            return;
        } else {
            for (let key in this.userForm.value) {
                if (this.userForm.value[key]) {
                    filtered[key] = this.userForm.value[key];
                }
            }
            var formData: any = new FormData();
            let self = this;
            for (const key in filtered) {
                if (Object.prototype.hasOwnProperty.call(filtered, key)) {
                    const element = filtered[key];
                    if (key == 'image') {
                        formData.append('image', self.imageSrc);
                    }
                    else {
                        if ((key != 'image') && (key != 'icon')) {
                            formData.append(key, element);
                        }
                    }
                }
            }
            const endPoint: string = '/admin-user/create-user';
            this._authService.setLoader(true);
            this._authService.sendRequest('post', endPoint, formData).subscribe((respData: any) => {
                this._authService.setLoader(false);
                if (respData?.isError == false) {
                    this.toastrService.showSuccess(respData?.result.message, 'Success');
                    setTimeout(() => {
                        this.router.navigate(['./admin/user-list'])
                    }, 2000);
                }
            }, (err) => {
                this._authService.setLoader(false);
                this.toastrService.showError(err.message, 'Error');
            });
        }
    }

}
