import { Injectable } from '@angular/core'
import { ActivatedRoute, NavigationStart, Router } from '@angular/router'
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http'
import { Observable, EMPTY, throwError } from 'rxjs'
import { catchError, filter } from 'rxjs/operators'
import { ToastrService } from 'ngx-toastr'

const ERROR_CODE_AUTHENTICATION = 401

@Injectable()
export class ValidateAccessTokenInterceptor implements HttpInterceptor {
  urlAttempted:  string

  constructor(
    private _router: Router,
    private _activateRoute: ActivatedRoute,
    private _toast: ToastrService,
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status == ERROR_CODE_AUTHENTICATION) {
          this._toast.error('Bạn không có quyền truy cập')
          this._router.navigate(
            ['/'],
            {
              queryParams: { redirect_url: this.urlAttempted, errorMessage: err.error.messages }
            })
          return EMPTY
        }
        return throwError(err)
      })
    )
  }
}
