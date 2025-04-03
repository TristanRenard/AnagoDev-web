/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("prices", (table) => {
  table.increments("id").primary()
  table.string("stripeId").notNullable()
  table.boolean("recurring").defaultTo(false)
  table.string("nickname")
  table.integer("unit_amount").notNullable()
  table.string("currency").default("eur").notNullable()
  table.string("interval")

  table.integer("productId").unsigned().notNullable()
  table.foreign("productId").references("products.id").onDelete("CASCADE")
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("prices")
