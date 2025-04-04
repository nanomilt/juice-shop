/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { LastLoginIpComponent } from './last-login-ip.component'
import { MatCardModule } from '@angular/material/card'
import { DomSanitizer } from '@angular/platform-browser'
import * as jwt from 'jsonwebtoken'

describe('LastLoginIpComponent', () => {
  let component: LastLoginIpComponent
  let fixture: ComponentFixture<LastLoginIpComponent>
  let sanitizer

  beforeEach(waitForAsync(() => {
    sanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml', 'sanitize'])
    sanitizer.bypassSecurityTrustHtml.and.callFake((args: string) => args)
    sanitizer.sanitize.and.returnValue({})

    TestBed.configureTestingModule({
      declarations: [LastLoginIpComponent],
      providers: [
        { provide: DomSanitizer, useValue: sanitizer }
      ],
      imports: [
        MatCardModule
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LastLoginIpComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should compile', () => {
    expect(component).toBeTruthy()
  })

  it('should log JWT parsing error to console', () => {
    console.log = jasmine.createSpy('log')
    localStorage.setItem('token', 'definitelyInvalidJWT')
    component.ngOnInit()
    expect(console.log).toHaveBeenCalled()
  })

  xit('should set Last-Login IP from JWT as trusted HTML', () => { // FIXME Expected state seems to leak over from previous test case occasionally
    const secret = process.env.JWT_SECRET || 'changeme'
    const token = jwt.sign({ data: { lastLoginIp: '1.2.3.4' } }, secret, { algorithm: 'HS256' })
    localStorage.setItem('token', token)
    component.ngOnInit()
    expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith('<small>1.2.3.4</small>')
  })

  xit('should not set Last-Login IP if none is present in JWT', () => { // FIXME Expected state seems to leak over from previous test case occasionally
    const secret = process.env.JWT_SECRET || 'changeme'
    const token = jwt.sign({ data: {} }, secret, { algorithm: 'HS256' })
    localStorage.setItem('token', token)
    component.ngOnInit()
    expect(sanitizer.bypassSecurityTrustHtml).not.toHaveBeenCalled()
  })
})