import { Model } from "objection"

class PhoneVerification extends Model {
  static get tableName() {
    return "phoneVerifications"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["phoneNumber", "code"],
      properties: {
        id: { type: "integer" },
        phoneNumber: { type: "string" },
        code: { type: "string" },
      }
    }
  }
}

export default PhoneVerification