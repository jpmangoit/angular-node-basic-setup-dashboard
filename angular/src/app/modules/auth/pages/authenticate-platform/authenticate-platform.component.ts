import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';
import { amazon_url } from '../../../../../environments/environment';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from 'src/app/modules/user/pages/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-authenticate-platform',
    templateUrl: './authenticate-platform.component.html',
    styleUrls: ['./authenticate-platform.component.css']
})
export class AuthenticatePlatformComponent {

    callbackUri: any;
    amazon_state: any;
    selling_partner_id: any;
    urlWithParameters: any;
    userData: any;
    userId: any;
    walmartForm: UntypedFormGroup | any;
    isSubmitted: boolean = false;
    showForm: boolean = false;
    amazonAuthorize: any;
    walmartAuthorize: any;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private _authService: AuthService,
        private router: Router,
        private toastrService: ToastrNotificationService,
        private activateRoute: ActivatedRoute,
        private dialog: MatDialog
    ) { }


    ngOnInit(): void {

        let adminData = JSON.parse(localStorage.getItem('admin-data') || '{}');
        let userData = JSON.parse(localStorage.getItem('user-data') || '{}');
        this.userData = Object.keys(userData).length !== 0 ? userData : adminData;
        this.walmartAuthorize = JSON.parse(localStorage.getItem('walmartAuthorize') || '{}');
        this.amazonAuthorize = JSON.parse(localStorage.getItem('amazonAuthorize') || '{}');
        this.userId = this.userData.id;
        this.getUser();

        this.walmartForm = this.formBuilder.group({
            clientId: [null, Validators.required],
            clientSecret: [null, Validators.required],
        });


        this.activateRoute.queryParams.subscribe((res: any) => {

            if (res && Object.keys(res).length !== 0) {
                // Replace the placeholders with the actual values
                this.callbackUri = res.amazon_callback_uri;
                this.amazon_state = res.amazon_state;
                this.selling_partner_id = res.selling_partner_id;

                // Construct the URL with parameters
                if (!this.urlWithParameters && !res?.spapi_oauth_code) {
                    this.urlWithParameters = this.callbackUri + '?amazon_state=' + this.amazon_state + '&state=' + Math.random() * 11 + '&version=beta';
                    window.open(this.urlWithParameters, '_self');
                }


                if (res.spapi_oauth_code) {


                    const endPoint: string = '/user-amazon/get-amazon-data';

                    let data = {
                        spapi_oauth_code: res.spapi_oauth_code,
                        state: res.state,
                        selling_partner_id: res.selling_partner_id,
                    }

                    this._authService
                        .sendRequest('post', endPoint, data)
                        .subscribe(
                            (respData: any) => {
                                localStorage.setItem('amazonAuthorize', JSON.stringify(1));
                                this.toastrService.showInfo("Amazon is configured now", 'Message');

                                this.router.navigate(['/user/dashboard']);

                            },
                            (err) => {
                                this.toastrService.showError(err.message, 'Error');
                            })
                }
            }
        })
    }

    get formControls() {
        return this.walmartForm.controls;
    }

    getUser() {

        const endPoint: string = '/user/get-user/' + this.userId;
        this._authService.setLoader(true);
        this._authService.sendRequest('get', endPoint, '').subscribe((respData: any) => {
            this._authService.setLoader(false);
            if (respData?.isError == false) {
                this.userData = respData.result.data;
                localStorage.setItem('walmartAuthorize', JSON.stringify(this.userData.walmartAuthorize));
                localStorage.setItem('amazonAuthorize', JSON.stringify(this.userData.amazonAuthorize));
            } else {
            }
        }, (err) => {
            this._authService.setLoader(false);
        });

    }

    selectedPlateform(plateform: any) {

        if (plateform == 'amazon' && this.userData.amazonAuthorize == 0) {
            // const confirmDialog = this.dialog.open(ConfirmationDialogComponent, {
            //     data: {
            //         title: 'Select MarketplaceId',
            //     },
            //     disableClose: true,
            // });

            // confirmDialog.afterClosed().subscribe((result: any) => {
            //     console.log(result);
            //     console.log(amazon_url + '&marketPlaceId=' + result);

            // })
            window.open(amazon_url, '_self');
        } else if (plateform == 'amazon') {
            this.router.navigate(['user/dashboard'])
        }

        if (plateform == 'walmart' && this.userData.walmartAuthorize == 0) {
            this.showForm = true;
        } else if (plateform == 'walmart') {
            this.router.navigate(['user/dashboard'])
        }

    }

    removeAuth(platformName: any) {

        this.isSubmitted = true
        const endPoint: string = '/auth/remove-platform-config';
        this._authService.setLoader(true);

        this._authService
            .sendRequest('post', endPoint, { userId: this.userId, platform: platformName })
            .subscribe(
                (respData: any) => {
                    if (platformName == 'amazon') {
                        localStorage.setItem('amazonAuthorize', JSON.stringify(0));
                        this.amazonAuthorize = 0;
                    } else {
                        localStorage.setItem('walmartAuthorize', JSON.stringify(0));
                        this.walmartAuthorize = 0;
                    }
                    this._authService.setLoader(false);
                    this.toastrService.showSuccess("Configuration Removed Successfully", 'Message');
                    this.ngOnInit();
                },
                (err) => {
                    this._authService.setLoader(false);
                    this.toastrService.showError(err.message, 'Error');
                })
    }

    onsubmit() {
        this.isSubmitted = true
        if (this.walmartForm.invalid) {
            this.toastrService.showError('Invalid Form data', 'Error');
            return;
        } else {
            const endPoint: string = '/user-walmart/get-walmart-data';
            this._authService.setLoader(true);

            this._authService
                .sendRequest('post', endPoint, this.walmartForm.value)
                .subscribe(
                    (respData: any) => {
                        localStorage.setItem('walmartAuthorize', JSON.stringify(1));
                        this.toastrService.showInfo("Walmart is configured now", 'Message');
                        this.router.navigate(['/user/dashboard']);
                        this._authService.setLoader(false);
                    },
                    (err) => {
                        this._authService.setLoader(false);
                        this.toastrService.showError(err?.result?.message, 'Error');
                    })
        }
    }
}
