import Translations from "@/db/models/Translations"
import knexInstance from "@/lib/db"
import Langs from "@/lib/langs"
import { Translator } from "deepl-node"

const handler = async (req, res) => {
  const { method } = req
  const { "x-user-data": userData } = req.headers


  if (method === "POST") {
    if (!userData) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const user = JSON.parse(userData)

    if (!user || !user.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const translator = new Translator(process.env.DEEPL_API_KEY)
      const { texts, key } = req.body
      const langs = Object.values(Langs).map((lang) => (lang.picto === "en" ? "en-US" : lang.picto))
      const textsTranslations = await Promise.all(
        texts.map(async (text) => {
          const translations = await Promise.all(
            langs.map(async (lang) => {
              const { text: translated } = await translator.translateText(text, null, lang)

              return { text: translated, lang }
            })
          )

          return { originalText: text, translations }
        })
      )
      const textsTranslationsObject = textsTranslations.reduce((acc, { originalText, translations }) => {
        acc[originalText] = translations.reduce((innerAcc, { text, lang }) => {
          innerAcc[lang === "en-US" ? "en" : lang] = text

          return innerAcc
        }, {})

        return acc
      }, {})

      await Promise.all(
        Object.keys(textsTranslationsObject).map(async (text) => {
          const objectKey = key ? `${key}.${text}` : text
          const object = { key: objectKey, value: textsTranslationsObject[text] }

          await Translations.query(knexInstance)
            .insert(object)
            .onConflict("key")
            .merge()
        })
      )

      return res.status(200).json({ translations: textsTranslationsObject })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  if (method === "GET") {
    try {
      const { lang } = req.query
      const translations = await Translations.query(knexInstance).select("key", "value")

      if (!lang) {
        return res.status(200).json(translations)
      }

      const translationsObject = translations.reduce((acc, { key, value }) => {
        acc[key] = value[lang]

        return acc
      }, {})

      return res.status(200).json(translationsObject)
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  if (method === "DELETE") {
    if (!userData) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const user = JSON.parse(userData)

    if (!user || !user.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" })
    }



    try {
      const { key } = req.query
      const deleted = await Translations.query(knexInstance).delete().where("key", key)

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
