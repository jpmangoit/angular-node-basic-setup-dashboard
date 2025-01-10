import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
    isShowDiv = false;
    walmartAuthorize:any;
    amazonAuthorize:any;

    constructor(@Inject(DOCUMENT) private document: Document) { }

    ngOnInit(): void {
      localStorage.getItem('walmartAuthorize');
       localStorage.getItem('amazonAuthorize');

        const sidebar: any = this.document.getElementById('sidebar');
        const btn: any = this.document.getElementById('sidebar-toggle');
        let toggle = false;
        btn.addEventListener('click', (e: any) => {
            toggle = toggle == false ? true : false;
            if (toggle) {
                sidebar.classList.add('collapsed');
            } else {
                sidebar.classList.remove('collapsed');
            }
        });

        const sidebar_links: HTMLCollectionOf<Element> = this.document.getElementsByClassName('sidebar-link');

        // Convert the HTMLCollection to an array for easier iteration
        const linksArray = Array.from(sidebar_links);

        // Attach event listener to each element in the array
        linksArray.forEach((link: Element) => {
            link.addEventListener('click', (e: Event) => {                
                const isMobile = window.innerWidth < 768;
                if (isMobile) {
                    sidebar.classList.remove('collapsed');
                }
            });
        });
    }
}
