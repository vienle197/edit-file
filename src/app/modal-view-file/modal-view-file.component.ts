import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {finalize} from "rxjs";
import {AppService} from "../services/app.service";
import {NzModalRef} from "ng-zorro-antd/modal";
import {simplifyFraction} from "../helpers/math-helper";

@Component({
  selector: 'app-modal-view-file',
  templateUrl: './modal-view-file.component.html',
  styleUrls: ['./modal-view-file.component.scss']
})
export class ModalViewFileComponent implements OnInit, AfterViewInit {
  @ViewChild('invoicePreview') invoicePreview: ElementRef
  @Input() idFile
  isVisibleViewFile: boolean = false;
  loadingViewFile: boolean = false;
  w = 200
  h = 500
  fileInfo
  constructor(private appService: AppService, private modal: NzModalRef) { }

  ngOnInit(): void {
    this.infoFile(this.idFile)
  }
  ngAfterViewInit() {
    this.viewFile(this.idFile)
  }

  viewFile(id) {
    this.isVisibleViewFile = true
    this.loadingViewFile = true
    this.appService.getContentFile(id)
      .pipe(finalize(() => this.loadingViewFile = false))
      .subscribe(
        data => this.writePreview(data)
      )
  }
  infoFile(id) {
    this.appService.getFileInfo(id)
      .pipe(finalize(() => this.loadingViewFile = false))
      .subscribe(
        data => this.fileInfo = data
      )
  }

  setDimensionDefault() {
    try {
      const iframe = document.querySelector('iframe') as HTMLIFrameElement
      const pageRef = iframe?.contentDocument?.querySelector('#page-container div')
      console.log(pageRef)
      console.log(pageRef.clientWidth, pageRef.clientHeight)
      const x = simplifyFraction(pageRef.clientWidth, pageRef.clientHeight)
      this.w = x[0] + 40
      this.h = x[1] + 40
    } catch (e) {
      setTimeout(() => {
        this.setDimensionDefault()
      }, 100)
    }
  }

  writePreview(content) {
    const doc = this.invoicePreview?.nativeElement?.contentDocument
    doc.open()
    doc.write(content)
    doc.close()
    this.setDimensionDefault()
  }
}
