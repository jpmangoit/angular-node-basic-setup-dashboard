import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { imagePath } from 'src/environments/environment';



@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    userId: any;
    imagePath: any = imagePath;
    subscriptionDetails: any;

    constructor(public _authService: AuthService) {

    }
    ngOnInit(): void {
        let info: any = localStorage.getItem('user-data');
        let admin_info = JSON.parse(info);
        this.userId = admin_info.id;
        // this.getSubscription()
    }

    getSubscription() {
        const endPoint: string = '/user-subscription/user-subscription';
        this._authService.sendRequest('get', endPoint, '').subscribe((respData: any) => {
            if (respData?.isError == false) {
                if (respData?.result[0]) {
                    this.subscriptionDetails = respData?.result[0];
                }
            } else {
            }
        }, (err) => {
            console.log(err);            
        });

    }
    
}
