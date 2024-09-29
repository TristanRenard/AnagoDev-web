/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("users", (table) => {
  table.increments("id").primary()
  table.string("first_name")
  table.string("last_name")
  table.string("email").notNullable().unique()
  table.string("customer_id")
  table.string("password")
  table.string("phone")
  table.boolean("isAdmin").defaultTo(false)
  table.boolean("isVerified").notNullable().defaultTo(false)
  table.string("verificationToken")
  table.boolean("consentMail")
  table.boolean("consentPhone")
  table.timestamps(true, true)
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("users")
