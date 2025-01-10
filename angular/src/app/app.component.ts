import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'FBA System';
    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit(): void { }

    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }
}
