import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrNotificationService } from '../services/toastr-notification.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    permissions: any = [];
    adminData: any;
    authorized: boolean = false;

    constructor(private authService: AuthService, private router: Router, private toastrService: ToastrNotificationService) {    }

    getPermissions() {
        this.adminData = JSON.parse(localStorage.getItem('admin-data') || '');
        const endPoint: string = '/check-permissions/' + this.adminData.role[0].id;

        this.authService.sendRequest('get', endPoint, '').subscribe((respData: any) => {
            if (respData?.isError == false) {
                this.permissions = respData?.result?.data?.Permissions;
            }
        }, (err) => {
            console.log(err);
        });

    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
            
        if (localStorage.getItem('admin-data')) {
            // state.url.split('/')[2] == 'dashboard' ? this.getPermissions() : ''

            // this.authorized = false;
            // if (this.permissions && this.permissions.length) {
            //     this.permissions.forEach((element: any) => {
            //         if (element.permissionName == route.data['route']) {
            //             if (element.permissionType == route.data['permission']) {
            //                 this.authorized = true
            //             }
            //         }
            //     });
            // }

            // if (this.permissions && route.data['title'] != 'Dashboard' && !this.authorized) {
            //     this.router.navigate([this.previousUrl]);
            //     this.toastrService.showError('You dont have access for this page', 'Error');
            //     return false;
            // }
            return true;
        } else {
            this.router.navigate(['./auth/login']);
            return false;
        }
    }

}
