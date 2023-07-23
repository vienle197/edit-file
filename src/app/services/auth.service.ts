import { Injectable } from '@angular/core';
import {ApiServiceBase} from "./api-base";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiServiceBase{

  login(data) {
    const url = this.API_URL + '/auth/login'
    return this.makePostRequest(url, {data: data, noAuthorization: true})
  }
}
