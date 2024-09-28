import Category from "@/db/models/Category"
import { Model } from "objection"

class Product extends Model {
  static get tableName() {
    return "products"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title", "description", "price", "categoryId"],

      properties: {
        id: { type: "integer" },
        title: { type: "string" },
        description: { type: "string" },
        isMarkdown: { type: "boolean" },
        price: { type: "number" },
        isSubscription: { type: "boolean" },
        images: { type: "json" },
        stock: { type: "integer" },
        duties: { type: "number" },
        isTopProduct: { type: "boolean" },
        categoryId: { type: "integer" }
      }
    }
  }

  static get relationMappings() {
    return {
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: "products.categoryId",
          to: "categories.id"
        }
      }
    }
  }
}

export default Product