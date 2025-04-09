import { createI18n } from "next-international"

const fetchTranslations = async (locale) => {
  const response = await fetch(`/api/temp/translations?lang=${locale}`)
  const data = await response.json()

  return { default: data }
}

export const { useI18n, useScopedI18n, I18nProvider, getLocaleProps, useChangeLocale, useCurrentLocale } = createI18n({
  en: async () => await fetchTranslations("en"),
  fr: async () => await fetchTranslations("fr"),
  es: async () => await fetchTranslations("es"),
  de: async () => await fetchTranslations("de"),
  it: async () => await fetchTranslations("it"),
  ar: async () => await fetchTranslations("ar"),
})
