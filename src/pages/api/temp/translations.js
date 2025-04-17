import Translations from "@/db/models/Translations"
import knexInstance from "@/lib/db"
import Langs from "@/lib/langs"
import { Translator } from "deepl-node"

const handler = async (req, res) => {
  const { method } = req
  const { "x-user-data": userData } = req.headers
  const { "x-api-key": apiKey } = req.headers

  if (method === "POST") {
    if (!userData && !apiKey) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const user = JSON.parse(userData)

    if ((!user || user.role !== "admin") && apiKey !== process.env.API_KEY) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    console.log(req.body)

    try {
      const { texts, key } = req.body
      const langs = Object.values(Langs).map((lang) =>
        lang.picto === "en" ? "en-US" : lang.picto,
      )
      // Préparer les clés pour la recherche dans la base de données
      const textKeys = texts.map((text) => (key ? `${key}.${text}` : text))
      // Vérifier si les textes existent déjà dans la base de données
      const existingTranslations = await Translations.query(knexInstance)
        .whereIn("key", textKeys)
        .select("key", "value")
      // Créer un map des traductions existantes pour faciliter l'accès
      const existingTranslationsMap = existingTranslations.reduce(
        (acc, { key: translationKey, value }) => {
          // Correction ici: on utilise translationKey au lieu de la variable key du scope parent
          acc[translationKey] = value

          return acc
        },
        {},
      )
      // Filtrer les textes qui n'ont pas encore de traductions
      const textsToTranslate = texts.filter((text) => {
        const fullKey = key ? `${key}.${text}` : text

        return !existingTranslationsMap[fullKey]
      })
      const textsTranslationsObject = {}

      // Si des textes nécessitent une traduction
      if (textsToTranslate.length > 0) {
        // Initialiser le traducteur DeepL seulement si nécessaire
        const translator = new Translator(process.env.DEEPL_API_KEY)
        // Regrouper tous les textes dans un seul appel API par langue
        const translationsByLang = await Promise.all(
          langs.map(async (lang) => {
            // Traduire tous les textes en une seule requête
            const results = await translator.translateText(
              textsToTranslate,
              null,
              lang,
            )

            // Organiser les résultats par texte original
            return {
              lang,
              translations: results.map((result, index) => ({
                originalText: textsToTranslate[index],
                text: result.text,
              })),
            }
          }),
        )

        // Réorganiser les données par texte original puis par langue
        textsToTranslate.forEach((originalText, textIndex) => {
          const fullKey = key ? `${key}.${originalText}` : originalText
          textsTranslationsObject[fullKey] = {}

          translationsByLang.forEach(({ lang, translations }) => {
            const langKey = lang === "en-US" ? "en" : lang
            textsTranslationsObject[fullKey][langKey] =
              translations[textIndex].text
          })
        })
      }

      // Ajouter les traductions existantes au résultat
      texts.forEach((text) => {
        const fullKey = key ? `${key}.${text}` : text

        if (existingTranslationsMap[fullKey]) {
          textsTranslationsObject[fullKey] = existingTranslationsMap[fullKey]
        }
      })

      // Enregistrer les nouvelles traductions dans la base de données
      await Promise.all(
        Object.keys(textsTranslationsObject)
          .filter((textKey) => !existingTranslationsMap[textKey])
          .map(async (textKey) => {
            const object = {
              key: textKey,
              value: textsTranslationsObject[textKey],
            }
            // Vérifier si l'entrée existe déjà (double vérification pour éviter les conflits)
            const existingEntry = await Translations.query(knexInstance)
              .where("key", textKey)
              .first()

            if (existingEntry) {
              // Mettre à jour l'entrée existante
              await Translations.query(knexInstance)
                .where("key", textKey)
                .update({ value: object.value })
            } else {
              // Créer une nouvelle entrée
              await Translations.query(knexInstance).insert(object)
            }
          }),
      )

      return res.status(200).json({ translations: textsTranslationsObject })
    } catch (error) {
      console.error(error)

      return res.status(500).json({ message: error.message, error })
    }
  }

  if (method === "GET") {
    try {
      const { lang } = req.query
      const translations = await Translations.query(knexInstance).select(
        "key",
        "value",
      )

      if (!lang) {
        return res.status(200).json(translations)
      }

      const translationsObject = translations.reduce((acc, { key, value }) => {
        acc[key] = value[lang]

        return acc
      }, {})

      return res.status(200).json(translationsObject)
    } catch (error) {
      return res.status(500).json({ message: error })
    }
  }

  if (method === "DELETE") {
    if (!userData) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const user = JSON.parse(userData)

    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const { key } = req.query
      const deleted = await Translations.query(knexInstance)
        .delete()
        .where("key", key)

      return res.status(200).json({ deleted })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  if (method === "OPTIONS") {
    const translator = new Translator(process.env.DEEPL_API_KEY)
    const usage = await translator.getUsage()

    return res.status(200).json(usage.character)
  }

  return res.status(405).json({ message: "Method Not Allowed" })
}

export default handler
