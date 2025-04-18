import { Model } from "objection"

class Settings extends Model {
    static get tableName() {
        return "settings"
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["mainCTA", "carrousel", "RoleAllowedChatbot", "modelChatbot"],

            properties: {
                id: { type: "integer" },
                mainCTA: { type: "string", default: "anagodev.com" },
                carrousel: {
                    type: "object",
                    required: ["slides"],
                    properties: {
                        slides: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    titre: { type: "string" },
                                    text: { type: "string" },
                                    img: { type: ["string", "array"] },
                                    cta: { type: "string" },
                                    textCta: { type: "string" },
                                },
                            },
                        },
                    },
                },
                RoleAllowedChatbot: { type: "string", default: "user" },
                modelChatbot: { type: "string", default: "gpt-3.5-turbo" },
            },
        }
    }
}

export default Settings