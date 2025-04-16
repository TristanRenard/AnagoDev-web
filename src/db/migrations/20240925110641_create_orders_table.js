/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("orders", (table) => {
  table.increments("id").primary()
  table.string("status").notNullable()
  table.timestamps(true, true)
  table.integer("userId").unsigned().notNullable()
  table.foreign("userId").references("users.id").onDelete("CASCADE")
  table.integer("addressId").unsigned().notNullable()
  table.integer("paymentMethodId").unsigned().notNullable()
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("orders")