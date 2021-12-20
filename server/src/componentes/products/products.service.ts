import { ProductDTO } from './product.dto';
import { PrismaClient, Product } from '@prisma/client'

class ProductsService {

  constructor(
    private readonly prisma: PrismaClient
  ) { }

  private async getCategoriesIds (categoriesIds: string[] | number[] | undefined) {
    let categories
    if (categoriesIds && Array.isArray(categoriesIds) && categoriesIds.length) {
      const ids = categoriesIds.map(id => {
        if (!+id) throw {
          statusCode: 400,
          description: 'Invalid categories'
        }
        return {
          id: +id
        }
      })
      categories = await this.prisma.category.findMany({
        where: {
          OR: ids
        },
        select: {
          id: true
        }
      })
    }
    return categories ?? []
  }


  async find (limit = '10', offset = '0'): Promise<Product[]> {
    const take = +limit || 10
    const skip = +offset || 0

    const products = await this.prisma.product.findMany({
      take,
      skip,
      include: {
        categories: true
      },
    })
    return products
  }


  async createOne (product: ProductDTO): Promise<Product> {
    if (!(product.name && product.slug)) throw {
      statusCode: 400,
      description: 'Insufficient body'
    }
    const { name, slug, categoriesIds } = product

    let price = undefined;
    if (product.price) {
      if (+product.price) price = product.price
      else throw {
        statusCode: 400,
        description: 'Invalid price'
      }
    }

    const existingProduct = await this.prisma.product.findUnique({
      where: {
        slug
      }
    })

    if (existingProduct) throw {
      statusCode: 400,
      description: 'Slug already exists'
    }

    const categoriesToConnect = await this.getCategoriesIds(categoriesIds)

    const createdProduct = await this.prisma.product.create({
      data: {
        name,
        slug,
        price,
        categories: {
          connect: categoriesToConnect
        }
      },
      include: {
        categories: true
      }
    })
    return createdProduct

  }


  async findOne (product: ProductDTO): Promise<Product> {
    const { id } = product

    if (!id) throw {
      statusCode: 400,
      description: 'Insufficient params'
    }

    const foundProduct = await this.prisma.product.findUnique({
      where: {
        id: +id,
      },
      include: {
        categories: true
      }
    })

    if (!foundProduct) throw {
      statusCode: 400,
      description: 'Product does not exist'
    }

    return foundProduct
  }


  async updateOne (product: ProductDTO): Promise<Product> {
    const { id, name, slug, categoriesIds } = product

    let price = undefined;
    if (product.price) {
      if (+product.price) price = product.price
      else throw {
        statusCode: 400,
        description: 'Invalid price'
      }
    }

    if (!id) throw {
      statusCode: 400,
      description: 'Insufficient params'
    }

    if (slug) {
      const existingProduct = await this.prisma.product.findUnique({
        where: {
          slug
        }
      })

      if (existingProduct) throw {
        statusCode: 400,
        description: 'Slug already exists'
      }
    }

    const foundProduct = await this.prisma.product.findUnique({
      where: {
        id: +id,
      },
      select: {
        categories: {
          select: {
            id: true
          }
        }
      }
    })

    if (!foundProduct) throw {
      statusCode: 400,
      description: 'Product does not exist'
    }


    const categoriesToConnect = await this.getCategoriesIds(categoriesIds)
    const categoriesToDisconnect = foundProduct.categories.filter(({ id }) => {
      return !categoriesToConnect
        .map(category => category.id)
        .includes(id)
    })

    const updatedProduct = await this.prisma.product.update({
      where: {
        id: +id,
      },
      data: {
        name,
        slug,
        price,
        categories: {
          connect: categoriesToConnect,
          disconnect: categoriesToDisconnect
        }
      },
      include: {
        categories: true
      }
    })

    return updatedProduct
  }


  async deleteOne (product: ProductDTO): Promise<Product> {
    const { id } = product

    if (!id) throw {
      statusCode: 400,
      description: 'Insufficient params'
    }

    const foundProduct = await this.prisma.product.findUnique({
      where: {
        id: +id,
      }
    })

    if (!foundProduct) throw {
      statusCode: 400,
      description: 'Product does not exist'
    }

    const deletedProduct = await this.prisma.product.delete({
      where: {
        id: +id,
      },
      include: {
        categories: true
      }
    })

    return deletedProduct
  }
}

export default ProductsService
