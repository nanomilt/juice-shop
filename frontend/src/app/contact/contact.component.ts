/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { FeedbackService } from '../Services/feedback.service'
import { CaptchaService } from '../Services/captcha.service'
import { UserService } from '../Services/user.service'
import { UntypedFormControl, Validators } from '@angular/forms'
import { Component, type OnInit } from '@angular/core'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPaperPlane, faStar } from '@fortawesome/free-solid-svg-icons'
import { FormSubmitService } from '../Services/form-submit.service'
import { TranslateService } from '@ngx-translate/core'
import { SnackBarHelperService } from '../Services/snack-bar-helper.service'

library.add(faStar, faPaperPlane)

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  public authorControl: UntypedFormControl = new UntypedFormControl({ value: '', disabled: true }, [])
  public feedbackControl: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.maxLength(160)])
  public captchaControl: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.pattern('-?[\\d]*')])
  public userIdControl: UntypedFormControl = new UntypedFormControl('', [])
  public rating: number = 0
  public feedback: { UserId: string, captchaId: string, captcha: string, comment: string, rating: number } = { UserId: '', captchaId: '', captcha: '', comment: '', rating: 0 }
  public captcha: string
  public captchaId: string
  public confirmation: any
  public error: any

  constructor (private readonly userService: UserService, private readonly captchaService: CaptchaService, private readonly feedbackService: FeedbackService,
    private readonly formSubmitService: FormSubmitService, private readonly translate: TranslateService, private readonly snackBarHelperService: SnackBarHelperService) { }

  ngOnInit () {
    this.userService.whoAmI().subscribe((data: { id: string, email: string }) => {
      this.userIdControl.setValue(data.id)
      this.feedback.UserId = data.id
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      this.authorControl.setValue(data.email ? `***${data.email.slice(3)}` : 'anonymous')
    }, (err) => {
      console.log(err)
    })
    this.getNewCaptcha()

    this.formSubmitService.attachEnterKeyHandler('feedback-form', 'submitButton', () => { this.save() })
  }

  getNewCaptcha () {
    this.captchaService.getCaptcha().subscribe((data: { captcha: string, captchaId: string }) => {
      this.captcha = data.captcha
      this.captchaId = data.captchaId
    }, (err) => err)
  }

  save () {
    this.feedback.captchaId = this.captchaId
    this.feedback.captcha = this.captchaControl.value
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    this.feedback.comment = `${this.feedbackControl.value} (${this.authorControl.value})`
    this.feedback.rating = this.rating
    this.feedbackService.save(this.feedback).subscribe((savedFeedback) => {
      if (savedFeedback.rating === 5) {
        this.translate.get('FEEDBACK_FIVE_STAR_THANK_YOU').subscribe((feedbackThankYou) => {
          this.snackBarHelperService.open(feedbackThankYou)
        }, (translationId) => {
          this.snackBarHelperService.open(translationId)
        })
      } else {
        this.translate.get('FEEDBACK_THANK_YOU').subscribe((feedbackThankYou) => {
          this.snackBarHelperService.open(feedbackThankYou)
        }, (translationId) => {
          this.snackBarHelperService.open(translationId)
        })
      }
      this.feedback = { UserId: '', captchaId: '', captcha: '', comment: '', rating: 0 }
      this.ngOnInit()
      this.resetForm()
    }, (err) => {
      console.log(err)
      this.snackBarHelperService.open(err.error, 'errorBar')
      this.feedback = { UserId: '', captchaId: '', captcha: '', comment: '', rating: 0 }
      this.resetCaptcha()
    })
  }

  resetForm () {
    this.authorControl.markAsUntouched()
    this.authorControl.markAsPristine()
    this.authorControl.setValue('')
    this.feedbackControl.markAsUntouched()
    this.feedbackControl.markAsPristine()
    this.feedbackControl.setValue('')
    this.rating = 0
    this.captchaControl.markAsUntouched()
    this.captchaControl.markAsPristine()
    this.captchaControl.setValue('')
  }

  resetCaptcha () {
    this.captchaControl.markAsUntouched()
    this.captchaControl.markAsPristine()
    this.captchaControl.setValue('')
  }

  formatRating (value: number) {
    return `${value}★`
  }
}