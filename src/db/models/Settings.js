import { Model } from "objection"

class Settings extends Model {
    static get tableName() {
        return "settings"
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["mainCTA", "carrousel"],

            properties: {
                id: { type: "integer" },
                mainCTA: { type: "string" },
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
            },
        }
    }
}

export default Settings