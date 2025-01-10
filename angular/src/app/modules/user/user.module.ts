import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';


import { userRoutes } from './user.routing.module';

import { HeaderComponent } from './common/header/header.component';
import { SideBarComponent } from './common/side-bar/side-bar.component';
import { LayoutComponent } from './common/layout/layout.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FooterComponent } from './common/footer/footer.component';
import { MaterialModule } from 'src/app/material.module';

import { ProfileComponent } from './pages/profile/profile.component';
import { ConfirmationDialogComponent } from '../admin/pages/shared/confirmation-dialog/confirmation-dialog.component';
import { ViewDetailsDialogComponent } from '../admin/pages/shared/view-details-dialog/view-details-dialog.component';


@NgModule({
    declarations: [
        HeaderComponent,
        SideBarComponent,
        LayoutComponent,
        DashboardComponent,
        FooterComponent,
        ConfirmationDialogComponent,
        ProfileComponent,
        ViewDetailsDialogComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forChild(userRoutes),
        ToastrModule.forRoot({
            timeOut: 3000,
            disableTimeOut: false,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            closeButton: false,
        }),
        MaterialModule,
        DragDropModule, 
    ],
    providers: [DatePipe, DecimalPipe],
})
export class UserModule { }
