import { Model } from "objection"

class PaymentMethod extends Model {
  static get tableName() {
    return "paymentMethods"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId"],

      properties: {
        id: { type: "integer" },
        name: { type: "string" },
        cardNumber: { type: "string" },
        expirationDate: { type: "string" },
        cvv: { type: "string" },
        isDefault: { type: "boolean" },
        userId: { type: "integer" }
      }
    }
  }
}

export default PaymentMethod