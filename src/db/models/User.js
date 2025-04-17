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
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
        customerId: { type: "string" },
        password: { type: "string" },
        phone: { type: "string" },
        role: { type: "string" },
        isVerified: { type: "boolean" },
        verificationToken: { type: "string" },
        consentMail: { type: "boolean" },
        consentConditions: { type: "boolean" },
      },
    }
  }

  static get relationMappings() {
    return {
      addresses: {
        relation: Model.HasManyRelation,
        modelClass: Address,
        join: {
          from: "users.id",
          to: "addresses.userId",
        },
      },
      paymentMethods: {
        relation: Model.HasManyRelation,
        modelClass: PaymentMethod,
        join: {
          from: "users.id",
          to: "paymentMethods.userId",
        },
      },
      orders: {
        relation: Model.HasManyRelation,
        modelClass: Order,
        join: {
          from: "users.id",
          to: "orders.userId",
        },
      },
      subscriptions: {
        relation: Model.HasManyRelation,
        modelClass: Subscription,
        join: {
          from: "users.id",
          to: "subscriptions.userId",
        },
      },
    }
  }
}

export default User
