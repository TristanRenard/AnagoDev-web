import knex from "knex"
import { Model } from "objection"
import knexConfig from "../../knexfile"

// Sélectionnez l'environnement actuel (par défaut à 'development' si NODE_ENV n'est pas défini)
const environment = process.env.NODE_ENV || "development"
const config = knexConfig[environment]
// Créer une instance knex avec la configuration
const knexInstance = knex(config)

// Lier la classe Model à l'instance knex
Model.knex(knexInstance)

// Exporter l'instance knex pour utilisation ailleurs
export default knexInstance