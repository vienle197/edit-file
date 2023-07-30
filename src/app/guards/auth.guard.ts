import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'

// Stores
import {LocalStorageEnum} from "../app.enum";
import {environment} from "../../environments/environment";
import {AppService} from "../services/app.service";
import {catchError, EMPTY, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(
    private _router: Router,
    private _appService: AppService
  ) {
  }

  async canActivate() {
    let token = localStorage.getItem(LocalStorageEnum.ACCESS_TOKEN_KEY)
    if (token) {
      return this._appService.getUserProfile()
        .pipe(
          map(() => true),
          catchError(() => {
            this._router.navigateByUrl('/'+environment.adminPath+'/login')
            return EMPTY
          })
        )
        .toPromise()
    }
    this._router.navigateByUrl('/'+environment.adminPath+'/login')
    return false
  }
}
