import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NoAuthGuard } from 'src/app/guards/no-auth.guard';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { LayoutComponent } from './common/layout/layout.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { SubscriptionPlansComponent } from './pages/subscription-plans/subscription-plans.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { UserGuard } from 'src/app/guards/user.guard';
import { InfoComponent } from './pages/info/info.component';

export const authRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard], data: { title: 'Login' } },
            { path: 'sign-up', component: SignUpComponent, canActivate: [NoAuthGuard], data: { title: 'Sign Up' } },
            { path: 'forget-password', component: ForgetPasswordComponent, canActivate: [NoAuthGuard], data: { title: 'Forget Password' } },
            { path: 'reset-password', component: ResetPasswordComponent, canActivate: [NoAuthGuard], data: { title: 'Reset Forget Password' } },
            { path: 'verification', component: EmailVerificationComponent, canActivate: [NoAuthGuard], data: { title: 'Verify User' } },
            // { path: 'subscription-plans', component: SubscriptionPlansComponent,canActivate: [UserGuard], data: { title: 'plans' } },
            { path: 'info', component: InfoComponent,canActivate: [UserGuard], data: { title: 'plans' } },
        ]
    },
];
@NgModule({
    imports: [RouterModule.forRoot(authRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
