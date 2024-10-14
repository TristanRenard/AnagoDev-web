import knex from "knex"
import { Model } from "objection"
import knexConfig from "../../knexconfig"

const environment = process.env.KNEX_ENV || "development"
const config = knexConfig[environment]
const knexInstance = knex(config)

Model.knex(knexInstance)

export default knexInstance