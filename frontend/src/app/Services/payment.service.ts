/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { environment } from '../../environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators'

interface Card {
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly hostServer = environment.hostServer
  private readonly host = this.hostServer + '/api/Cards'

  constructor (private readonly http: HttpClient) { }

  get () {
    return this.http.get<Card>(this.host).pipe(map((response) => response.data), catchError((err) => { throw err }))
  }

  getById (id: number) {
    return this.http.get<Card>(`${this.host}/${id}`).pipe(map((response) => response.data), catchError((err: Error) => { throw err }))
  }

  save (params: any) {
    return this.http.post<Card>(this.host + '/', params).pipe(map((response) => response.data), catchError((err) => { throw err }))
  }

  del (id: number) {
    return this.http.delete<Card>(`${this.host}/${id}`).pipe(map((response) => response.data), catchError((err) => { throw err }))
  }
}