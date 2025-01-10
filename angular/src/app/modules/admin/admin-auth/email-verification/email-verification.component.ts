import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';


@Component({
    selector: 'app-email-verification',
    templateUrl: './email-verification.component.html',
    styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private toastrService: ToastrNotificationService) {
    }


    ngOnInit() {

        const token = this.route.snapshot.queryParams['token'];

        const endPoint: string = '/auth/verify/' + token;
        this.authService.setLoader(true);
        this.authService.sendRequest('get', endPoint, '').subscribe((respData: any) => {
            this.authService.setLoader(false);
            if (respData?.isError == false) {
                setTimeout(() => {
                    this.toastrService.showSuccess('You are now verified, Please login', 'Success');
                    this.router.navigate(['/auth/login'])
                }, 3000);
            }
        }, (err) => {
            this.router.navigate(['/auth/login'])
            this.authService.setLoader(false);
            this.toastrService.showError(err.message, 'Error');
        });
    }

}
