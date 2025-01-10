import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NoAuthGuard } from 'src/app/guards/no-auth.guard';
import { UserGuard } from 'src/app/guards/user.guard';
import { AuthLayouComponent } from '../common/auth-layout/auth-layout.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginComponent } from './login/login.component';

export const authRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '',
        component: AuthLayouComponent,
        children: [
            { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard], data: { title: 'Login' } },
            { path: 'forget-password', component: ForgetPasswordComponent, canActivate: [NoAuthGuard], data: { title: 'Forget Password' } },
            { path: 'reset-password', component: ResetPasswordComponent, canActivate: [NoAuthGuard], data: { title: 'Reset Forget Password' } },
            { path: 'verification', component: EmailVerificationComponent, canActivate: [NoAuthGuard], data: { title: 'Verify User' } },
        ]
    },
];
@NgModule({
    imports: [RouterModule.forRoot(authRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
