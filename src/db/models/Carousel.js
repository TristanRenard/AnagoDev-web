import { Model } from "objection"

class Carousel extends Model {
  static get tableName() {
    return 'carousel'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'description', 'images', 'link'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'string' },
        images: { type: 'json' },
        link: { type: 'string' }
      }
    }
  }
}

export default Carousel