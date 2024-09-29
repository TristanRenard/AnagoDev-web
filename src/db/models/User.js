/* eslint-disable camelcase */
import Address from "@/db/models/Address"
import Order from "@/db/models/Order"
import PaymentMethod from "@/db/models/PaymentMethod"
import Subscription from "@/db/models/Subscription"
import { Model } from "objection"

class User extends Model {
  static get tableName() {
    return "users"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email"],
      properties: {
        id: { type: "integer" },
        first_name: { type: "string" },
        last_name: { type: "string" },
        email: { type: "string" },
        customer_id: { type: "string" },
        password: { type: "string" },
        phone: { type: "string" },
        isAdmin: { type: "boolean" },
        isVerified: { type: "boolean" },
        verificationToken: { type: "string" },
        consentMail: { type: "boolean" },
        consentPhone: { type: "boolean" }
      }
    }
  }

  static get relationMappings() {
    return {
      addresses: {
        relation: Model.HasManyRelation,
        modelClass: Address,
        join: {
          from: "users.id",
          to: "addresses.user_id"
        }
      },
      paymentMethods: {
        relation: Model.HasManyRelation,
        modelClass: PaymentMethod,
        join: {
          from: "users.id",
          to: "paymentMethods.user_id"
        }
      },
      orders: {
        relation: Model.HasManyRelation,
        modelClass: Order,
        join: {
          from: "users.id",
          to: "orders.user_id"
        }
      },
      subscriptions: {
        relation: Model.HasManyRelation,
        modelClass: Subscription,
        join: {
          from: "users.id",
          to: "subscriptions.user_id"
        }
      }
    }
  }
}

export default User