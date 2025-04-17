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
  table.integer("addressId").unsigned()
  table.foreign("addressId").references("addresses.id").onDelete("CASCADE")
  table.integer("paymentMethodId").unsigned()
  table.foreign("paymentMethodId").references("paymentMethods.id").onDelete("CASCADE")
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("orders")