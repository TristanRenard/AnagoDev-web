/* eslint-disable max-lines-per-function */
import { useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import BackofficeLayout from "@/components/layouts/BackofficeLayout"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useI18n } from "@/locales"
import authProps from "@/serverSideProps/authProps"
import { useToast } from "@/hooks/use-toast"
import ExportTranslationsButton from "@/components/backoffice/ExportButtonTrads"
import ImportTranslationsButton from "@/components/backoffice/ImportButtonTrads"

const Traductions = () => {
  const [texts, setTexts] = useState([])
  const [key, setKey] = useState("")
  const queryClient = useQueryClient()
  const textInputRef = useRef()
  const t = useI18n()
  const { toast } = useToast()
  const translationsQuery = useQuery({
    queryKey: ["translations"],
    queryFn: () => axios(`/api/temp/translations`),
  })
  const usageQuery = useQuery({
    queryKey: ["usage"],
    queryFn: () => axios.options("/api/temp/translations"),
  })
  const addTranslationsMutation = useMutation({
    mutationFn: async () => {
      // Vérification si on a au moins un texte à traduire
      if (texts.length === 0 && !textInputRef.current.value) {
        throw new Error("No text to translate")
      }

      const postData = {
        texts: [...texts],
      }

      // Ajouter le texte présent dans l'input s'il existe
      if (textInputRef.current.value) {
        postData.texts.push(textInputRef.current.value)
      }

      // Ajouter la clé si elle existe
      if (key) {
        postData.key = key
      }

      return await axios.post("/api/temp/translations", postData)
    },
    onSuccess: () => {
      // Réinitialiser les états et le formulaire
      setTexts([])
      setKey("")

      if (textInputRef.current) {
        textInputRef.current.value = ""
        textInputRef.current.focus()
      }

      // Rafraîchir les données
      queryClient.invalidateQueries(["translations"])
      queryClient.invalidateQueries(["usage"])

      // Notifier l'utilisateur du succès
      toast({
        title: t("Translations added"),
        description: t(
          "The texts have been successfully translated and saved.",
        ),
        variant: "success",
      })
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description:
          error.message || t("An error occurred while adding translations."),
        variant: "destructive",
      })
    },
  })
  const deleteTranslationMutation = useMutation({
    mutationFn: async (translationKey) =>
      await axios.delete(
        `/api/temp/translations?key=${encodeURIComponent(translationKey)}`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["translations"])
      toast({
        title: t("Translation deleted"),
        description: t("The translation has been successfully deleted."),
        variant: "success",
      })
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description:
          error.message ||
          t("An error occurred while deleting the translation."),
        variant: "destructive",
      })
    },
  })
  const handleAddText = (e) => {
    e.preventDefault()

    const text = textInputRef.current.value.trim()

    if (!text) {
      toast({
        title: t("Error"),
        description: t("Please enter a text to add."),
        variant: "destructive",
      })

      return
    }

    setTexts((prev) => [...prev, text])
    textInputRef.current.value = ""
    textInputRef.current.focus()
  }

  return (
    <BackofficeLayout>
      <div className="flex-1 flex flex-col h-full">
        <div className="flex justify-between">
          <h1 className="p-8 font-black text-2xl py-8">{t("Traductions")}</h1>
          <div className="h-full flex justify-center items-center p-8 gap-2">
            <ImportTranslationsButton queryClient={queryClient} />
            <ExportTranslationsButton queryClient={queryClient} />
          </div>
        </div>

        {/* Formulaire pour ajouter des traductions */}
        <form
          className="flex flex-col gap-2 px-8 max-w-96"
          onSubmit={handleAddText}
        >
          <Label htmlFor="key">{t("Key")}</Label>
          <Input
            type="text"
            id="key"
            name="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={t("Translation key prefix (optional)")}
          />

          <Label htmlFor="text">{t("Text")}</Label>
          <Input
            ref={textInputRef}
            type="text"
            id="text"
            name="text"
            placeholder={t("Enter text to translate")}
          />

          <Button type="submit">{t("Add text")}</Button>

          {/* Liste des textes ajoutés */}
          {texts.length > 0 && (
            <>
              <ul className="list-disc pl-5 mt-2">
                {texts.map((text, index) => (
                  <li key={index} className="mb-1">
                    {text}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-6 w-6 p-0"
                      onClick={() =>
                        setTexts(texts.filter((_, i) => i !== index))
                      }
                    >
                      ✕
                    </Button>
                  </li>
                ))}
              </ul>
              <Separator className="my-2" />
            </>
          )}

          {/* Bouton pour envoyer les textes au serveur */}
          <Button
            type="button"
            onClick={() => addTranslationsMutation.mutate()}
            disabled={addTranslationsMutation.isLoading}
          >
            {addTranslationsMutation.isLoading
              ? t("Sending...")
              : t("Send texts")}
          </Button>

          {/* Affichage de l'utilisation de l'API DeepL */}
          {usageQuery.isSuccess && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="mt-2 cursor-pointer">
                  <p>
                    {t("Usage")}: {usageQuery.data.data.count} /{" "}
                    {usageQuery.data.data.limit}
                  </p>
                  <Progress
                    value={
                      (usageQuery.data.data.count /
                        usageQuery.data.data.limit) *
                      100
                    }
                  />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <h5 className="font-bold mb-2">{t("DeepL API Usage")}</h5>
                <p className="text-sm mb-2">
                  {t(
                    "The usage is calculated by the number of characters translated. The usage is reset every month.",
                  )}
                </p>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <p>
                    <b>{t("Limit")}:</b>
                  </p>
                  <p>{usageQuery.data.data.limit}</p>

                  <p>
                    <b>{t("Used")}:</b>
                  </p>
                  <p>{usageQuery.data.data.count}</p>

                  <p>
                    <b>{t("Remaining")}:</b>
                  </p>
                  <p>
                    {usageQuery.data.data.limit - usageQuery.data.data.count}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </form>

        {/* Liste des traductions existantes */}
        <section className="p-8 m-8 border rounded-md overflow-auto">
          {translationsQuery.isLoading && <p>{t("Loading translations...")}</p>}

          {translationsQuery.isError && (
            <p className="text-red-500">
              {t("Error")}:{" "}
              {translationsQuery.error.message ||
                t("Failed to load translations")}
            </p>
          )}

          {translationsQuery.isSuccess &&
          translationsQuery.data.data.length > 0 &&
          translationsQuery.data.data[0]?.value ? (
            <Table>
              <TableHeader>
                <TableRow className="sticky top-0 bg-white font-bold">
                  <TableHead>{t("Key")}</TableHead>
                  {Object.keys(translationsQuery.data.data[0].value).map(
                    (lang) => (
                      <TableHead key={lang}>{lang}</TableHead>
                    ),
                  )}
                  <TableHead>{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {translationsQuery.data.data.map(
                  ({ key: translationKey, value }) => (
                    <TableRow key={translationKey}>
                      <TableCell className="font-medium">
                        {translationKey}
                      </TableCell>
                      {Object.entries(value).map(([lang, text]) => (
                        <TableCell key={lang}>{text}</TableCell>
                      ))}
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            deleteTranslationMutation.mutate(translationKey)
                          }
                          disabled={deleteTranslationMutation.isLoading}
                        >
                          {t("Delete")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          ) : (
            translationsQuery.isSuccess && <p>{t("No translations found.")}</p>
          )}
        </section>
      </div>
    </BackofficeLayout>
  )
}

export default Traductions

export const getServerSideProps = async (context) => {
  const { user } = await authProps(context)

  if (!user || user.role !== "admin") {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user,
    },
  }
}
