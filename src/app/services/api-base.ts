import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Inject, Injectable } from '@angular/core'
import {environment as env} from "../../environments/environment";
import {LocalStorageEnum} from "../app.enum";

export interface ResponseAPI {
  content: string
  errorCode: string
  errors: any
  pageInfo: any
  timeCall: any
  timestamp: number
}

export class CustomHttpParamEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key)
  }
  encodeValue(value: string): string {
    return encodeURIComponent(value)
  }
  decodeKey(key: string): string {
    return decodeURIComponent(key)
  }
  decodeValue(value: string): string {
    return decodeURIComponent(value)
  }
}

type HttpGetOption = {
  noAuthorization?: boolean
  params?: { [key: string]: any }
  responseType?: any
}

type HttpDeleteOption = {
  noAuthorization?: boolean
  params?: { [key: string]: any }
  responseType?: any
}

type HttpPatchOption = {
  noAuthorization?: boolean
  data?: any
  params?: { [key: string]: any }
}

type HttpPostOption = {
  responseType?: any
  noAuthorization?: boolean
  data?: any
  params?: { [key: string]: any }
}

@Injectable()
export abstract class ApiServiceBase {
  API_URL: string = env.api
  protected headers: HttpHeaders

  constructor(
    @Inject(HttpClient) protected _http: HttpClient
  ) {
    this.headers = new HttpHeaders({
      Authorization: ''
    })
  }

  private static encodeParams(params: { [key: string]: any }): HttpParams {
    let cloneParams = new HttpParams({ encoder: new CustomHttpParamEncoder() })
    if (!!params) {
      Object.keys(params).forEach(key => {
        cloneParams = cloneParams.append(key, params[key])
      })
    }

    return cloneParams
  }

  private static  createHeader(noAuthorization: boolean = false, hideError: boolean = false, redirectNotFound=false): HttpHeaders {
    let options = {}
    const token =localStorage.getItem(LocalStorageEnum.ACCESS_TOKEN_KEY)
    if (!noAuthorization && token) {
      options = { ...options, Authorization: token}
    }
    if(hideError) {
      options = { ...options, hideError: '1' }
    }
    if(redirectNotFound) {
      options = { ...options, redirectNotFound: '1' }
    }
    return new HttpHeaders(options)
  }

  protected makeGetRequest(url: string, options?: HttpGetOption, hideError = false, redirectNotFound = false): Observable<ResponseAPI|any|any[]>{
    return this._http.get(url, {
      headers: ApiServiceBase.createHeader(options?.noAuthorization, hideError, redirectNotFound),
      params: ApiServiceBase.encodeParams(options?.params),
      responseType: options?.responseType
    }) as Observable<ResponseAPI|any|any[]>
  }

  protected makeGetRequestOr404(url: string, options?: HttpGetOption): Observable<ResponseAPI|any|any[]>{
    return this.makeGetRequest(url, options, true, true)
  }

  protected makePatchRequest(url: string, options?: HttpPatchOption, hideError = false): Observable<ResponseAPI|any|any[]>{
    return this._http.patch(url, options?.data, {
      headers: ApiServiceBase.createHeader(options?.noAuthorization, hideError),
      params: ApiServiceBase.encodeParams(options?.params),
    }) as Observable<ResponseAPI|any|any[]>
  }

  protected makePostRequest(url: string, options?: HttpPostOption): Observable<ResponseAPI|any|any[]>{
    return this._http.post(url, options?.data, {
      headers: ApiServiceBase.createHeader(options?.noAuthorization),
      params: options?.params
    }) as Observable<ResponseAPI|any|any[]>
  }

  protected makeDeleteRequest(url: string, options?: HttpDeleteOption): Observable<ResponseAPI|any|any[]>{
    return this._http.delete(url, {
      headers: ApiServiceBase.createHeader(options?.noAuthorization),
      params: options?.params
    }) as Observable<ResponseAPI|any|any[]>
  }
}
