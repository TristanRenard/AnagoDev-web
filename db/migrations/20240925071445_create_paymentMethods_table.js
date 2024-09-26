/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("paymentMethods", (table) => {
  table.increments("id").primary()
  table.string("name")
  table.string("cardNumber")
  table.string("expirationDate")
  table.timestamps(true, true)

  table.integer("userId").unsigned().notNullable()
  table.foreign("userId").references("users.id").onDelete("CASCADE")
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("paymentMethods")
