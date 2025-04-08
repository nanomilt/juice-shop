/*
 * Copyright (c) 2014-2024 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import path = require('path')
import { type Request, type Response, type NextFunction } from 'express'

module.exports = function serveQuarantineFiles () {
  return ({ params, query }: Request, res: Response, next: NextFunction) => {
    const file = path.basename(params.file) // Sanitize the file name to prevent path traversal

    const filePath = path.join(process.env.QUARANTINE_DIR || 'ftp/quarantine/', file)
    const resolvedPath = path.resolve(filePath)

    // Check if the resolved path is within the intended directory
    if (resolvedPath.startsWith(path.resolve(process.env.QUARANTINE_DIR || 'ftp/quarantine/'))) {
      res.sendFile(resolvedPath)
    } else {
      res.status(403)
      next(new Error('File access denied!'))
    }
  }
}