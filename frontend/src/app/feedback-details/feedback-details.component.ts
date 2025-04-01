/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { Component, type OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Feedback } from 'src/app/models/feedback.model'

@Component({
  selector: 'app-feedback-details',
  templateUrl: './feedback-details.component.html',
  styleUrls: ['./feedback-details.component.scss']
})
export class FeedbackDetailsComponent implements OnInit {
  public feedback: Feedback
  public id: number
  constructor (@Inject(MAT_DIALOG_DATA) public dialogData: { feedback: Feedback, id: number }) { }

  ngOnInit () {
    this.feedback = this.dialogData.feedback
    this.id = this.dialogData.id
  }
}