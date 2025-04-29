/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("subscriptions", (table) => {
  table.increments("id").primary()
  table.boolean("isAnnually").notNullable().defaultTo(false)
  table.string("status").notNullable().defaultTo("waiting for payment")
  table.boolean("isActive").notNullable().defaultTo(true)
  table.string("stripeSessionId").notNullable()
  table.string("invoicePath")

  table.integer("priceId").unsigned().notNullable()
  table.foreign("priceId").references("prices.id").onDelete("CASCADE")
  table.integer("userId").unsigned().notNullable()
  table.foreign("userId").references("users.id").onDelete("CASCADE")
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("subscriptions")
