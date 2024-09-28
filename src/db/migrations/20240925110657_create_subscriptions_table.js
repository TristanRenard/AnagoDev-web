/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("subscriptions", (table) => {
  table.increments("id").primary()
  table.boolean("isAnnually").notNullable().defaultTo(false)
  table.float("price").notNullable()
  table.timestamps(true, true)

  table.integer("productId").unsigned().notNullable()
  table.foreign("productId").references("products.id").onDelete("CASCADE")
  table.integer("userId").unsigned().notNullable()
  table.foreign("userId").references("users.id").onDelete("CASCADE")
  table.integer("orderId").unsigned().notNullable()
  table.foreign("orderId").references("orders.id").onDelete("CASCADE")
  table.integer("paymentMethodId").unsigned().notNullable()
  table.foreign("paymentMethodId").references("paymentMethods.id")
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("subscriptions")
