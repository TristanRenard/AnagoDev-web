/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex) => knex.schema.createTable("users", (table) => {
  table.increments("id").primary()
  table.string("firstName")
  table.string("lastName")
  table.string("email").notNullable().unique()
  table.string("customerId")
  table.string("password")
  table.string("phone")
  table.boolean("isAdmin").defaultTo(false)
  table.boolean("isVerified").notNullable().defaultTo(false)
  table.string("verificationToken")
  table.boolean("consentMail")
  table.boolean("consentPhone")
  table.timestamp("otpCreation")
  table.timestamps(true, true)
})

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex) => knex.schema.dropTable("users")
