import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-auth-layout',
    templateUrl: './auth-layout.component.html',
    styleUrls: ['./auth-layout.component.css']
})
export class AuthLayouComponent implements OnInit {

    constructor(public _authService: AuthService, private cdr: ChangeDetectorRef) { }

    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }

    ngOnInit(): void {
    }

}
