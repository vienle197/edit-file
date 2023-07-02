import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private _http: HttpClient
  ) { }

  getContentTest() {
    return this._http.get('/assets/temp/test.html', {responseType: "text"})
  }

}
