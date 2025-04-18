/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("settings", (table) => {
    table.increments("id").primary()
    table.text("mainCTA").notNullable()
    table.text("mainCTAText").notNullable()
    table.json("carrousel")
    table.text("RoleAllowedChatbot")
    table.text("modelChatbot")
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("settings")
