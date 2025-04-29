import OrderPrice from "@/db/models/OrderPrice"
import User from "@/db/models/User"
import { Model } from "objection"

class Order extends Model {
  static get tableName() {
    return "orders"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["status", "userId"],

      properties: {
        id: { type: "integer" },
        status: { type: "string" },
        userId: { type: "integer" },
        stripeSessionId: { type: "string" },
        invoicePath: { type: "string" },
        addressId: { type: "integer" },
        paymentMethodId: { type: "integer" },
      },
    }
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "orders.userId",
          to: "users.id",
        },
      },
      orderPrices: {
        relation: Model.HasManyRelation,
        modelClass: OrderPrice,
        join: {
          from: "orders.id",
          to: "orderPrice.orderId",
        },
      }
    }
  }
}

export default Order
