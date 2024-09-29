import Address from "@/db/models/Address"
import OrderProduct from "@/db/models/OrderProduct"
import PaymentMethod from "@/db/models/PaymentMethod"
import User from "@/db/models/User"
import { Model } from "objection"

class Order extends Model {
  static get tableName() {
    return "orders"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["status", "userId", "addressId", "paymentMethodId"],

      properties: {
        id: { type: "integer" },
        status: { type: "string" },
        userId: { type: "integer" },
        addressId: { type: "integer" },
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
          from: "orders.userId",
          to: "users.id"
        }
      },
      address: {
        relation: Model.BelongsToOneRelation,
        modelClass: Address,
        join: {
          from: "orders.addressId",
          to: "addresses.id"
        }
      },
      paymentMethod: {
        relation: Model.BelongsToOneRelation,
        modelClass: PaymentMethod,
        join: {
          from: "orders.paymentMethodId",
          to: "paymentMethods.id"
        }
      },
      products: {
        relation: Model.ManyToManyRelation,
        modelClass: OrderProduct,
        join: {
          from: "orders.id",
          through: {
            from: "orderProducts.orderId",
            to: "orderProducts.productId"
          },
          to: "products.id"
        }
      }
    }
  }
}

export default Order