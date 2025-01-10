import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrNotificationService } from 'src/app/services/toastr-notification.service';
import { CheckoutComponent } from '../checkout/checkout.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-subscription-plans',
    templateUrl: './subscription-plans.component.html',
    styleUrls: ['./subscription-plans.component.css']
})
export class SubscriptionPlansComponent implements OnInit {
    plans: any = [];
    constructor(
        public _authService: AuthService,
        private toastrService: ToastrNotificationService,
        private dialog: MatDialog,
    ) { }

    ngOnInit() {

        this._authService.sendRequest('get', '/user-subscription/get-plans', '').subscribe((respData: any) => {
            if (respData?.isError == false) {
                this.plans = respData?.result;
                console.log(this.plans);
                
            }
        }, (err) => {
            this._authService.setLoader(false);
            this.toastrService.showError(err.message, 'Error');
        });

    }

    selectPlan(id: any, amount: number) {
        const checkoutDialog = this.dialog.open(CheckoutComponent, {
            data: {
                id: id,
                amount: amount
            },
            disableClose: true,
            backdropClass: 'backdropBackground',
            autoFocus: false,
        });

        checkoutDialog.afterClosed().subscribe((result: any) => {
        })
    }

    getParseData(data: any) {
        return JSON.parse(data);
    }
}
