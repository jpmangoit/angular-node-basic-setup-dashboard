import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxStripeModule } from 'ngx-stripe';
import { MaterialModule } from 'src/app/material.module';
import { authRoutes } from './admin-auth.routing.module';
import { environment } from '../../../../environments/environment';
import { AuthLayouComponent } from '../common/auth-layout/auth-layout.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';


@NgModule({
    declarations: [
        ForgetPasswordComponent,
        ResetPasswordComponent,
        LoginComponent,
        AuthLayouComponent,
        EmailVerificationComponent, 
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
export class AdminAuthModule { }
