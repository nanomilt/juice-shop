/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import challengeUtils = require('../lib/challengeUtils')
import { type Request, type Response, type NextFunction } from 'express'
import { type Review } from '../data/types'
import * as db from '../data/mongodb'
import { challenges } from '../data/datacache'

const security = require('../lib/insecurity')

module.exports = function productReviews () {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.id
    const user = security.authenticatedUsers.from(req)
    db.reviewsCollection.findOne({ _id: id }).then((review: Review | null) => {
      if (!review) {
        res.status(404).json({ error: 'Not found' })
      } else {
        const likedBy = review.likedBy
        if (!likedBy.includes(user.data.email)) {
          db.reviewsCollection.updateOne(
            { _id: id },
            { $inc: { likesCount: 1 } }
          ).then(
            () => {
              // Artificial wait for timing attack challenge
              setTimeout(() => {
                db.reviewsCollection.findOne({ _id: id }).then((review: Review | null) => {
                  if (review) {
                    const likedBy = review.likedBy
                    likedBy.push(user.data.email)
                    const count = likedBy.filter(email => email === user.data.email).length
                    challengeUtils.solveIf(challenges.timingAttackChallenge, () => count > 2)
                    db.reviewsCollection.updateOne(
                      { _id: id },
                      { $set: { likedBy } }
                    ).then(
                      (result: any) => {
                        res.json(result)
                      }, (err: unknown) => {
                        res.status(500).json(err)
                      })
                  } else {
                    res.status(400).json({ error: 'Wrong Params' })
                  }
                }, () => {
                  res.status(400).json({ error: 'Wrong Params' })
                })
              }, 150)
            }, (err: unknown) => {
              res.status(500).json(err)
            })
        } else {
          res.status(403).json({ error: 'Not allowed' })
        }
      }
    }, () => {
      res.status(400).json({ error: 'Wrong Params' })
    })
  }
}