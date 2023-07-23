import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'

// Stores
import {LocalStorageEnum} from "../app.enum";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(
    private _router: Router,
  ) {
  }

  async canActivate() {
    let token = localStorage.getItem(LocalStorageEnum.ACCESS_TOKEN_KEY)
    if (token) {
      return true
    }
    this._router.navigateByUrl('/'+environment.adminPath+'/login')
    return false
  }
}
