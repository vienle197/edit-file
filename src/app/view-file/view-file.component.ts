import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppService} from "../services/app.service";
import {ActivatedRoute} from "@angular/router";
import {simplifyFraction} from "../helpers/math-helper";

@Component({
  selector: 'app-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.scss']
})
export class ViewFileComponent implements OnInit, AfterViewInit {
  fileInfo
  @ViewChild('invoicePreview') invoicePreview: ElementRef
  h = 500
  w = 200
  constructor(
    private appService: AppService,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fileInfo = this.activateRoute.snapshot.data.fileDetail
  }

  ngAfterViewInit() {
    this.writePreview(this.fileInfo.content)
    this.setDimensionDefault()
  }


  writePreview(content) {
    const doc = this.invoicePreview.nativeElement.contentDocument
    doc.open()
    doc.write(content)
    doc.close()
  }

  setDimensionDefault() {
    try {
      const iframe = document.querySelector('iframe') as HTMLIFrameElement
      const pageRef = iframe?.contentDocument?.querySelector('#page-container div')
      this.w = pageRef.clientWidth + 40
      this.h = pageRef.clientHeight + 40
    } catch (e) {
      setTimeout(() => {
        this.setDimensionDefault()
      }, 100)
    }
  }
}
