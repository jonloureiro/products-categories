import { CategoryDTO } from './category.dto';
import { PrismaClient, Category } from '@prisma/client'

class CategoriesService {

  constructor(
    private readonly prisma: PrismaClient
  ) { }


  async find (limit = '10', offset = '0'): Promise<Category[]> {
    const take = +limit || 10
    const skip = +offset || 0

    const categories = await this.prisma.category.findMany({
      take,
      skip,
      include: {
        products: true,
      },
    })
    return categories
  }


  async createOne (category: CategoryDTO): Promise<Category> {
    if (!(category.name && category.slug)) throw {
      statusCode: 400,
      description: 'Insufficient body'
    }

    const { name, slug } = category

    const existingCategory = await this.prisma.category.findUnique({
      where: {
        slug
      }
    })

    if (existingCategory) throw {
      statusCode: 400,
      description: 'Slug already exists'
    }

    const createdCategory = await this.prisma.category.create({
      data: {
        name,
        slug
      },
      include: {
        products: true,
      },
    })

    return createdCategory
  }


  async findOne (category: CategoryDTO): Promise<Category> {
    const { id } = category

    if (!id) throw {
      statusCode: 400,
      description: 'Insufficient params'
    }

    const foundCategory = await this.prisma.category.findUnique({
      where: {
        id: +id,
      },
      include: {
        products: true
      }
    })

    if (!foundCategory) throw {
      statusCode: 400,
      description: 'Category does not exist'
    }

    return foundCategory
  }


  async updateOne (category: CategoryDTO): Promise<Category> {
    const { id, name, slug } = category

    if (!id) throw {
      statusCode: 400,
      description: 'Insufficient params'
    }

    if (slug) {
      const existingCategory = await this.prisma.category.findUnique({
        where: {
          slug
        }
      })

      if (existingCategory) throw {
        statusCode: 400,
        description: 'Slug already exists'
      }
    }

    const foundCategory = await this.prisma.category.findUnique({
      where: {
        id: +id,
      },
      select: {
        id: true
      }
    })

    if (!foundCategory) throw {
      statusCode: 400,
      description: 'Category does not exist'
    }

    const updatedCategory = await this.prisma.category.update({
      where: {
        id: +id,
      },
      data: {
        name,
        slug
      },
      include: {
        products: true,
      },
    })

    return updatedCategory
  }


  async deleteOne (category: CategoryDTO): Promise<Category> {
    const { id } = category

    if (!id) throw {
      statusCode: 400,
      description: 'Insufficient params'
    }

    const foundCategory = await this.prisma.category.findUnique({
      where: {
        id: +id,
      },
      select: {
        id: true
      }
    })

    if (!foundCategory) throw {
      statusCode: 400,
      description: 'Category does not exist'
    }

    const deletedCategory = await this.prisma.category.delete({
      where: {
        id: +id,
      },
      include: {
        products: true,
      },
    })

    return deletedCategory
  }
}

export default CategoriesService
