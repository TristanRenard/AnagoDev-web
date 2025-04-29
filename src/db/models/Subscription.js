import Price from "@/db/models/Price"
import Product from "@/db/models/Product"
import User from "@/db/models/User"
import { Model } from "objection"

class Subscription extends Model {
  static get tableName() {
    return "subscriptions"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["isAnnually", "priceId", "userId", "status", "isActive", "stripeSessionId"],

      properties: {
        id: { type: "integer" },
        isAnnually: { type: "boolean" },
        status: { type: "string" },
        isActive: { type: "boolean" },
        stripeSessionId: { type: "string" },
        priceId: { type: "integer" },
        userId: { type: "integer" },
        invoicePath: { type: "string" }
      }
    }
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "subscriptions.userId",
          to: "users.id"
        }
      },
      price: {
        relation: Model.BelongsToOneRelation,
        modelClass: Price,
        join: {
          from: "subscriptions.priceId",
          to: "prices.id"
        }
      },
      product: {
        relation: Model.HasOneThroughRelation,
        modelClass: Product,
        join: {
          from: "subscriptions.priceId",
          through: {
            from: "prices.id",
            to: "prices.productId"
          },
          to: "products.id"
        }
      }
    }
  }
}

export default Subscription