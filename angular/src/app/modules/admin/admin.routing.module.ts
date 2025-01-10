import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from './common/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { AddRoleComponent } from './pages/role/add-role/add-role.component';
import { EditRoleComponent } from './pages/role/edit-role/edit-role.component';
import { RoleListComponent } from './pages/role/role-list/role-list.component';

import { AddUserComponent } from './pages/users/add-user/add-user.component';
import { EditUserComponent } from './pages/users/edit-user/edit-user.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';

import { ProfileComponent } from './pages/profile/profile.component';
import { AdminGuard } from 'src/app/guards/admin.guard';

import { OrdersCreationListComponent } from './pages/orders-creation/orders-creation-list/orders-creation-list.component';
import { CreateOrderCreationDetailComponent } from './pages/orders-creation/create-orders-creation-detail/create-orders-creation-detail.component';
import { EditOrderCreationDetailComponent } from './pages/orders-creation/edit-orders-creation-detail/edit-orders-creation-detail.component';
import { OrderListComponent } from './pages/order/order-list.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { GoogleSheetConfigListComponent } from './pages/google-sheet-config/google-sheet-config-list/google-sheet-config-list.component';
import { AddGoogleSheetConfigComponent } from './pages/google-sheet-config/add-google-sheet-config/add-google-sheet-config.component';
import { EditGoogleSheetConfigComponent } from './pages/google-sheet-config/edit-google-sheet-config/edit-google-sheet-config.component';
import { SubscriptionTransactionsComponent } from './pages/subscription-transactions/subscription-transactions.component';
import { SubscriptionsComponent } from './pages/subscriptions/subscriptions.component';
import { SubscriptionPlansComponent } from './pages/subscription-plans/subscription-plans-list/subscription-plans.component';
import { EditSubscriptionPlansComponent } from './pages/subscription-plans/edit-subscription-plans/edit-subscription-plans.component';
import { PromocodeListComponent } from './pages/promocode/promocode-list/promocode-list.component';
import { AddPromocodeComponent } from './pages/promocode/add-promocode/add-promocode.component';
import { EditPromocodeComponent } from './pages/promocode/edit-promocode/edit-promocode.component';
import { PackageListComponent } from './pages/packages/package-list/package-list.component';
import { AddPackageComponent } from './pages/packages/add-package/add-package.component';
import { EditPackageComponent } from './pages/packages/edit-package/edit-package.component';


export const adminRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    { path: '', loadChildren: () => import('src/app/modules/admin/admin-auth/admin-auth.module').then(m => m.AdminAuthModule) },
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard], data: { title: 'Dashboard' } },

            { path: 'profile', component: ProfileComponent, canActivate: [AdminGuard], data: { title: 'profile' } },

            { path: 'user-list', component: UserListComponent, canActivate: [AdminGuard], data: { permission: 'get', route: 'user', title: 'User List' } },
            { path: 'add-user', component: AddUserComponent, canActivate: [AdminGuard], data: { permission: 'create', route: 'user', title: 'Add User' } },
            { path: 'edit-user/:id', component: EditUserComponent, canActivate: [AdminGuard], data: { permission: 'update', route: 'user', title: 'Edit User' } },


            { path: 'package-list', component: PackageListComponent, canActivate: [AdminGuard], data: { permission: 'get', route: 'package', title: 'package List' } },
            { path: 'add-package', component: AddPackageComponent, canActivate: [AdminGuard], data: { permission: 'create', route: 'package', title: 'Add package' } },
            { path: 'edit-package/:id', component: EditPackageComponent, canActivate: [AdminGuard], data: { permission: 'update', route: 'package', title: 'Edit package' } },


            { path: 'promocode-list', component: PromocodeListComponent, canActivate: [AdminGuard], data: { permission: 'get', route: 'promocode', title: 'promocode List' } },
            { path: 'add-promocode', component: AddPromocodeComponent, canActivate: [AdminGuard], data: { permission: 'create', route: 'promocode', title: 'Add promocode' } },
            { path: 'edit-promocode/:id', component: EditPromocodeComponent, canActivate: [AdminGuard], data: { permission: 'update', route: 'promocode', title: 'Edit promocode' } },            
            
            { path: 'role-list', component: RoleListComponent, canActivate: [AdminGuard], data: { permission: 'get', route: 'role', title: 'role Role' } },
            { path: 'add-role', component: AddRoleComponent, canActivate: [AdminGuard], data: { permission: 'create', route: 'role', title: 'Add Role' } },
            { path: 'edit-role/:id', component: EditRoleComponent, canActivate: [AdminGuard], data: { permission: 'update', route: 'role', title: 'Edit Role' } },

            // { path: 'order-list', component: OrderListComponent, canActivate: [AdminGuard], data: { permission: 'get', route: 'admin', title: 'order creation List' } },
            
            { path: 'order-creation', component: OrdersCreationListComponent, canActivate: [AdminGuard], data: { permission: 'get', route: 'admin', title: 'order creation List' } },
            { path: 'order-creation-create', component: CreateOrderCreationDetailComponent, canActivate: [AdminGuard], data: { permission: 'create', route: 'admin', title: 'order creation create' } },
            { path: 'order-creation-edit/:id', component: EditOrderCreationDetailComponent, canActivate: [AdminGuard], data: { permission: 'update', route: 'admin', title: 'order creation edit' } },
           
            { path: 'analytics', component: AnalyticsComponent, canActivate: [AdminGuard], data: { permission: 'get', route: 'admin', title: 'analytics' } },     

            { path: 'google-sheet-list', component: GoogleSheetConfigListComponent, canActivate: [AdminGuard], data: { permission: 'get', route: 'google-sheet', title: 'Google Sheet List' } },
            { path: 'add-google-sheet', component: AddGoogleSheetConfigComponent, canActivate: [AdminGuard], data: { permission: 'create', route: 'role', title: 'Add Google Sheet' } },
            { path: 'edit-google-sheet/:id', component: EditGoogleSheetConfigComponent, canActivate: [AdminGuard], data: { permission: 'update', route: 'role', title: 'Edit Google Sheet' } },

            { path: 'plans', component: SubscriptionPlansComponent, canActivate: [AdminGuard], data: { permission: 'get', route: 'admin', title: 'Get Plan List' } },
            { path: 'plans/:id', component: EditSubscriptionPlansComponent, canActivate: [AdminGuard], data: { permission: 'put', route: 'admin', title: 'Edit Plan List' } },
            
            { path: 'suscription-transactions', component: SubscriptionTransactionsComponent, canActivate: [AdminGuard], data: { permission: 'get', route: 'admin', title: 'Get Transaction List' } },
            { path: 'subscriptions', component: SubscriptionsComponent, canActivate: [AdminGuard], data: { permission: 'get', route: 'admin', title: 'Get Subscribed Users List' } },

        ]
    },    
    // { path: '**', component: PageNotFoundComponent, data: { title: 'Page-Not-Found' } },
];
@NgModule({
    imports: [RouterModule.forRoot(adminRoutes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
