import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/user/pages/shared/page-not-found/page-not-found.component';
import { AboutUsComponent } from './modules/user/pages/shared/about-us/about-us.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },

  { path: 'auth', loadChildren: () => import('src/app/modules/auth/auth.module').then(m => m.AuthModule) },

  { path: 'user', loadChildren: () => import('src/app/modules/user/user.module').then(m => m.UserModule) },

  { path: 'admin', loadChildren: () => import('src/app/modules/admin/admin.module').then(m => m.AdminModule) },
  
  { path: 'about-us', component: AboutUsComponent, data: { title: 'about-us' } },

  { path: '**', component: PageNotFoundComponent, data: { title: 'Page-Not-Found' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
