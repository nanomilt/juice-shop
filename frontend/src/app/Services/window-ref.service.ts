/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {
  get nativeWindow (): Window {
    return getWindow()
  }
}

function getWindow (): Window {
  return window
}