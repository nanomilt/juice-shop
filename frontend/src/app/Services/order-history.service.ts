/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { environment } from '../../environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators'
import { Order } from '../models/order.model'

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private readonly hostServer = environment.hostServer
  private readonly host = this.hostServer + '/rest/order-history'

  constructor (private readonly http: HttpClient) { }

  get () {
    return this.http.get<Order[]>(this.host).pipe(map((response) => response.data), catchError((err) => { throw err }))
  }

  getAll () {
    return this.http.get<Order[]>(this.host + '/orders').pipe(map((response) => response.data), catchError((err) => { throw err }))
  }

  toggleDeliveryStatus (id: number, params: any) {
    return this.http.put<Order>(`${this.host}/${id}/delivery-status`, params).pipe(map((response) => response.data), catchError((err) => { throw err }))
  }
}