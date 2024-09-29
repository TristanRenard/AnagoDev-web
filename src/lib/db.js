import knex from "knex"
import { Model } from "objection"
import knexConfig from "../../knexfile"

const environment = process.env.NODE_ENV || "development"
const config = knexConfig[environment]
const knexInstance = knex(config)

Model.knex(knexInstance)

export default knexInstance