/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { environment } from '../../environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators'
import { type Observable } from 'rxjs'

interface ConfigResponse {
  config: Config
}
export interface Config {
  server: {
    port: number
  }
  application: {
    domain: string
    name: string
    logo: string
    favicon: string
    theme: string
    showVersionNumber: boolean
    showGitHubLinks: boolean
    localBackupEnabled: boolean
    numberOfRandomFakeUsers: number
    altcoinName: string
    privacyContactEmail: string
    social: {
      twitterUrl: string
      facebookUrl: string
      slackUrl: string
      redditUrl: string
      pressKitUrl: string
      nftUrl: string
      questionnaireUrl: string
    }
    recyclePage: {
      topProductImage: string
      bottomProductImage: string
    }
    welcomeBanner: {
      showOnFirstStart: boolean
      title: string
      message: string
    }
    cookieConsent: {
      message: string
      dismissText: string
      linkText: string
      linkUrl: string
    }
    securityTxt: {
      contact: string
      encryption: string
      acknowledgements: string
    }
    promotion: {
      video: string
      subtitles: string
    }
    easterEggPlanet: {
      name: string
      overlayMap: string
    }
    googleOauth: {
      clientId: string
      authorizedRedirects: string[]
    }
  }
  challenges: {
    showSolvedNotifications: boolean
    showHints: boolean
    showMitigations: boolean
    codingChallengesEnabled: string
    restrictToTutorialsFirst: boolean
    safetyMode: string
    overwriteUrlForProductTamperingChallenge: string
    showFeedbackButtons: boolean
  }
  hackingInstructor: {
    isEnabled: boolean
    avatarImage: string
  }
  products: Product[]
  memories: Memory[]
  ctf: {
    showFlagsInNotifications: boolean
    showCountryDetailsInNotifications: string
    countryMapping: CountryMapping[]
  }
}

interface Product {
  [key: string]: any
}

interface Memory {
  [key: string]: any
}

interface CountryMapping {
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private readonly hostServer = environment.hostServer
  private readonly host = this.hostServer + '/rest/admin'
  private configObservable: Observable<Config> | null = null
  constructor (private readonly http: HttpClient) { }

  getApplicationConfiguration (): Observable<Config> {
    if (this.configObservable) {
      return this.configObservable
    } else {
      this.configObservable = this.http.get<ConfigResponse>(this.host + '/application-configuration').pipe(map((response: ConfigResponse) => response.config, catchError((err) => { throw err })))
      return this.configObservable
    }
  }
}