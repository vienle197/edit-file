import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AppRoutingModule} from "./app.routing";
import {CKEditorModule} from "ckeditor4-angular";
import {EditComponent} from './edit/edit.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {DragDropFileUploadDirective} from './directive/drag-drop-file-upload.directive';
import {FullComponent} from "./layouts/full/full.component";
import {BlankComponent} from "./layouts/blank/blank.component";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LOCALE_ID} from '@angular/core';
import en from '@angular/common/locales/en';
import zh from '@angular/common/locales/zh';
import {registerLocaleData} from "@angular/common";

registerLocaleData(en);
registerLocaleData(zh);

import {en_US, NZ_I18N, fr_FR, vi_VN} from 'ng-zorro-antd/i18n';
import vi from '@angular/common/locales/vi';
import {IconsProviderModule} from './icons-provider.module';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {ValidateAccessTokenInterceptor} from "./interceptors/validate-access-token.interceptor";
import {FilesCustomerComponent} from "./files-customer/files-customer.component";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzModalModule} from "ng-zorro-antd/modal";
import {CustomerFullComponent} from "./layouts/customer-full/customer-full.component";
import {YourFilesComponent} from "./your-files/your-files.component";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzCardModule} from "ng-zorro-antd/card";
import {ModalViewFileComponent} from "./modal-view-file/modal-view-file.component";
import {ViewFileComponent} from "./view-file/view-file.component";
import {EditFileComponent} from './edit-file/edit-file.component';
import {NzButtonModule} from 'ng-zorro-antd/button';

@NgModule({
  declarations: [
    AppComponent,
    EditComponent,
    DragDropFileUploadDirective,
    FullComponent,
    BlankComponent,
    FilesCustomerComponent,
    CustomerFullComponent,
    YourFilesComponent,
    ModalViewFileComponent,
    ViewFileComponent,
    EditFileComponent
  ],
    imports: [
        BrowserModule,
        RouterOutlet,
        BrowserAnimationsModule,
        AppRoutingModule,
        CKEditorModule,
        HttpClientModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
            preventDuplicates: true,
            countDuplicates: true,
            autoDismiss: true,
            maxOpened: 3,
            resetTimeoutOnDuplicate: true,
            tapToDismiss: false,
            closeButton: true,
            enableHtml: true
        }),
        FormsModule,
        IconsProviderModule,
        NzLayoutModule,
        NzMenuModule,
        NzToolTipModule,
        RouterLinkActive,
        RouterLink,
        NzGridModule,
        NzModalModule,
        NzTableModule,
        NzTagModule,
        NzCardModule,
        NzButtonModule,
    ],
  bootstrap: [AppComponent],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ValidateAccessTokenInterceptor, multi: true},
    {
      provide: NZ_I18N,
      useFactory: (localId: string) => {
        switch (localId) {
          case 'en':
            return en_US;
          /** keep the same with angular.json/i18n/locales configuration **/
          case 'fr':
            return fr_FR;
          default:
            return en_US;
        }
      },
      deps: [LOCALE_ID]
    }
  ]
})
export class AppModule {
}
