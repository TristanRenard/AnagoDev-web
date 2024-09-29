import Order from "@/db/models/Order"
import PaymentMethod from "@/db/models/PaymentMethod"
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
      required: ["isAnnually", "price", "productId", "userId", "orderId", "paymentMethodId"],

      properties: {
        id: { type: "integer" },
        isAnnually: { type: "boolean" },
        price: { type: "number" },
        productId: { type: "integer" },
        userId: { type: "integer" },
        orderId: { type: "integer" },
        paymentMethodId: { type: "integer" }
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
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: "subscriptions.productId",
          to: "products.id"
        }
      },
      order: {
        relation: Model.BelongsToOneRelation,
        modelClass: Order,
        join: {
          from: "subscriptions.orderId",
          to: "orders.id"
        }
      },
      paymentMethod: {
        relation: Model.BelongsToOneRelation,
        modelClass: PaymentMethod,
        join: {
          from: "subscriptions.paymentMethodId",
          to: "paymentMethods.id"
        }
      }
    }
  }
}


export default Subscription