import { AccountDTO } from './account.dto';
import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express'
import AuthService from './auth.service';

class AuthController {
  routes: Router

  constructor(
    private readonly prisma: PrismaClient
  ) {
    this.routes = Router()
    const authService = new AuthService(this.prisma)
    this.registerRoutes(authService)
  }

  private registerRoutes (authService: AuthService): void {
    const setCookieAccessToken = this.setCookieAccessToken

    this.routes
      .post('/sign-in', async function (req: Request, res: Response) {
        const accountDTO: AccountDTO = req.body ?? {}
        const { access_token, ...result } = await authService.signIn(accountDTO)
        res
          .setHeader('Set-Cookie', setCookieAccessToken(access_token, 3600))
          .json(result)
      })
      .post('/sign-up', async function (req: Request, res: Response) {
        const accountDTO: AccountDTO = req.body ?? {}
        const { access_token, ...result } = await authService.signUp(accountDTO)
        res
          .setHeader('Set-Cookie', setCookieAccessToken(access_token, 3600))
          .status(201)
          .json(result)
      })
      .post('/sign-out', function (req: Request, res: Response) {
        res
          .setHeader('Set-Cookie', setCookieAccessToken('', 0))
          .send()
      })
  }

  private setCookieAccessToken (token: string, maxAge: number): string {
    return `access_token=${token}; Max-Age=${maxAge}; Path=/;HttpOnly${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
  }
}

export default AuthController
