/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { environment } from '../../environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class QuantityService {
  private readonly hostServer = environment.hostServer
  private readonly host = this.hostServer + '/api/Quantitys'

  constructor (private readonly http: HttpClient) { }

  getAll () {
    return this.http.get(this.host + '/').pipe(map((response: { data: any[] }) => response.data), catchError((err) => { throw err }))
  }

  put (id: number, params: any) {
    return this.http.put(`${this.host}/${id}`, params).pipe(map((response: { data: any }) => response.data), catchError((error) => { throw error }))
  }
}