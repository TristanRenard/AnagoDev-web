/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("users", (table) => {
  table.increments("id").primary()
  table.string("first_name")
  table.string("last_name")
  table.string("email")
  table.string("password")
  table.string("phone")
  table.boolean("isAdmin")
  table.timestamps(true, true)
  table.boolean("consentMail")
  table.boolean("consentPhone")
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => {
  return knex.schema.dropTable("users")
}
