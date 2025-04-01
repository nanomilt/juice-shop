/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { environment } from '../../environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators'

interface WalletResponse {
  data: number;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private readonly hostServer = environment.hostServer
  private readonly host = this.hostServer + '/rest/wallet/balance'

  constructor (private readonly http: HttpClient) { }

  get () {
    return this.http.get<WalletResponse>(this.host).pipe(map((response) => response.data), catchError((err) => { throw err }))
  }

  put (params: any) {
    return this.http.put<WalletResponse>(this.host, params).pipe(map((response) => response.data), catchError((err) => { throw err }))
  }
}