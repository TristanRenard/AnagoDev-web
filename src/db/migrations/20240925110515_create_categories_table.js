/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("categories", (table) => {
  table.increments("id").primary()
  table.string("title").notNullable()
  table.string("description").notNullable()
  table.json("images")
  table.integer("order").notNullable()
  table.timestamps(true, true)
})


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("categories")
