import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppService} from "../services/app.service";
import {ToastrService} from "ngx-toastr";
import {finalize, startWith, Subject, switchMap, takeUntil} from "rxjs";
import {CKEditorComponent} from "ckeditor4-angular";

@Component({
  selector: 'app-files-customer',
  templateUrl: './files-customer.component.html',
  styleUrls: ['./files-customer.component.scss']
})
export class FilesCustomerComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>()
  @ViewChild('editor1') editor1: CKEditorComponent
  formInfo = this.fb.group({
    phone: [localStorage.getItem('phone'), [Validators.required]],
    // file: [null, [Validators.required]],
  })
  listOfData = []
  loading = false
  uploading = false
  gettingFile = false
  formSearch: FormGroup
  formPaging = this.fb.group({
    page: [1],
    size: [20]
  })
  isVisibleUpload: boolean = false;
  fileActive
  dataHtml
  configCkeditor = {
    fullPage: true,
    extraPlugins: 'docprops',
    // Disable content filtering because if you use full page mode, you probably
    // want to  freely enter any HTML content in source mode without any limitations.
    allowedContent: true,
    height: 'height: calc(100vh - 15rem);',
    removeButtons: 'PasteFromWord'
  }

  showModal(f): void {
    this.isVisibleUpload = true;
    this.fileActive = f
    this.getContentFile()
  }

  handleCancel(): void {
    this.isVisibleUpload = false;
  }
  constructor(
    private appService: AppService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
    this.destroy$.unsubscribe()
  }

  ngOnInit(): void {
    this.formSearch = this.fb.group({
    })
    this.formPaging.valueChanges
      .pipe(
        startWith(this.formPaging.value),
        takeUntil(this.destroy$),
        switchMap(
          paging => {
            this.loading = true
            return this.appService.getListFiles({
              ...paging,
              ...this.formSearch.value
            }).pipe(finalize(() => this.loading = false))
          }
        )
      )
      .subscribe(
        res => {
          this.listOfData = res
        },
        e => {
          this.toast.error('Có lỗi xảy ra!')
          console.error(e)
        }
      )
  }

  getContentFile() {
    this.gettingFile = true
    this.appService.getContentFile(this.fileActive?.id)
      .pipe(finalize(() => this.gettingFile = false))
      .subscribe(
        res => {
          this.dataHtml = res
          // this.listOfData = res
        },
        e => {
          console.log(e)
          this.toast.error('Có lỗi xảy ra!')
          this.isVisibleUpload = false
        }
      )
  }

  submitFile() {
    if(this.formInfo.invalid) {
      this.formInfo.markAllAsTouched()
      return
    }
    this.uploading = true
    const pdfBlob = new Blob([this.editor1.data], { type: 'application/html' });
    const formData = new FormData()
    formData.append('file', pdfBlob)
    formData.append('name', `${this.fileActive.name}-${this.formInfo.value.phone}`)
    formData.append('phone', this.formInfo.value.phone)
    this.appService.customerUploadFile(formData)
      .pipe(finalize(() => this.uploading = false))
      .subscribe(
      res => {
        localStorage.setItem('phone', this.formInfo.value.phone)
        this.toast.success('Chốt file thành công')
        this.isVisibleUpload = false
      }
    )
  }
}
