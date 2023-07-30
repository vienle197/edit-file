import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppService} from "../services/app.service";
import {ToastrService} from "ngx-toastr";
import {finalize, startWith, Subject, switchMap, takeUntil} from "rxjs";
import {CKEditorComponent} from "ckeditor4-angular";
import {environment} from "../../environments/environment";
import {simplifyFraction} from "../helpers/math-helper";
import {Router} from "@angular/router";

@Component({
  selector: 'app-files-customer',
  templateUrl: './files-customer.component.html',
  styleUrls: ['./files-customer.component.scss']
})
export class FilesCustomerComponent implements OnInit, OnDestroy {
  urlBE = environment.api
  private destroy$: Subject<void> = new Subject<void>()
  @ViewChild('editor1') editor1: CKEditorComponent
  formInfo = this.fb.group({
    phone: [localStorage.getItem('phone'), [Validators.required]],
    // file: [null, [Validators.required]],
    width: [0, [Validators.required]],
    height: [0, [Validators.required]],
  })
  dimension = {
    width: 0,
    height: 0
  }
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
    removeButtons: 'PasteFromWord',
    contentsCss: '/assets/styles/ckeditor.css'
  }

  showModal(f): void {
    this.isVisibleUpload = true;
    this.fileActive = f
    this.formInfo.patchValue({width: 0, height: 0}, {emitEvent: false})
    this.getContentFile()
  }

  handleCancel(): void {
    this.isVisibleUpload = false;
  }
  constructor(
    private appService: AppService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
    this.destroy$.unsubscribe()
  }

  ngOnInit(): void {
    this.formInfo.get('width').valueChanges.subscribe(
      w => {
        this.formInfo.get('height').patchValue(Math.round(w * (this.dimension.height / this.dimension.width)), {emitEvent: false})
      }
    )
    this.formInfo.get('height').valueChanges.subscribe(
      h => {
        this.formInfo.get('width').patchValue(Math.round(h * (this.dimension.width / this.dimension.height)), {emitEvent: false})
      }
    )
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
          const parser = new DOMParser();
          const doc = parser.parseFromString(res, 'text/html');
          const newScss = document.createElement('style')
          newScss.textContent = "#page-container .page-content div:not(img) {\n" +
            "    border: 2px dashed #1890ff;\n" +
            "  }"
          newScss.setAttribute('id', 'mark-editor')
          doc.querySelector('head').append(newScss);
          this.dataHtml = new XMLSerializer().serializeToString(doc);
          setTimeout(() => {
            this.setDimensionDefault()
          }, 100)
        },
        e => {
          console.log(e)
          this.toast.error('Có lỗi xảy ra!')
          this.isVisibleUpload = false
        }
      )
  }

  setDimensionDefault() {
    try {
      const iframe = document.querySelector('ckeditor iframe') as HTMLIFrameElement
      const pageRef = iframe?.contentDocument?.querySelector('#page-container .page')
      const x = simplifyFraction(pageRef.clientWidth, pageRef.clientHeight)
      this.dimension = {
        width: x[0],
        height: x[1],
      }
      this.formInfo.patchValue(this.dimension, {emitEvent: false})
    } catch (e) {
      setTimeout(() => {
        this.setDimensionDefault()
      }, 100)
    }
  }

  submitFile() {
    if(this.formInfo.invalid) {
      this.formInfo.markAllAsTouched()
      return
    }
    this.uploading = true
    const content = this.editor1.data
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    doc.querySelector('#mark-editor').remove()
    const pdfBlob = new Blob([new XMLSerializer().serializeToString(doc)], { type: 'application/html' });
    const formData = new FormData()
    formData.append('file', pdfBlob)
    formData.append('name', `${this.fileActive.name}-${this.formInfo.value.phone}`)
    formData.append('phone', this.formInfo.value.phone)
    formData.append('height', `${this.formInfo.value.height}`)
    formData.append('width', `${this.formInfo.value.width}`)
    this.appService.customerUploadFile(formData)
      .pipe(finalize(() => this.uploading = false))
      .subscribe(
      id => {
        localStorage.setItem('phone', this.formInfo.value.phone)
        this.toast.success('Chốt file thành công')
        this.router.navigateByUrl('/view/' + id)
        this.isVisibleUpload = false
      }
    )
  }
}
