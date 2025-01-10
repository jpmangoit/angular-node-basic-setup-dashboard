import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.authService.IsLoggedIn()) {
            return true;
        } else {
            let adminData = JSON.parse(localStorage.getItem('admin-data') || '{}');
            let userData = JSON.parse(localStorage.getItem('user-data') || '{}');
            userData = Object.keys(userData).length !== 0 ? userData : adminData

            if (userData?.role[0]?.roleName == 'admin') {
                this.router.navigate(['./admin/dashboard']);
            } else {
                if (userData.allowAccess == "1") {
                    if (userData.amazonAuthorize == '1' || userData.walmartAuthorize == '1') {
                        this.router.navigate(['./user/dashboard']);
                    } else {
                        this.router.navigate(['./user/configure-platform']);
                    } 
                } else {
                    this.router.navigate(['./auth/info']);
                }

            }
            return false;
        }
    }

}
