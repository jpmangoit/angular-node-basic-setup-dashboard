import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';
import { imagePath } from 'src/environments/environment';
import { MustMatch } from 'src/app/validators/must-match.validator';
declare let $: any;

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    userForm: UntypedFormBuilder | any;
    isSubmitted: boolean = false;
   
    imageSrc!: string;
    iconSrc!: string;
    errorImage: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    errorIcon: { isError: boolean, errorMessage: string } = { isError: false, errorMessage: '' };
    userId: any;
    hasPicture: boolean = false;
    imagePreview!: string;
    hasIcon: boolean = false;
    iconPreview!: string;
    imagePath: any = imagePath
    userRoles: any;
    userStatus: any;
    userDetails:any;

    constructor(
        private formBuilder: UntypedFormBuilder,
        public _authService: AuthService,
        private toastrService: ToastrNotificationService,
        private router: Router,
        private activateRoute: ActivatedRoute
    ) { }

    ngOnInit(): void {
        let info: any = localStorage.getItem('user-data');
        let user_info = JSON.parse(info);
        this.userId = user_info.id;
        
        if (this.userId) {
            this.userForm = this.formBuilder.group({
                firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.minLength(2)]],
                lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.minLength(2)]],
                email: ['', [Validators.required, Validators.email]],
             
                roleId: ['', Validators.required],
                image: [''],
                status: [''],
                mobileNumber: [''],
                password: ['', [, Validators.minLength(6)]],
                confirmPassword: ['',],
            }, {
                validator: MustMatch('password', 'confirmPassword')
            });
            this.getUser();
        }
    }

    get formControls() { return this.userForm.controls }

    getUser() {

        const endPoint: string = '/user/get-user/' + this.userId;
        this._authService.setLoader(true);
        this._authService.sendRequest('get', endPoint, '').subscribe((respData: any) => {
            this._authService.setLoader(false);
            if (respData?.isError == false) {
                this.userDetails = respData.result.data;
                this.setValue(respData?.result?.data)
            } else {
                this.toastrService.showError(respData?.message, 'Error');
            }
        }, (err) => {
            this._authService.setLoader(false);
            this.toastrService.showError(err.error ? err.error.message : err.error, 'Error');
        });

    }

    setValue(formValue: any) {
        
        this.userForm.controls["firstName"].setValue(formValue.firstName);
        this.userForm.controls["lastName"].setValue(formValue.lastName);
        this.userForm.controls["email"].setValue(formValue.email);
        
        this.userForm.controls["roleId"].setValue(formValue.role[0].id);
        this.userForm.controls["mobileNumber"].setValue(formValue.mobileNumber);
        this.userForm.controls["status"].setValue(formValue.status);
        this.userStatus = formValue.status;
        if (formValue.image && formValue.image != 'undefined') {
            this.hasPicture = true;
            this.imagePreview = formValue.image;
        }

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
            var formData: any = new FormData();
            let self = this;
            for (let key in this.userForm.value) {
                if (this.userForm.value[key]) {
                    filtered[key] = this.userForm.value[key];
                }
            }
            for (const key in filtered) {
                if (Object.prototype.hasOwnProperty.call(filtered, key)) {
                    const element = filtered[key];
                    if (key == 'image') {
                        if (self.imageSrc) {
                            formData.append('image', self.imageSrc);
                        } else {
                            formData.append('imageSrc', self.imagePreview);
                        }
                    }
                    if (key == 'icon') {
                        if (self.iconSrc) {
                            formData.append('icon', self.iconSrc);
                        } else {
                            formData.append('iconSrc', self.iconPreview);
                        }
                    }
                    else {
                        if ((key != 'image') && (key != 'icon')) {
                            formData.append(key, element);
                        }
                    }
                }
            }
            const endPoint: string = '/user/update-user/' + this.userId;
            this._authService.setLoader(true);
            this._authService.sendRequest('post', endPoint, formData).subscribe((respData: any) => {
                this._authService.setLoader(false);
                if (respData?.isError == false) {
                    this.toastrService.showSuccess('Profile Updated successfully', 'Success');
                    this.getUser();
                }
            }, (err) => {
                this._authService.setLoader(false);
                this.toastrService.showError(err.message, 'Error');
            });
        }
    }

}
