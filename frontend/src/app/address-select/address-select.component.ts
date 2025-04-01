/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { Component, NgZone } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-address-select',
  templateUrl: './address-select.component.html',
  styleUrls: ['./address-select.component.scss']
})
export class AddressSelectComponent {
  public addressId: string | undefined = undefined
  public showNextButton: boolean = true

  constructor (private readonly router: Router, private readonly ngZone: NgZone) {}

  getMessage (id: string) {
    this.addressId = id
  }
}