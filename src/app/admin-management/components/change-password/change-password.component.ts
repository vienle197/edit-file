import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppService} from "../../../services/app.service";
import {finalize} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup
  submitting: boolean = false;
  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      oldPassword: [null, [Validators.required]],
      password: [null, [Validators.required]],
    })
  }

  submit() {
    if(this.form.invalid || this.submitting) {
      this.form.markAllAsTouched()
      return
    }
    this.submitting = true
    this.appService.changePassword(this.form.value)
      .pipe(finalize(() => this.submitting = false))
      .subscribe(
        res => {
          this.toast.success('Thay đổi mật khẩu thành công!')
        },
        e => {
          this.toast.error('Thay đổi mật khẩu thất bại!')
        }
      )
  }
}
