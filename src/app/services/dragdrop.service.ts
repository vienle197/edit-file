import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DragdropService {
  constructor(private http: HttpClient) { }
  addFiles(images: File) {
    let arr: any[] = []
    let formData = new FormData();
    arr.push(images);
    arr[0].forEach((item: any, i: number) => {
      formData.append('avatar', arr[0][i]);
    })
    return this.http.post('http://localhost:4000/api/create-user', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    )
  }
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
