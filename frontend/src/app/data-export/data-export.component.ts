/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { Component, type OnInit } from '@angular/core'
import { UntypedFormControl, Validators } from '@angular/forms'
import { ImageCaptchaService } from '../Services/image-captcha.service'
import { DataSubjectService } from '../Services/data-subject.service'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.scss']
})
export class DataExportComponent implements OnInit {
  public captchaControl: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.minLength(5)])
  public formatControl: UntypedFormControl = new UntypedFormControl('', [Validators.required])
  public captcha: string
  private dataRequest: { [key: string]: string } = {}
  public confirmation: string
  public error: string
  public lastSuccessfulTry: Date
  public presenceOfCaptcha: boolean = false
  public userData: string

  constructor (public sanitizer: DomSanitizer, private readonly imageCaptchaService: ImageCaptchaService, private readonly dataSubjectService: DataSubjectService) { }
  ngOnInit () {
    this.needCaptcha()
    this.dataRequest = {}
  }

  needCaptcha () {
    const nowTime = new Date()
    const timeOfCaptcha = localStorage.getItem('lstdtxprt') ? new Date(JSON.parse(localStorage.getItem('lstdtxprt'))) : new Date(0)
    if (nowTime.getTime() - timeOfCaptcha.getTime() < 300000) {
      this.getNewCaptcha()
      this.presenceOfCaptcha = true
    }
  }

  getNewCaptcha () {
    this.imageCaptchaService.getCaptcha().subscribe((data: { image: string }) => {
      this.captcha = this.sanitizer.bypassSecurityTrustHtml(data.image)
    })
  }

  save () {
    if (this.presenceOfCaptcha) {
      this.dataRequest.answer = this.captchaControl.value
    }
    this.dataRequest.format = this.formatControl.value
    this.dataSubjectService.dataExport(this.dataRequest).subscribe((data: { confirmation: string, userData: string }) => {
      this.error = null
      this.confirmation = data.confirmation
      this.userData = data.userData
      window.open('', '_blank', 'width=500')?.document.write(this.userData)
      this.lastSuccessfulTry = new Date()
      localStorage.setItem('lstdtxprt', JSON.stringify(this.lastSuccessfulTry))
      this.ngOnInit()
      this.resetForm()
    }, (error) => {
      this.error = error.error
      this.confirmation = null
      this.resetFormError()
    })
  }

  resetForm () {
    this.captchaControl.markAsUntouched()
    this.captchaControl.markAsPristine()
    this.captchaControl.setValue('')
    this.formatControl.markAsUntouched()
    this.formatControl.markAsPristine()
    this.formatControl.setValue('')
  }

  resetFormError () {
    this.captchaControl.markAsUntouched()
    this.captchaControl.markAsPristine()
    this.captchaControl.setValue('')
  }
}