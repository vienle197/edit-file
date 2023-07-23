import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {ToastrService} from "ngx-toastr";
import {LocalStorageEnum} from "../../../app.enum";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  loginStatus = null // 1 success, 2 failed

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._initForm()
  }

  _initForm() {
    this.loginForm = this.fb.group({
      phone:  [null, [Validators.required]],
      password:  [null, [Validators.required]],
    })
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }
    this.authService.login(this.loginForm.value)
      .subscribe(
        res => {
          localStorage.setItem(LocalStorageEnum.ACCESS_TOKEN_KEY, res.content)
          this.toast.success('Đăng nhập thành công!')
          this.loginStatus = 1
          this.router.navigateByUrl('/'+environment.adminPath+'/files')
        },
        error => {
          this.loginStatus = 2
          this.toast.error('Tài khoản hoặc mật khẩu không chính xác!', 'Đăng nhập thất bại')
        }
      )
  }
}
