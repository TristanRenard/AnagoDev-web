// Conversation.js
const { User } = require("lucide-react")
const { Model } = require("objection")

class Conversation extends Model {
  static get tableName() {
    return "conversations"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId", "messages"],

      properties: {
        id: { type: "integer" },
        userId: { type: "integer" },
        status: { type: "string" },
        title: { type: "string" },
        messages: {
          type: "array",
          items: { type: "object" }
        },
        "created_at": { type: "string", format: "date-time" },
        "updated_at": { type: "string", format: "date-time" }
      }
    }
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "conversations.userId",
          to: "users.id"
        }
      }
    }
  }
}

module.exports = Conversation