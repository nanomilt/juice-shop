/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing'
import { TranslateModule } from '@ngx-translate/core'
import { TokenSaleComponent } from './token-sale.component'
import { of, throwError } from 'rxjs'
import { ConfigurationService } from '../Services/configuration.service'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'

describe('TokenSaleComponent', () => {
  let component: TokenSaleComponent
  let fixture: ComponentFixture<TokenSaleComponent>
  let configurationService: ConfigurationService

  beforeEach(waitForAsync(() => {
    const configurationServiceSpy = jasmine.createSpyObj('ConfigurationService', ['getApplicationConfiguration'])
    configurationServiceSpy.getApplicationConfiguration.and.returnValue(of({ application: { } }))
    TestBed.configureTestingModule({
      declarations: [TokenSaleComponent],
      imports: [
        TranslateModule.forRoot(),
        MatCardModule,
        MatButtonModule
      ],
      providers: [
        { provide: ConfigurationService, useValue: configurationServiceSpy }
      ]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenSaleComponent)
    component = fixture.componentInstance
    configurationService = TestBed.inject(ConfigurationService)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should set altcoinName as obtained from configuration', () => {
    configurationService.getApplicationConfiguration.and.returnValue(of({ application: { altcoinName: 'Coin' } }))
    component.ngOnInit()
    expect(component.altcoinName).toBe('Coin')
  })

  it('should log error on failure in retrieving configuration from backend', fakeAsync(() => {
    configurationService.getApplicationConfiguration.and.returnValue(throwError('Error'))
    console.log = jasmine.createSpy('log')
    component.ngOnInit()
    expect(console.log).toHaveBeenCalledWith('Error')
  }))
})