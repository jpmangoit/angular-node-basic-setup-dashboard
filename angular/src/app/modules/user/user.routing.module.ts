import { NgModule } from '@angular/core';
import { Route } from '@angular/router';
import { RouterModule } from '@angular/router';

import { LayoutComponent } from './common/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';


import { ProfileComponent } from './pages/profile/profile.component';
import { UserGuard } from 'src/app/guards/user.guard';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { PageNotFoundComponent } from './pages/shared/page-not-found/page-not-found.component';
import { TrackingListComponent } from './pages/tracking/tracking-list.component';
import { OrderListComponent } from './pages/orders/order-list/order-list.component';
import { CreateOrderDetailComponent } from './pages/orders/create-order-detail/create-order-detail.component';
import { EditOrderDetailComponent } from './pages/orders/edit-order-detail/edit-order-detail.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { AuthenticatePlatformComponent } from '../auth/pages/authenticate-platform/authenticate-platform.component';
import { ProductInventoryListComponent } from './pages/product-inventory/product-inventory-list/product-inventory-list.component';
import { EditProductInventoryComponent } from './pages/product-inventory/edit-product-inventory/edit-product-inventory.component';
import { AddProductInventoryComponent } from './pages/product-inventory/add-product-inventory/add-product-inventory.component';
import { ProductsComponent } from './pages/products/products.component';
import { SubscriptionDetailsComponent } from './pages/subscription-details/subscription-details.component';


export const userRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }, {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'configure-platform', component: AuthenticatePlatformComponent, canActivate: [UserGuard], data: { title: 'configure platform' } },

            { path: 'dashboard', component: DashboardComponent, canActivate: [UserGuard], data: { title: 'Dashboard' } },

            { path: 'contact-us', component: ContactUsComponent, canActivate: [UserGuard], data: { title: 'contact-us' } },

            { path: 'products', component: ProductsComponent, canActivate: [UserGuard], data: { title: 'products' } },

            { path: 'profile', component: ProfileComponent, canActivate: [UserGuard], data: { title: 'profile' } },
            
            // { path: 'subscription', component: SubscriptionDetailsComponent, canActivate: [UserGuard], data: { title: 'subscription' } },

            { path: 'order-list', component: OrderListComponent, canActivate: [UserGuard], data: { permission: 'get', route: 'user', title: 'order List' } },

            { path: 'order-create', component: CreateOrderDetailComponent, canActivate: [UserGuard], data: { permission: 'get', route: 'user', title: 'order List' } },
            
            { path: 'order-edit/:id', component: EditOrderDetailComponent, canActivate: [UserGuard], data: { permission: 'get', route: 'user', title: 'order List' } },

            { path: 'product-inventory', component: ProductInventoryListComponent, canActivate: [UserGuard], data: { permission: 'get', route: 'user', title: 'product List' } },

            { path: 'add-product-inventory/:id', component: AddProductInventoryComponent, canActivate: [UserGuard], data: { permission: 'get', route: 'user', title: 'add product' } },
            
            { path: 'edit-product-inventory/:id', component: EditProductInventoryComponent, canActivate: [UserGuard], data: { permission: 'get', route: 'user', title: 'edit product' } },
                       
            // { path: 'tracking', component: TrackingListComponent, canActivate: [UserGuard], data: { permission: 'get', route: 'user', title: 'order tracking' } },

            { path: 'analytics', component: AnalyticsComponent, canActivate: [UserGuard], data: { permission: 'get', route: 'user', title: 'analytics' } },
        
            { path: '**', component: PageNotFoundComponent, data: { title: 'Page-Not-Found' } },
        ]
    },
];
@NgModule({
    imports: [RouterModule.forRoot(userRoutes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
