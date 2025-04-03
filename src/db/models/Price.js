import Product from "@/db/models/Product"
import { Model } from "objection"


class Price extends Model {
  static get tableName() {
    return "prices"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["stripeId", "unit_amount", "currency", "productId"],

      properties: {
        id: { type: "integer" },
        stripeId: { type: "string" },
        recurring: { type: "boolean" },
        nickname: { type: "string" },
        "unit_amount": { type: "integer" },
        currency: { type: "string" },
        interval: { type: "string" },
        productId: { type: "integer" },
      }
    }
  }

  static get relationMappings() {
    return {
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: "prices.productId",
          to: "products.id"
        }
      }
    }
  }
}

export default Price