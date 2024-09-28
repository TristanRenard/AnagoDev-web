/* eslint-disable camelcase */
import { Model } from "objection"

class Address extends Model {
  static get tableName() {
    return "addresses"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["user_id"],

      properties: {
        id: { type: "integer" },
        street: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        zip: { type: "string" },
        country: { type: "string" },
        complement: { type: "string" },
        name: { type: "string" },
        isDefault: { type: "boolean" },
        user_id: { type: "integer" }
      }
    }
  }
}

export default Address
