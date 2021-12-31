import 'express-async-errors'

import Express, { NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import { PrismaClient } from '@prisma/client'

import Routes from './routes'

const app = Express()
const prisma = new PrismaClient()

prisma.$connect()

app.use('/uploads', Express.static('uploads'))
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api', new Routes(prisma).routes)
app.use(errorHandler);

function errorHandler (error: Error, req: Request, res: Response, next: NextFunction) {
  const err = error as { statusCode?: number, description?: string }
  const status = err.statusCode ?? 500
  const description = err.description || 'Internal Error'
  res.status(status).json({ description })
  console.log(error.message);
}

export default app
