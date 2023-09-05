import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from "../../../services/app.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {finalize, startWith, Subject, switchMap, takeUntil} from "rxjs";
import {NzModalService} from "ng-zorro-antd/modal";
import {ModalViewFileComponent} from "../../../modal-view-file/modal-view-file.component";

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>()
  formUpload = this.fb.group({
    name: [null, [Validators.required]],
    file: [null, [Validators.required]]
  })
  fileSelected: File
  // @ViewChild()
  listOfData = []
  loading = false
  uploading = false
  formSearch: FormGroup
  formPaging = this.fb.group({
    page: [1],
    size: [20]
  })
  isVisibleUpload: boolean = false;

  showModal(): void {
    this.formUpload.reset()
    this.isVisibleUpload = true;
  }

  handleCancel(): void {
    this.isVisibleUpload = false;
  }
  constructor(
    private appService: AppService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private modalService: NzModalService
  ) { }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
    this.destroy$.unsubscribe()
  }
  onSearch() {
    this.formPaging.patchValue({page: 1})
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
        e => this.toast.error('Có lỗi xảy ra!')
      )
  }

 onChangeFile(e) {
   const fileListAsArray = (e as File[]);
   if(!fileListAsArray.length) {
     return
   }
   this.fileSelected = fileListAsArray[0]
 }

  uploadFile() {
    if(this.formUpload.invalid) {
      this.formUpload.markAllAsTouched()
      return
    }
    this.uploading = true
    this.toast.info('Đang thực hiện upload...')
    const formData = new FormData()
    formData.append('file', this.fileSelected)
    formData.append('name', this.formUpload.value.name)
    this.appService.uploadFile(formData)
      .pipe(finalize(() => this.uploading = false))
      .subscribe(
        res => {
          this.toast.success('Upload file thành công!')
          this.formPaging.patchValue({page: 1})
          this.isVisibleUpload = false
        },
        e => this.toast.error('Upload file thất bại!')
      )
  }
}
