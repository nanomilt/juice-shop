/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { environment } from '../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class SecurityAnswerService {
  private readonly hostServer = environment.hostServer
  private readonly host = this.hostServer + '/api/SecurityAnswers'

  constructor (private readonly http: HttpClient) { }

  save (params: { [key: string]: any }) {
    return this.http.post(this.host + '/', params).pipe(
      map((response: { data: any }) => response.data),
      catchError((err) => { throw err })
    )
  }
}