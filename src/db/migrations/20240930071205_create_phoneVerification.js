/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("phoneVerifications", (table) => {
  table.increments("id").primary()
  table.string("phoneNumber").notNullable()
  table.string("code").notNullable()
  table.timestamps(true, true)
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("phoneVerifications")
