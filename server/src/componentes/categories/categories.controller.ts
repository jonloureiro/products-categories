import { CategoryDTO } from './category.dto';
import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express'
import CategoriesService from './categories.service';

class CategoriesController {
  routes: Router

  constructor(
    private readonly prisma: PrismaClient
  ) {
    this.routes = Router()
    const categoriesService = new CategoriesService(this.prisma)
    this.registerRoutes(categoriesService)
  }

  private registerRoutes (categoriesService: CategoriesService): void {
    this.routes
      .get('/', async function (req: Request, res: Response) {
        const limit = `${req.query.limit}` ?? undefined
        const offset = `${req.query.offset}` ?? undefined
        const result = await categoriesService.find(limit, offset)
        res.json(result)
      })
      .post('/', async function (req: Request, res: Response) {
        const categoryDTO: CategoryDTO = req.body ?? {}
        const result = await categoriesService.createOne(categoryDTO)
        res.status(201).json(result)
      })
      .get('/:id', async function (req: Request, res: Response) {
        const categoryDTO: CategoryDTO = { id: req.params.id }
        const result = await categoriesService.findOne(categoryDTO)
        res.json(result)
      })
      .put('/:id', async function (req: Request, res: Response) {
        const categoryDTO: CategoryDTO = req.body ?? {}
        categoryDTO.id = req.params.id
        const result = await categoriesService.updateOne(categoryDTO)
        res.json(result)
      })
      .delete('/:id', async function (req: Request, res: Response) {
        const categoryDTO: CategoryDTO = { id: req.params.id }
        const result = await categoriesService.deleteOne(categoryDTO)
        res.json(result)
      })
  }
}

export default CategoriesController
