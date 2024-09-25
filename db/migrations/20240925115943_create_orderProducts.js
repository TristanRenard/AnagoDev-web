/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable('orderProducts', (table) => {
  table.increments('id').primary()
  table.integer('orderId').unsigned().notNullable()
  table.foreign('orderId').references('orders.id').onDelete('CASCADE')
  table.integer('productId').unsigned().notNullable()
  table.foreign('productId').references('products.id').onDelete('CASCADE')
  table.integer('quantity').notNullable()
  table.timestamps(true, true)
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('orderProducts')