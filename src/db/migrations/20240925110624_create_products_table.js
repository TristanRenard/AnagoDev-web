/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("products", (table) => {
  table.increments("id").primary()
  table.string("title").notNullable()
  table.string("description").notNullable()
  table.boolean("isMarkdown").notNullable().defaultTo(false)
  table.float("price").notNullable()
  table.boolean("isSubscription").notNullable().defaultTo(false)
  table.json("images").notNullable()
  table.integer("stock").notNullable().defaultTo(0)
  table.float("duties").notNullable().defaultTo(0)
  table.boolean("isTopProduct").notNullable().defaultTo(false)
  table.timestamps(true, true)

  table.integer("categoryId").unsigned().notNullable()
  table.foreign("categoryId").references("categories.id")
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("products")