import { Model } from "objection"

class Translations extends Model {
  static get tableName() {
    return "translations"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["key", "value"],

      properties: {
        id: { type: "integer" },
        key: { type: "string" },
        value: { type: "object" }
      }
    }
  }
}

export default Translations