import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxStripeModule } from 'ngx-stripe';
import { MaterialModule } from 'src/app/material.module';
import { authRoutes } from './auth.routing.module';
import { environment } from '../../../environments/environment';

import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { LayoutComponent } from './common/layout/layout.component';
import { SubscriptionPlansComponent } from './pages/subscription-plans/subscription-plans.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { InfoComponent } from './pages/info/info.component';


@NgModule({
    declarations: [
        ForgetPasswordComponent,
        ResetPasswordComponent,
        LoginComponent,
        SignUpComponent,
        LayoutComponent,
        EmailVerificationComponent,
        SubscriptionPlansComponent,
        CheckoutComponent,
        InfoComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        NgxStripeModule.forRoot(environment.stripe.publicKey),
        RouterModule.forChild(authRoutes),
        ToastrModule.forRoot({
            timeOut: 3000,
            disableTimeOut: false,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            closeButton: false,
            autoDismiss: true
        }),
    ]
})
export class AuthModule { }
