/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { type Request, type Response, type NextFunction } from 'express'
import { type Captcha } from '../data/types'
import { CaptchaModel } from '../models/captcha'

function captchas () {
  return async (req: Request, res: Response) => {
    const captchaId = req.app.locals.captchaId++
    const operators = ['*', '+', '-']

    const firstTerm = Math.floor((Math.random() * 10) + 1)
    const secondTerm = Math.floor((Math.random() * 10) + 1)
    const thirdTerm = Math.floor((Math.random() * 10) + 1)

    const firstOperator = operators[Math.floor((Math.random() * 3))]
    const secondOperator = operators[Math.floor((Math.random() * 3))]

    const expression = `${firstTerm}${firstOperator}${secondTerm}${secondOperator}${thirdTerm}`
    const answer = evaluateExpression(expression) // Use a secure function instead of eval()

    const captcha = {
      captchaId,
      captcha: expression,
      answer
    }
    const captchaInstance = CaptchaModel.build(captcha)
    await captchaInstance.save()
    res.json(captcha)
  }
}

// Secure function to evaluate the expression
function evaluateExpression (expression: string): string {
  const terms = expression.split(/(\*|\+|-)/g)
  let result = parseInt(terms[0], 10)

  for (let i = 1; i < terms.length; i += 2) {
    const operator = terms[i]
    const term = parseInt(terms[i + 1], 10)

    switch (operator) {
      case '*':
        result *= term
        break
      case '+':
        result += term
        break
      case '-':
        result -= term
        break
    }
  }

  return result.toString()
}

captchas.verifyCaptcha = () => (req: Request, res: Response, next: NextFunction) => {
  CaptchaModel.findOne({ where: { captchaId: req.body.captchaId } }).then((captcha: Captcha | null) => {
    if ((captcha != null) && req.body.captcha === captcha.answer) {
      next()
    } else {
      res.status(401).send(res.__('Wrong answer to CAPTCHA. Please try again.'))
    }
  }).catch((error: Error) => {
    next(error)
  })
}

module.exports = captchas