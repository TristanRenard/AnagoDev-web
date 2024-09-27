/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable('paymentMethods', (table) => {
  table.increments('id').primary()
  table.string('name')
  table.string('cardNumber')
  table.string('expirationDate')
  table.string('securityCode')
  table.boolean('isDefault').defaultTo(false)
  table.integer('userId').unsigned().notNullable()
  table.foreign('userId').references('users.id').onDelete('CASCADE')
  table.timestamps(true, true)
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable('paymentMethods')
