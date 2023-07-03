import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  baseUrl = environment.api
  constructor(
    private _http: HttpClient
  ) { }

  getContentTest() {
    return this._http.get('/assets/temp/test.html', {responseType: "text"})
  }

  upload(file) {
    const form = new FormData()
    form.set('multipartFile', file)
    return this._http.post(this.baseUrl + '/process', form, {responseType: "text"})
  }

}
