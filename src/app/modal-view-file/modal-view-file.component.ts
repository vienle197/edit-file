import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {finalize} from "rxjs";
import {AppService} from "../services/app.service";
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-modal-view-file',
  templateUrl: './modal-view-file.component.html',
  styleUrls: ['./modal-view-file.component.scss']
})
export class ModalViewFileComponent implements OnInit {
  @ViewChild('invoicePreview') invoicePreview: ElementRef
  @Input() idFile
  isVisibleViewFile: boolean = false;
  loadingViewFile: boolean = false;
  constructor(private appService: AppService, private modal: NzModalRef) { }

  ngOnInit(): void {
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

  writePreview(content) {
    const doc = this.invoicePreview.nativeElement.contentDocument
    doc.open()
    doc.write(content)
    doc.close()
  }
}
