import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import {AdminManagementRouting} from "./admin-management.routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FilesComponent } from './components/files/files.component';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzModalModule} from "ng-zorro-antd/modal";
import { FileByCustomerComponent } from './components/file-by-customer/file-by-customer.component';
import { UsersComponent } from './components/users/users.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import {SharesModule} from '../shares/shares.module';



@NgModule({
  declarations: [
    LoginComponent,
    FilesComponent,
    FileByCustomerComponent,
    UsersComponent,
    ChangePasswordComponent
  ],
    imports: [
        CommonModule,
        AdminManagementRouting,
        ReactiveFormsModule,
        NzTableModule,
        NzDividerModule,
        NzTagModule,
        NzButtonModule,
        NzIconModule,
        FormsModule,
        NzModalModule,
        SharesModule
    ]
})
export class AdminManagementModule { }
