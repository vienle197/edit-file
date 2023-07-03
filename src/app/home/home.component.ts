import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {AppService} from "../services/app.service";
import {CKEditorComponent} from "ckeditor4-angular";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('editor1') editor1: CKEditorComponent
  fileObj: any
  msg?: string;
  progress: number = 0;
  formInfo: FormGroup = this.fb.group({
    phone: [null, [Validators.required]],
    dimension: [null]
  })
  editFileAble = false
  configCkeditor = {
    fullPage: true,
    extraPlugins: 'docprops',
    // Disable content filtering because if you use full page mode, you probably
    // want to  freely enter any HTML content in source mode without any limitations.
    allowedContent: true,
    height: 'calc(100vh - 20rem)',
    removeButtons: 'PasteFromWord'
  }

  dataHtml = ''
  constructor(
    public fb: FormBuilder,
    private appService: AppService,
    private sanitizer: DomSanitizer,
  ) {
  }
  ngOnInit() {
  }
  _handleUploadFile(file: any) {
    const url = URL.createObjectURL(file);
    this.fileObj = { item: file, url: url };
  }
  upload(e: any) {
    // Single upload
    const fileListAsArray = (e as HTMLInputElement[]);
    if(!fileListAsArray.length) {
      return
    }
    this._handleUploadFile(fileListAsArray[0])
  }
  // Clean Url
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  removeFile() {
    this.fileObj = null
  }

  setEditFileAble(v: boolean) {
    this.editFileAble = v
    if(v) {
      this.appService.upload(this.fileObj).subscribe(
        r => {
          this.dataHtml = r
        }
      )
      this.appService.getContentTest().subscribe(
        r => {
          if(!this.dataHtml) {
            this.dataHtml = r
          }
        }
      )
    }
  }

  submit() {
    let elementHTML = this.editor1.data;
    let mywindow = window.open('', 'PRINT');

    mywindow.document.write(elementHTML);

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();
  }
}
