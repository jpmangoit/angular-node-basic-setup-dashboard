import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrNotificationService } from '../services/toastr-notification.service';

@Injectable({
    providedIn: 'root'
})
export class UserGuard implements CanActivate {
    permissions: any = [];
    previousUrl: any = 'admin/dashboard';
    userData: any;
    authorized: boolean = false;

    constructor(private router: Router, private toastrService: ToastrNotificationService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (localStorage.getItem('user-data')) {


            let adminData = JSON.parse(localStorage.getItem('admin-data') || '{}');
            let userData = JSON.parse(localStorage.getItem('user-data') || '{}');
            userData = Object.keys(userData).length !== 0 ? userData : adminData;

            let walmartAuthorize = JSON.parse(localStorage.getItem('walmartAuthorize') || '{}');
            let amazonAuthorize = JSON.parse(localStorage.getItem('amazonAuthorize') || '{}');

            if (Object.keys(walmartAuthorize).length === 0 && Object.keys(amazonAuthorize).length === 0) {
                localStorage.setItem('walmartAuthorize', JSON.stringify(userData.walmartAuthorize))
                localStorage.setItem('amazonAuthorize', JSON.stringify(userData.amazonAuthorize))
                walmartAuthorize = userData.walmartAuthorize;
                amazonAuthorize = userData.amazonAuthorize;
            }     
            
            // if ((userData?.plan?.price == '49.99' || userData?.plan?.price == '49.00') && route.data['title'] == 'products') {
            //     this.toastrService.showInfo('Upgrade for Full Access.', 'Info');
            //     return false;
            // }

            // if (userData?.allowAccess == '0' && route.data['title'] != 'plans' && route.data['title'] != 'subscription' && route.data['title'] != 'contact-us' && route.data['title'] != 'profile') {
            //     this.toastrService.showError('You need to take subscription.', 'Error');
            //     return false;
            // }
            
            if(route.data['title'] != 'configure platform' && (route.data['title'] != 'plans' && route.data['title'] != 'subscription' && route.data['title'] != 'contact-us' && route.data['title'] != 'profile') &&(walmartAuthorize == 0 && amazonAuthorize == 0)) {
                this.toastrService.showError('Please configure atleast one platform.', 'Error');
                return false;
            }

            return true;
        } else {
            this.router.navigate(['./auth/login']);
            return false;
        }
    }

}
