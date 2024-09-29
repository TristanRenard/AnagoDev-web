/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("carousel", (table) => {
  table.increments("id").primary()
  table.string("name").unique().notNullable()
  table.string("description").notNullable()
  table.json("images").notNullable()
  table.string("link").notNullable()
  table.integer("order").notNullable()
  table.timestamps(true, true)
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("carousel")
