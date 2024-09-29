import { marked } from "marked"

/**
 * Fonction de formatage du texte Markdown
 * @param {string} text - Le contenu au format Markdown
 * @param {Array} params - Tableau de paramètres [{ name: "paramName", value: "paramValue" }]
 * @returns {string} - Le texte converti en HTML avec les paramètres remplacés
 */
const mailFormater = (text, params) => {
  let formattedText = text

  params.forEach((param) => {
    const regex = new RegExp(`\\{{2}${param.name}\\}{2}`, "gu")
    formattedText = formattedText.replace(regex, param.value)
  })

  const htmlText = marked(formattedText)

  return htmlText
}

export default mailFormater