import Product from '@/db/models/Product'
import { Model } from 'objection'

class Category extends Model {
  static get tableName() {
    return 'categories'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'description'],

      properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
        description: { type: 'string' },
        images: { type: 'json' },
        order: { type: 'integer' }
      }
    }
  }

  static get relationMappings() {
    return {
      products: {
        relation: Model.HasManyRelation,
        modelClass: Product,
        join: {
          from: 'categories.id',
          to: 'products.categoryId'
        }
      }
    }
  }
}


export default Category