/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("translations", (table) => {
  table.increments("id").primary()
  table.text("key").notNullable().unique()
  table.json("value").notNullable()
  table.timestamps(true, true)
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("translations")
