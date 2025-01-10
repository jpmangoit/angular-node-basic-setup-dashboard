import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from "rxjs/operators";
import { BehaviorSubject, of, throwError } from 'rxjs';
import { apiUrl } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { Admin } from '../models/admin.model';
import { AlertDialogComponent } from '../modules/user/pages/shared/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

export interface Authdata {
    error: any;
    result: any;
    email: string;
    password: string;
    id: string;
    token: string;
    expiresIn: string;
    rememberMe: boolean;

}

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnInit {
    headerAdmin = new Subject<Admin>();
    admin = new ReplaySubject<Object>(1);
    loginForm: any;
    tokenExpirationTimer: any;
    loader: Boolean = false;
    isAdminLoggedIn = new BehaviorSubject<boolean>(false);
    pop_visible = new BehaviorSubject<any>(false);
    destroy = new Subject<void>();

    constructor(private http: HttpClient, private router: Router, private dialog: MatDialog,) { }

    ngOnInit(): void {
        this.updateNav();
    }

    sendRequest(method: string, endPoint: string, data: any) {
        return this.actualSendRequest(method, endPoint, data);
    }

    actualSendRequest(method: any, endPoint: any, data: any) {
        let myHeaders: any;
        var token = JSON.parse(localStorage.getItem('token') || '{}');
        if (localStorage.getItem('token') == null) {
            myHeaders = new HttpHeaders({
                'authorization': '',
            });
        } else {
            var token = JSON.parse(localStorage.getItem('token') || '{}');
            myHeaders = new HttpHeaders({
                'authorization': 'Bearer ' + token,
            });
        }
        let endPointUrl: any;
        endPointUrl = `${apiUrl}` + endPoint + ``;

        if (method == 'post') {
            return this.http.post(endPointUrl, data, { headers: myHeaders })
                .pipe(
                    map(data => {
                        return data
                    }),
                    catchError(error => {
                        return this.handleError(error);
                    })
                );
        } else if (method == 'put') {
            return this.http.put(endPointUrl,
                data, { headers: myHeaders }).pipe(
                    map(data => {
                        return data
                    }),
                    catchError(error => {
                        return this.handleError(error);
                    })
                );
        } else if (method == 'delete') {
            return this.http.delete(endPointUrl, { headers: myHeaders }).pipe(
                map(data => {
                    return data
                }),
                catchError(error => {
                    return this.handleError(error);
                })
            );
        } else {
            return this.http.get(endPointUrl, { headers: myHeaders }).pipe(
                map(data => {
                    return data
                }),
                catchError(error => {
                    return this.handleError(error);
                })
            );
        }
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = {};
        if (error.status == 401) {
            errorMessage =
            {
                "isError": true,
                "message": error.error.message ? error.error.message : "Unauthorized access"
            }
            
            if (error.status == 401 && (error.error.message == 'Token is required.' || error.error.error == 'Invalid Token' || error.error.message == 'Invalid token.')) {
                errorMessage =
                {
                    "isError": true,
                    "message": "Session Expired, Please Login"
                }
                this.logout();
            }
        }
        else {
            return throwError(error.error);
        }
        return throwError(errorMessage);
    }

    IsLoggedIn() {
        //it returns a boolean value, if the token exsist then true else vice versa
        return !!localStorage.getItem('token');
    }

    autoLogin() {
        let loggedinAdmin: any = localStorage.getItem('userData');
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(loggedinAdmin);

        if (!userData) {
            return;
        }
        const loadedAdmin = new Admin(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedAdmin.token) {
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }

    }

    logout() {
        let adminData = JSON.parse(localStorage.getItem('admin-data') || '{}');
        let userData = JSON.parse(localStorage.getItem('user-data') || '{}');
        userData = Object.keys(userData).length !== 0 ? userData : adminData

        localStorage.clear();

        if (userData?.role[0]?.roleName == 'admin') {
            this.router.navigate(['./admin/login'])
        } else {
            this.router.navigate(['/'])
        }

        //for autoLogout
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;

    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);

    }

    handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        //time after which admin has to be auto logged out

        var d = expirationDate.toString();
        var index = d.lastIndexOf(':') + 3;
        var expiringDate = d.substring(0, index);
        const expirationDuration = new Date(expiringDate).getTime() - new Date().getTime();
        const admin = new Admin(
            email,
            userId,
            token,
            new Date(expirationDuration)
        );
        this.admin.next(admin); //storing data in admin subject
        localStorage.setItem('userData', JSON.stringify(admin));
        this.autoLogout(expirationDuration);
    }

    getAuth() {
        if (localStorage.getItem('token')) {
            return true;
        } else {
            return false
        }
    }

    backButton() {
        window.history.back()
    }

    setLoader(value: Boolean) {
        this.loader = value;
    }

    get showLoader() {
        return this.loader;
    }

    get getDestory() {
        return this.destroy;
    }

    updateNav() {
        let userToken = JSON.parse(localStorage.getItem('token') || 'null');
        if (userToken != null) {
            return true;
        } else {
            return false;
        }

    }

    dowloadDocument(method: any, endPoint: any, data: any) {
        console.log(data);

        let myHeaders: any;

        var token = JSON.parse(localStorage.getItem('token') || '{}');
        if (localStorage.getItem('token') == null) {
            myHeaders = new HttpHeaders({
                'authorization': '',
            });
        } else {
            var token = JSON.parse(localStorage.getItem('token') || '{}');
            myHeaders = new HttpHeaders({
                'authorization': 'Bearer ' + token,
            });
        }
        let endPointUrl: any;
        endPointUrl = `${apiUrl}` + endPoint + ``;
        return this.http.post(endPointUrl, data, { headers: myHeaders, responseType: "blob" })
            .pipe(
                map(data => {
                    return data
                }),
                catchError(error => {
                    return this.handleError(error);
                })
            );
    }


    alertNotify() {
        let filter;
        const confirmDialog = this.dialog.open(AlertDialogComponent, {
            data: {
                title: 'Low Quantity Alert!',
                message: 'There are many products with low quantity!'
            },
            // position: { top: '10px'} ,
            disableClose: true,
            // hasBackdrop: false    
        });
        confirmDialog.afterClosed().subscribe(result => {            
            if(result == 'filter') { 
                this.pop_visible.next('filter')
            }
            else {
                this.pop_visible.next(true);
                confirmDialog.close();
            }
            
        });
    }

}
