import { ProductDTO } from './product.dto';
import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response, Router } from 'express'
import ProductsService from './products.service'
import formidable from 'formidable';

class ProductsController {
  routes: Router

  constructor(
    private readonly prisma: PrismaClient
  ) {
    this.routes = Router()
    const productsServices = new ProductsService(this.prisma)
    this.registerRoutes(productsServices)
  }

  private registerRoutes (productsServices: ProductsService): void {
    this.routes
      .get('/', async function (req: Request, res: Response) {
        const limit = `${req.query.limit}` ?? undefined
        const offset = `${req.query.offset}` ?? undefined
        const result = await productsServices.find(limit, offset)
        res.json(result)
      })
      .post('/', async function (req: Request, res: Response) {
        const productDTO: ProductDTO = req.body ?? {}
        const result = await productsServices.createOne(productDTO)
        res.status(201).json(result)
      })
      .get('/:id', async function (req: Request, res: Response) {
        const productDTO: ProductDTO = { id: req.params.id }
        const result = await productsServices.findOne(productDTO)
        res.json(result)
      })
      .put('/:id', async function (req: Request, res: Response) {
        const productDTO: ProductDTO = req.body ?? {}
        productDTO.id = req.params.id
        const result = await productsServices.updateOne(productDTO)
        res.json(result)
      })
      .delete('/:id', async function (req: Request, res: Response) {
        const productDTO: ProductDTO = { id: req.params.id }
        const result = await productsServices.deleteOne(productDTO)
        res.json(result)
      })
      .post('/upload', async function (req: Request, res: Response, next: NextFunction) {
        // TODO: fazer upload da imagem e salvar url no banco
        const form = formidable({});
        form.parse(req, (err, fields, files) => {
          if (err) {
            next(err);
            return;
          }
          res.json({ fields, files });
        });
      })
  }
}

export default ProductsController
