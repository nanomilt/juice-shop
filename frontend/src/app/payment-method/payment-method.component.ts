/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { UntypedFormControl, Validators } from '@angular/forms'
import { Component, EventEmitter, Input, type OnInit, Output } from '@angular/core'
import { PaymentService } from '../Services/payment.service'
import { MatTableDataSource } from '@angular/material/table'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/'
import { TranslateService } from '@ngx-translate/core'
import { SnackBarHelperService } from '../Services/snack-bar-helper.service'

library.add(faPaperPlane, faTrashAlt)

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})

export class PaymentMethodComponent implements OnInit {
  @Output() emitSelection = new EventEmitter()
  @Input('allowDelete') public allowDelete: boolean = false
  public displayedColumns = ['Number', 'Name', 'Expiry']
  public nameControl: UntypedFormControl = new UntypedFormControl('', [Validators.required])
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  public numberControl: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.min(1000000000000000), Validators.max(9999999999999999)])
  public monthControl: UntypedFormControl = new UntypedFormControl('', [Validators.required])
  public yearControl: UntypedFormControl = new UntypedFormControl('', [Validators.required])
  public confirmation: string | undefined
  public error: string | undefined
  public storedCards: Array<any>
  public card: { [key: string]: any } = {}
  public dataSource: MatTableDataSource<any>
  public monthRange: number[]
  public yearRange: number[]
  public cardsExist: boolean = false
  public paymentId: number | undefined

  constructor (public paymentService: PaymentService, private readonly translate: TranslateService, private readonly snackBarHelperService: SnackBarHelperService) { }

  ngOnInit () {
    this.monthRange = Array.from(Array(12).keys()).map(i => i + 1)
    this.yearRange = Array.from(Array(20).keys()).map(i => i + 2080)
    if (this.allowDelete) {
      this.displayedColumns.push('Remove')
    } else {
      this.displayedColumns.unshift('Selection')
    }
    this.load()
  }

  load () {
    this.paymentService.get().subscribe((cards: Array<any>) => {
      this.cardsExist = cards.length > 0
      this.storedCards = cards
      this.dataSource = new MatTableDataSource<any>(this.storedCards)
    }, (err) => { console.log(err) })
  }

  save () {
    this.card.fullName = this.nameControl.value
    this.card.cardNum = this.numberControl.value
    this.card.expMonth = this.monthControl.value
    this.card.expYear = this.yearControl.value
    this.paymentService.save(this.card).subscribe((savedCards: any) => {
      this.error = null
      this.translate.get('CREDIT_CARD_SAVED', { cardnumber: String(savedCards.cardNum).substring(String(savedCards.cardNum).length - 4) }).subscribe((creditCardSaved: string) => {
        this.snackBarHelperService.open(creditCardSaved, 'confirmBar')
      }, (translationId: string) => {
        this.snackBarHelperService.open(translationId, 'confirmBar')
      })
      this.load()
      this.resetForm()
    }, (err) => {
      this.snackBarHelperService.open(err.error?.error, 'errorBar')
      this.resetForm()
    })
  }

  delete (id: number) {
    this.paymentService.del(id).subscribe(() => {
      this.load()
    }, (err) => { console.log(err) })
  }

  emitSelectionToParent (id: number) {
    this.emitSelection.emit(id)
  }

  resetForm () {
    this.nameControl.markAsUntouched()
    this.nameControl.markAsPristine()
    this.nameControl.setValue('')
    this.numberControl.markAsUntouched()
    this.numberControl.markAsPristine()
    this.numberControl.setValue('')
    this.monthControl.markAsUntouched()
    this.monthControl.markAsPristine()
    this.monthControl.setValue('')
    this.yearControl.markAsUntouched()
    this.yearControl.markAsPristine()
    this.yearControl.setValue('')
  }
}