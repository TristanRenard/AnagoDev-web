import Order from "@/db/models/Order"
import Price from "@/db/models/Price"
import { Model } from "objection"

class OrderPrice extends Model {
  static get tableName() {
    return "orderPrice"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["orderId", "priceId", "quantity"],

      properties: {
        id: { type: "integer" },
        orderId: { type: "integer" },
        priceId: { type: "integer" },
        quantity: { type: "integer" }
      }
    }
  }

  static get relationMappings() {
    return {
      order: {
        relation: Model.BelongsToOneRelation,
        modelClass: Order,
        join: {
          from: "orderPrice.orderId",
          to: "orders.id"
        }
      },
      price: {
        relation: Model.BelongsToOneRelation,
        modelClass: Price,
        join: {
          from: "orderPrice.priceId",
          to: "prices.id"
        }
      }
    }
  }
}

export default OrderPrice