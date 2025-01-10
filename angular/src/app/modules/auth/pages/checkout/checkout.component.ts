import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { StripeCardComponent, StripeCardNumberComponent, StripePaymentElementComponent, StripeService } from 'ngx-stripe';
import {
    StripeElementsOptions,
    StripeCardElementOptions
} from '@stripe/stripe-js';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements OnInit {

    @ViewChild(StripePaymentElementComponent)
    paymentElement: StripePaymentElementComponent | any;

    @ViewChild(StripeCardComponent)
    card!: StripeCardComponent;

    paymentElementForm: any;

    public elementsOptions: StripeElementsOptions = {
        locale: 'en',
    };

    cardOptions: StripeCardElementOptions = {
        iconStyle: 'solid',
        style: {
            base: {
                iconColor: '#1f1f1f',
                color: '#1f1f1f',
                fontWeight: 500,
                fontFamily: 'Helvetica Neue", Helvetica, sans-serif',
                fontSize: '14px',
                fontSmoothing: 'antialiased',
                ':-webkit-autofill': { color: '#fce883' },
                '::placeholder': { color: '#1f1f1f' }
            },
            invalid: {
                iconColor: '#ffc7ee',
                color: 'red'
            }

        }
    };

    paying = false;
    paymentIntentData: any = {};
    userData: any = {};
    payment_methods: any;
    showHideStripeForm = false;
    public form: FormGroup | any;
    hideSpinner = true;
    hideSpinnerApply = true;
    showPromocode = false;
    isSubmmited: boolean = false;
    isSubmmitedForm = false;

    constructor(
        public dialogRef: MatDialogRef<CheckoutComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _authService: AuthService,
        private toastrService: ToastrNotificationService,
        private fb: FormBuilder,
        private stripeService: StripeService,
        private router: Router
    ) { }

    ngOnInit() {
        this.form = this.fb.group({
            data: [null, Validators.compose([])],
            code: ['']
        });

        let adminData = JSON.parse(localStorage.getItem('admin-data') || '{}');
        let userData = JSON.parse(localStorage.getItem('user-data') || '{}');
        this.userData = Object.keys(userData).length !== 0 ? userData : adminData

        this.paymentMethods(this.userData);
        this.paymentElementForm = this.fb.group({
            name: [this.userData?.firstName + " " + this.userData?.lastName, [Validators.required]],
            email: [this.userData?.email, [Validators.required]],
            address: [''],
            zipcode: [''],
            city: [''],
            amount: [this.data.amount, [Validators.required]]
        });

        if (this.payment_methods && this.payment_methods.length > 0) {
            this.form.controls['data'].setValidators(Validators.required);
        }

    }

    paymentMethods(userData: any) {
        this._authService.sendRequest('', '/user-subscription/payment-method', { user_id: userData.id }).subscribe((result: any) => {
            this.payment_methods = result.data;
            if (this.payment_methods && this.payment_methods.length) {
                this.showHideStripeForm = false;
                this.payment_methods.map((res: any) => { res.user_id = userData.id })
            } else {
                this.showHideStripeForm = true;
            }
        })
    }


    showHideStripe() {
        this.showHideStripeForm = !this.showHideStripeForm;
    }

    showHidePromocode() {
        this.showPromocode = !this.showPromocode;
        if (this.showPromocode) {
            this.form.controls['code'].setValidators(Validators.required);
        } else {
            this.form.controls['code'].setValidators('');
        }
    }

    subscriptionPayment(data?: any) {
        this.isSubmmitedForm = true;
        let pack: any = '';
        let payload: any;

        if (data && data.value.data != null) {
            payload = JSON.parse(data.value.data);
            this.hideSpinner = false;
            this.startSubscription(payload);
        }
        else if (this.card && this.card.element) {
            payload = {
                type: 'card',
                card: this.card.element,
                billing_details: {
                    name: this.userData.firstName + ' ' + this.userData.lastName,
                    email: this.userData.email,
                    phone: this.userData.mobile_number,
                },
            }
            this.hideSpinner = false;
            this.stripeService
                .createPaymentMethod(payload)
                .subscribe((result: any) => {
                    if (result.paymentMethod) {
                        let user_id = localStorage.getItem('user_id');
                        result.paymentMethod['user_id'] = user_id;
                        pack = {
                            paymentMethodId: result.paymentMethod,
                        };
                        this.startSubscription(pack);
                    } else if (result) {
                        this.hideSpinner = true;
                        this.toastrService.showError(result.error.error || result.error.message, 'Error');
                    }
                });
        }
    }

    promocodeSubmit(data?: any) {
        this.isSubmmited = true;
        if (this.userData) {
            data.value.userId = this.userData.id;
        }
        if (data.value.code) {
            this.hideSpinnerApply = false
            this._authService.sendRequest('post', '/user-promocode/check-promocode', data.value)
                .subscribe((res: any) => {
                    this.getUserData();
                    
                }, (err: any) => {
                    this.hideSpinnerApply = true;
                    this.toastrService.showError(err.error || err.message, 'Error');
                });
        }
    }

    getUserData() {

        const endPoint: string = '/user/get-user/' + this.userData.id;
        this._authService.setLoader(true);
        this._authService.sendRequest('get', endPoint, '').subscribe((result: any) => {
            if (result?.isError == false) {
                let p = localStorage.setItem('user-data', JSON.stringify(result?.result?.data));                
                let user: any = localStorage.getItem('user-data');
                    user = JSON.parse(user);
                    if ((user.amazonAuthorize == '1' || user.walmartAuthorize == '1') && user.allowAccess == 1) {
                        this.router.navigate(['./user/dashboard']);
                    } else {
                        this.router.navigate(['./user/configure-platform']);
                    }
                    // this.toastrService.showSuccess(res?.result?.message, res?.result?.title);
                    this.dialogRef.close(true);
            }
        })
    }

    startSubscription(data: any) {
        this._authService.sendRequest('post', '/user-subscription/create-subscription', { paymentMethodId: data && data.paymentMethodId ? data.paymentMethodId : data, planId: this.data.id })
            .subscribe((res: any) => {
                localStorage.setItem('isLogging', 'true');
                this.getUserData();
                this.toastrService.showSuccess(res?.result?.message, res?.result?.title);
                this.hideSpinner = true;
            });
    }

    onClose(val: any): void {
        this.dialogRef.close(val);
    }
}
