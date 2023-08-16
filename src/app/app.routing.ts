import {Route, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {FilesCustomerComponent} from "./files-customer/files-customer.component";
import {environment} from "../environments/environment";
import {CustomerFullComponent} from "./layouts/customer-full/customer-full.component";
import {YourFilesComponent} from "./your-files/your-files.component";
import {ViewFileComponent} from "./view-file/view-file.component";
import {ViewFileResolver} from "./view-file.resolver";
import {EditFileComponent} from './edit-file/edit-file.component';
import {EditFileResolver} from './edit-file.resolver';

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
      },
      {
        path: 'edit-file/:id/:name',
        component: EditFileComponent,
        resolve: {
          dataHtml: EditFileResolver
        }
      },
      {
        path: 'view/:id',
        component: ViewFileComponent,
        resolve: {
          fileDetail: ViewFileResolver
        }
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
