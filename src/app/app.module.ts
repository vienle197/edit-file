import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {RouterOutlet} from "@angular/router";
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app.routing";
import {CKEditorModule} from "ckeditor4-angular";
import { EditComponent } from './edit/edit.component';
import {HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import { DragDropFileUploadDirective } from './directive/drag-drop-file-upload.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EditComponent,
    DragDropFileUploadDirective
  ],
    imports: [
        BrowserModule,
        RouterOutlet,
      AppRoutingModule,
      CKEditorModule,
      HttpClientModule,
      ReactiveFormsModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
