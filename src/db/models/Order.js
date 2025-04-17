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
      products: {
        relation: Model.ManyToManyRelation,
        modelClass: OrderPrice,
        join: {
          from: "orders.id",
          through: {
            from: "orderPrice.orderId",
            to: "orderPrice.priceId",
          },
          to: "products.id",
        },
      },
    }
  }
}

export default Order
