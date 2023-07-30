import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {catchError, EMPTY, forkJoin, map, merge, Observable, of} from 'rxjs';
import {AppService} from "./services/app.service";

@Injectable({
  providedIn: 'root'
})
export class ViewFileResolver implements Resolve<boolean> {
  constructor(
    private router: Router,
    private appService: AppService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.params?.id
    if (!id) {
      this.router.navigateByUrl('/')
      return of({});
    }
    return forkJoin({
      content: this.appService.getContentFile(id),
      info: this.appService.getFileInfo(id)
    }).pipe(
      catchError(() => {
        this.router.navigateByUrl('/')
        return EMPTY
      })
    )
  }
}
