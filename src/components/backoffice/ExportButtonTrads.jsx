import React, { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"


const ExportTranslationsButton = ({ queryClient, className = "", onSuccess = () => [], onError = () => [] }) => {
  const [isLoading, setIsLoading] = useState(false)
  const handleExport = async () => {
    try {
      setIsLoading(true)

      // Requête GET vers l'endpoint d'export
      const response = await axios.get("/api/translations/imports", {
        responseType: "blob",
        headers: {
          "x-user-data": localStorage.getItem("userData") || "",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || ""
        }
      })
      // Créer un URL pour le blob
      const url = window.URL.createObjectURL(new Blob([response.data]))
      // Créer un élément <a> pour le téléchargement
      const link = document.createElement("a")
      link.href = url

      // Déterminer le nom du fichier
      const contentDisposition = response.headers["content-disposition"]
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/["']/gu, "")
        : `translations-export-${new Date().toISOString().split("T")[0]}.json`

      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()

      // Nettoyer
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)

      onSuccess("Traductions exportées avec succès")
    } catch (error) {
      onError(error.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
      queryClient.invalidateQueries(["translations"])
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isLoading}
      className={className}
      type="button"
    >
      {isLoading ? "Exportation..." : "Exporter les traductions"}
    </Button>
  )
}

export default ExportTranslationsButton