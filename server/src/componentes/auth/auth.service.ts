import { AccountDTO } from './account.dto';

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { PrismaClient, User } from '@prisma/client'

class AuthService {

  constructor(
    private readonly prisma: PrismaClient
  ) {

  }

  private generateAccessToken (): string {
    const secret = process.env.JWT_SECRET ?? 's3cr3t'
    return jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (3600)
    }, secret)
  }

  async signIn (account: AccountDTO): Promise<Partial<User> & { access_token: string }> {
    if (!(account.email && account.password)) throw {
      statusCode: 400,
      description: 'Insufficient body'
    }
    const { email, password: unencryptedPassword } = account

    const existingAccount = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!existingAccount) throw {
      statusCode: 400,
      description: 'Email does not exist'
    }

    const match = await bcrypt.compare(unencryptedPassword, existingAccount.password)

    if (!match) throw {
      statusCode: 400,
      description: 'Passwords don\'t match'
    }

    const access_token = this.generateAccessToken()
    return { ...existingAccount, password: undefined, access_token }
  }

  async signUp (account: AccountDTO): Promise<Partial<User> & { access_token: string }> {
    if (!(account.email && account.password)) throw {
      statusCode: 400,
      description: 'Insufficient body'
    }
    const { email, password: unencryptedPassword } = account

    const existingAccount = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (existingAccount) throw {
      statusCode: 400,
      description: 'Email already exists'
    }

    const password = await bcrypt.hash(unencryptedPassword, 10)

    const createdAccount = await this.prisma.user.create({
      data: {
        email,
        password
      }
    })

    const access_token = this.generateAccessToken()
    return { ...createdAccount, password: undefined, access_token }
  }
}

export default AuthService
