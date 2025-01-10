import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {  HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { adminRoutes } from './admin.routing.module';

import { HeaderComponent } from './common/header/header.component';
import { SideBarComponent } from './common/side-bar/side-bar.component';
import { LayoutComponent } from './common/layout/layout.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FooterComponent } from './common/footer/footer.component';
import { MaterialModule } from 'src/app/material.module';
import { UserListComponent } from './pages/users/user-list/user-list.component';

import { EditUserComponent } from './pages/users/edit-user/edit-user.component';
import { AddUserComponent } from './pages/users/add-user/add-user.component';

import { RoleListComponent } from './pages/role/role-list/role-list.component';
import { AddRoleComponent } from './pages/role/add-role/add-role.component';
import { EditRoleComponent } from './pages/role/edit-role/edit-role.component';

import { ProfileComponent } from './pages/profile/profile.component';

import { ConfirmationDialogComponent } from './pages/shared/confirmation-dialog/confirmation-dialog.component';
import { ViewPermissionsDialogComponent } from './pages/role/view-permissions-dialog/view-permissions-dialog.component';

import { DatePipe } from '@angular/common';
import { ViewDetailsDialogComponent } from './pages/shared/view-details-dialog/view-details-dialog.component';
import { TagInputModule } from 'ngx-chips';
import { AdminAuthModule } from './admin-auth/admin-auth.module';


@NgModule({
    declarations: [
        EditRoleComponent,
        AddRoleComponent,
        HeaderComponent,
        SideBarComponent,
        LayoutComponent,
        DashboardComponent,
        FooterComponent,
        UserListComponent,
        RoleListComponent,
        EditUserComponent,
        AddUserComponent,
        ConfirmationDialogComponent,
        ProfileComponent,
        ViewPermissionsDialogComponent,
        ViewDetailsDialogComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forChild(adminRoutes),
        ToastrModule.forRoot({
            timeOut: 3000,
            disableTimeOut: false,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            closeButton: false,
        }),
        MaterialModule,
        DragDropModule,
        TagInputModule,
        AdminAuthModule 
    ],
    providers: [DatePipe,DecimalPipe],
    entryComponents: [
        ConfirmationDialogComponent,
    ]
})
export class AdminModule { }
