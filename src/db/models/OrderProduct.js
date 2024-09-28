import Order from "@/db/models/Order"
import Product from "@/db/models/Product"
import { Model } from "objection"

class OrderProduct extends Model {
  static get tableName() {
    return "orderProducts"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["orderId", "productId", "quantity"],

      properties: {
        id: { type: "integer" },
        orderId: { type: "integer" },
        productId: { type: "integer" },
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
          from: "orderProducts.orderId",
          to: "orders.id"
        }
      },
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: "orderProducts.productId",
          to: "products.id"
        }
      }
    }
  }
}

export default OrderProduct