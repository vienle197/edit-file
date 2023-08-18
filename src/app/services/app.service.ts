import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiServiceBase} from "./api-base";
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService extends ApiServiceBase{
  getFileInfo(id: string) {
    // return of({
    //   id: id,
    //   name: 'abcdef.png',
    // })
    return this._http.get(this.API_URL + '/file-info/' + id)
  }

  getListFiles(params: any= {}) {
    // return of([{
    //   id: 1,
    //   name: 'abcdef.png',
    //   phone: '1212121212121',
    // }])
    return this.makeGetRequest(this.API_URL + '/file-stores', {params}) as Observable<any>
  }

  removeFile(id) {
    return this._http.delete(this.API_URL + '/user/file/' + id) as Observable<any>
  }

  getListFilesCustomer(params: any= {}) {
    // return of([{
    //   id: 1,
    //   name: 'abcdef.png',
    //   phone: '1212121212121',
    // }])
    return this.makeGetRequest(this.API_URL + '/file-stores-customer', {params: {
        ...params,
        phone: params?.phone || ''
      }, noAuthorization: true}) as Observable<any>
  }

  uploadFile(data: FormData) {
    return this.makePostRequest(this.API_URL + '/user/save-file', {data})
  }
  customerUploadFile(data: FormData) {
    return this._http.post(this.API_URL + '/save-file-customer', data, {responseType: "text"})
  }

  getContentFile(id: string) {
    // return this._http.get('/assets/temp/test.html', {responseType: "text"})
    return this._http.get(this.API_URL + '/load/' + id, {responseType: "text"})
  }

  changePassword(data) {
    return this.makePostRequest(this.API_URL + '/user/update-password', {data})
  }

  createUser(data) {
    return this.makePostRequest(this.API_URL + '/admin/create-user', {data})
  }

  getUsers(data): Observable<any[]> {
    return this.makePostRequest(this.API_URL + '/admin/users', {data}) as Observable<any[]>
  }

  getUserProfile(): Observable<any[]> {
    return this.makeGetRequest(this.API_URL + '/user-profile') as Observable<any[]>
  }

}
