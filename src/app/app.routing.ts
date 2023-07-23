import {Route, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {FilesCustomerComponent} from "./files-customer/files-customer.component";
import {environment} from "../environments/environment";
import {CustomerFullComponent} from "./layouts/customer-full/customer-full.component";
import {YourFilesComponent} from "./your-files/your-files.component";

const router: Route[] = [
  {
    path: '',
    component: CustomerFullComponent,
    children: [
      {
        path: '',
        component: FilesCustomerComponent,
      },
      {
        path: 'your-files',
        component: YourFilesComponent,
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: environment.adminPath,
        loadChildren: () => import('./admin-management/admin-management.module').then(a => a.AdminManagementModule)
      },
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
]
@NgModule({
  imports: [
    RouterModule.forRoot(router)
  ]
})
export class AppRoutingModule { }
