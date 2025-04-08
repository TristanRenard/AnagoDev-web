import Translations from "@/db/models/Translations"
import knexInstance from "@/lib/db"
import { Translator } from "deepl-node"

const handler = async (req, res) => {
  const { method } = req
  const { "x-user-data": userData } = req.headers
  const { "x-api-key": apiKey } = req.headers
  // Vérification de l'authentification
  const isAuthenticated = () => {
    if (apiKey === process.env.API_KEY) { return true }

    if (!userData) { return false }

    const user = JSON.parse(userData)


    return user && user.isAdmin
  }

  // GET: Télécharger les traductions dans un fichier JSON
  if (method === "GET") {
    try {
      // Vérifier l'authentification pour l'export
      if (!isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      // Récupérer toutes les traductions
      const translations = await Translations.query(knexInstance).select("key", "value")
      // Format du nom de fichier
      // eslint-disable-next-line prefer-destructuring
      const date = new Date().toISOString().split("T")[0]
      const filename = `translations-export-${date}.json`

      // Définir les headers pour le téléchargement
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`)
      res.setHeader("Content-Type", "application/json")

      // Envoyer les traductions comme fichier JSON
      return res.status(200).json(translations)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  // POST: Importer les traductions à partir d'un fichier JSON
  if (method === "POST") {
    try {
      // Vérifier l'authentification pour l'import
      if (!isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      // Récupérer les données JSON envoyées
      const importedTranslations = req.body

      if (!Array.isArray(importedTranslations)) {
        return res.status(400).json({ message: "Invalid format. Expected an array of translations." })
      }

      // Compteurs pour le rapport d'importation
      const importReport = {
        total: importedTranslations.length,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: []
      }

      // Traiter chaque traduction
      await Promise.all(
        importedTranslations.map(async (translation) => {
          try {
            const { key, value } = translation

            if (!key || !value) {
              // eslint-disable-next-line no-plusplus
              importReport.skipped++


              return
            }

            // Vérifier si la clé existe déjà
            const existingTranslation = await Translations.query(knexInstance)
              .where("key", key)
              .first()

            if (existingTranslation) {
              // Mettre à jour la traduction existante
              await Translations.query(knexInstance)
                .where("key", key)
                .update({ value })

              // eslint-disable-next-line no-plusplus
              importReport.updated++
            } else {
              // Créer une nouvelle traduction
              await Translations.query(knexInstance)
                .insert({ key, value })

              // eslint-disable-next-line no-plusplus
              importReport.created++
            }
          } catch (error) {
            importReport.errors.push({
              translation: translation.key,
              error: error.message
            })
            // eslint-disable-next-line no-plusplus
            importReport.skipped++
          }
        })
      )

      return res.status(200).json({
        message: "Import completed",
        report: importReport
      })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  // Vérifier l'usage de DeepL (similaire à l'endpoint original)
  if (method === "OPTIONS") {
    try {
      // Vérifier l'authentification
      if (!isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      const translator = new Translator(process.env.DEEPL_API_KEY)
      const usage = await translator.getUsage()

      return res.status(200).json(usage.character)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" })
}

export default handler