import Category from "@/db/models/Category"
import Price from "@/db/models/Price"
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
        stripeId: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        isMarkdown: { type: "boolean" },
        price: { type: "number" },
        isSubscription: { type: "boolean" },
        images: {
          type: "array",
          items: { type: "string" }
        },
        stock: { type: "integer" },
        duties: { type: "number" },
        isTopProduct: { type: "boolean" },
        categoryId: { type: "integer" },
        isActive: { type: "boolean" },
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
      },
      prices: {
        relation: Model.HasManyRelation,
        modelClass: Price,
        join: {
          from: "products.id",
          to: "prices.productId"
        }
      }
    }
  }
}

export default Product