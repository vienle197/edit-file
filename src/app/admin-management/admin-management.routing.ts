import {Route, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {LoginComponent} from "./components/login/login.component";
import {BlankComponent} from "../layouts/blank/blank.component";
import {FilesComponent} from "./components/files/files.component";
import {FullComponent} from "../layouts/full/full.component";
import {AuthGuard} from "../guards/auth.guard";
import {FileByCustomerComponent} from "./components/file-by-customer/file-by-customer.component";
import {UsersComponent} from "./components/users/users.component";
import {ChangePasswordComponent} from "./components/change-password/change-password.component";

const router: Route[] = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: '',
        component: FullComponent,
        children: [
          {
            path: 'files',
            component: FilesComponent
          },
          {
            path: 'customer-files',
            component: FileByCustomerComponent
          },
          {
            path: 'users',
            component: UsersComponent
          },
          {
            path: 'change-password',
            component: ChangePasswordComponent
          }
        ],
        canActivate: [AuthGuard]
      },
    ]
  },
  // {
  //   path: '**',
  //   redirectTo: '/login'
  // }
]
@NgModule({
  imports: [
    RouterModule.forChild(router)
  ]
})
export class AdminManagementRouting { }
