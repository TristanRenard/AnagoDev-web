/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("addresses", (table) => {
  table.increments("id").primary()
  table.string("street")
  table.string("city")
  table.string("state")
  table.string("zip")
  table.string("country")
  table.string("complement")
  table.string("name")
  table.boolean("isDefault").defaultTo(false)
  table.integer("userId").unsigned().notNullable()
  table.foreign("userId").references("users.id").onDelete("CASCADE")
  table.timestamps(true, true)
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("addresses")
