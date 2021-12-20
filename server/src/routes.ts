import { PrismaClient } from '@prisma/client'
import { Router } from 'express'

import AuthController from './componentes/auth/auth.controller'
import auth from './componentes/auth/auth.middleware'
import CategoriesController from './componentes/categories/categories.controller'
import ProductsController from './componentes/products/products.controller'

class Routes {
  routes: Router

  constructor(
    private readonly prisma: PrismaClient
  ) {
    this.routes = Router()
    this.registerRoutes()
  }

  registerRoutes (): void {
    this.routes.use(
      '/auth',
      new AuthController(this.prisma).routes
    )
    this.routes.use(
      '/categories',
      auth,
      new CategoriesController(this.prisma).routes
    )
    this.routes.use(
      '/products',
      auth,
      new ProductsController(this.prisma).routes
    )
  }
}

export default Routes
