/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { environment } from '../../environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Challenge } from '../Models/challenge.model'

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private readonly hostServer = environment.hostServer
  private readonly host = this.hostServer + '/api/Challenges'
  constructor (private readonly http: HttpClient) { }

  find (params?: any): Observable<Challenge[]> {
    return this.http.get(this.host + '/', { params }).pipe(map((response: any) => response.data), catchError((err) => { throw err }))
  }

  repeatNotification (challengeName: string) {
    return this.http.get(this.hostServer + '/rest/repeat-notification', { params: { challenge: challengeName }, responseType: 'text' as const }).pipe(catchError((err) => { throw err }))
  }

  continueCode (): Observable<string> {
    return this.http.get(this.hostServer + '/rest/continue-code').pipe(map((response: any) => response.continueCode), catchError((err) => { throw err }))
  }

  continueCodeFindIt (): Observable<string> {
    return this.http.get(this.hostServer + '/rest/continue-code-findIt').pipe(map((response: any) => response.continueCode), catchError((err) => { throw err }))
  }

  continueCodeFixIt (): Observable<string> {
    return this.http.get(this.hostServer + '/rest/continue-code-fixIt').pipe(map((response: any) => response.continueCode), catchError((err) => { throw err }))
  }

  restoreProgress (continueCode: string): Observable<any> {
    return this.http.put(this.hostServer + '/rest/continue-code/apply/' + continueCode, {}).pipe(map((response: any) => response.data), catchError((err) => { throw err }))
  }

  restoreProgressFindIt (continueCode: string): Observable<any> {
    return this.http.put(this.hostServer + '/rest/continue-code-findIt/apply/' + continueCode, {}).pipe(map((response: any) => response.data), catchError((err) => { throw err }))
  }

  restoreProgressFixIt (continueCode: string): Observable<any> {
    return this.http.put(this.hostServer + '/rest/continue-code-fixIt/apply/' + continueCode, {}).pipe(map((response: any) => response.data), catchError((err) => { throw err }))
  }
}