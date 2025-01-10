import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

    constructor(public _authService: AuthService, private readonly changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit(): void {
    }
    
    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }
}
