/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { UserDetailsComponent } from '../user-details/user-details.component'
import { FeedbackDetailsComponent } from '../feedback-details/feedback-details.component'
import { MatDialog } from '@angular/material/dialog'
import { FeedbackService } from '../Services/feedback.service'
import { MatTableDataSource } from '@angular/material/table'
import { UserService } from '../Services/user.service'
import { Component, OnInit, ViewChild } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArchive, faEye, faHome, faTrashAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { MatPaginator } from '@angular/material/paginator'

library.add(faUser, faEye, faHome, faArchive, faTrashAlt)

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {
  public userDataSource: MatTableDataSource<{ email: string; lastLoginTime: number }> | null = null
  public userDataSourceHidden: { email: string; lastLoginTime: number }[] | null = null
  public userColumns = ['user', 'email', 'user_detail']
  public feedbackDataSource: MatTableDataSource<{ comment: string }> | null = null
  public feedbackColumns = ['user', 'comment', 'rating', 'remove']
  public error: any
  public resultsLengthUser = 0
  public resultsLengthFeedback = 0
  @ViewChild('paginatorUsers') paginatorUsers: MatPaginator
  @ViewChild('paginatorFeedb') paginatorFeedb: MatPaginator
  constructor (private readonly dialog: MatDialog, private readonly userService: UserService, private readonly feedbackService: FeedbackService,
    private readonly sanitizer: DomSanitizer) {}

  ngOnInit () {
    this.findAllUsers()
    this.findAllFeedbacks()
  }

  findAllUsers () {
    this.userService.find().subscribe((users) => {
      this.userDataSource = new MatTableDataSource(users)
      this.userDataSourceHidden = users
      for (const user of users) {
        user.email = this.sanitizer.bypassSecurityTrustHtml(`<span class="${this.doesUserHaveAnActiveSession(user) ? 'confirmation' : 'error'}">${user.email}</span>`)
      }
      this.userDataSource.data = users
      this.userDataSource.paginator = this.paginatorUsers
      this.resultsLengthUser = users.length
    }, (err) => {
      this.error = err
      console.log(this.error)
    })
  }

  findAllFeedbacks () {
    this.feedbackService.find().subscribe((feedbacks) => {
      this.feedbackDataSource = new MatTableDataSource(feedbacks)
      for (const feedback of feedbacks) {
        feedback.comment = this.sanitizer.bypassSecurityTrustHtml(feedback.comment)
      }
      this.feedbackDataSource.data = feedbacks
      this.feedbackDataSource.paginator = this.paginatorFeedb
      this.resultsLengthFeedback = feedbacks.length
    }, (err) => {
      this.error = err
      console.log(this.error)
    })
  }

  deleteFeedback (id: number) {
    this.feedbackService.del(id).subscribe(() => {
      this.findAllFeedbacks()
    }, (err) => {
      this.error = err
      console.log(this.error)
    })
  }

  showUserDetail (id: number) {
    this.dialog.open(UserDetailsComponent, {
      data: {
        id
      }
    })
  }

  showFeedbackDetails (feedback: { comment: string }, id: number) {
    this.dialog.open(FeedbackDetailsComponent, {
      data: {
        feedback,
        id
      }
    })
  }

  times (numberOfTimes: number) {
    return Array(numberOfTimes).fill('★')
  }

  doesUserHaveAnActiveSession (user: { email: string, lastLoginTime: number }) {
    const SIX_HOURS_IN_SECONDS = 60 * 60 * 6
    return user.lastLoginTime && user.lastLoginTime > ((Date.now() / 1000) - SIX_HOURS_IN_SECONDS)
  }
}