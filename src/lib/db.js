import knex from "knex"
import { Model } from "objection"
import knexConfig from "../../knexconfig"

// Utiliser différentes configurations selon l'environnement
const environment = process.env.KNEX_ENV || "development"
const config = knexConfig[environment]

// Variable pour stocker l'instance de connexion
// On utilise global pour préserver entre les hot-reloads de Next.js
let cachedConnection = global.knexConnection

const getKnexInstance = () => {
  if (!cachedConnection) {
    // Si la connexion n'existe pas, on la crée
    cachedConnection = knex(config)

    // Stocker la connexion dans l'objet global
    global.knexConnection = cachedConnection

    // Initialiser Objection avec cette connexion
    Model.knex(cachedConnection)

    console.log("📦 Nouvelle connexion à la base de données créée")
  } else {
    console.log("♻️ Réutilisation de la connexion existante")
  }

  return cachedConnection
}

// En développement, gérer le hot-reloading de Next.js
if (process.env.NODE_ENV !== "production") {
  // Vérifier si on est dans un environnement de hot-reloading
  if (module.hot) {
    module.hot.dispose(() => {
      if (global.knexConnection) {
        console.log("🔥 Fermeture de la connexion lors du hot-reload")
        global.knexConnection.destroy()
        global.knexConnection = undefined
      }
    })
  }
}

// Obtenir l'instance et l'exporter directement
const knexInstance = getKnexInstance()

export default knexInstance