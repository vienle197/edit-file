import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from "../../../services/app.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {finalize, Subject} from "rxjs";

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
        },
        () => this.toast.error('Thêm mới thất bại'),
      )

  }
}
