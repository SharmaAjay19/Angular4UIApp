import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {AdminComponent} from './components/admin/admin.component';
import {ErrorComponent} from './components/error/error.component';
import {RegisterComponent} from './components/register/register.component';


const routes: Routes = [
{ path: '',  component: RegisterComponent },
{ path: 'Register', component: RegisterComponent},
{ path: 'Login',  component: LoginComponent },
{ path: 'Home',  component: HomeComponent },
{ path: 'Admin',  component: AdminComponent },
{ path: 'Error', component: ErrorComponent},
{ path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
