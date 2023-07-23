import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from "../../../services/app.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {finalize, startWith, Subject, switchMap, takeUntil} from "rxjs";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>()
  listOfData = []
  loading = false
  formSearch: FormGroup
  formPaging = this.fb.group({
    page: [1],
    size: [20]
  })
  submitting: boolean;
  isVisibleModal: boolean = false;
  formCreate: FormGroup

  showModal(): void {
    this.formCreate = this.fb.group({
      phone: [null, [Validators.required]],
      password: [null, [Validators.required]]
    })
    this.isVisibleModal = true;
  }

  handleCancel(): void {
    this.isVisibleModal = false;
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
            return this.appService.getUsers({
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

  submit() {
    if(this.submitting || this.formCreate.invalid) {
      this.formCreate.markAllAsTouched()
      return
    }
    this.submitting = true
    this.appService.createUser(this.formCreate.value)
      .pipe(finalize(() => this.submitting = false))
      .subscribe(
        () => {
          this.toast.success('Thêm mới thành công')
          this.isVisibleModal = false
          this.formPaging.patchValue({page: 1})
        },
        () => this.toast.error('Thêm mới thất bại'),
      )

  }
}
