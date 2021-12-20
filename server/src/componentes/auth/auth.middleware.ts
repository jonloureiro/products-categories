import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

export default function auth (req: Request, res: Response, next: NextFunction) {
  const access_token = req.cookies['access_token']

  if (!access_token) throw {
    statusCode: 401,
    description: 'Authenticate yourself'
  }

  try {
    const secret = process.env.JWT_SECRET ?? 's3cr3t'
    jwt.verify(access_token, secret)
  } catch (error) {
    throw {
      statusCode: 401,
      description: 'Invalid access token'
    }
  }

  next()
}
