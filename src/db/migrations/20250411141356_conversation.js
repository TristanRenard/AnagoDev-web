/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("conversations", (table) => {
  table.increments("id").primary()
  table.integer("userId").notNullable()
  table.string("status")
  table.string("title")
  table.json("messages").notNullable()
  table.timestamps(true, true)
  table.foreign("userId").references("users.id").onDelete("CASCADE")
  table.index("userId")
  table.index("title")
})


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("conversations")