import React, { useState, useRef } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"


// eslint-disable-next-line no-empty-function
const ImportTranslationsButton = ({ queryClient, className = "", onSuccess = () => { }, onError = () => { } }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)
  // Ouvre le sélecteur de fichier
  const handleSelectFile = () => {
    fileInputRef.current.click()
  }
  // Gère la sélection du fichier
  const handleFileChange = (event) => {
    // eslint-disable-next-line prefer-destructuring
    const file = event.target.files[0]

    if (file) {
      setSelectedFile(file)
      // Si un fichier est sélectionné, déclencher directement l'import
      handleImport(file)
    }
  }
  // Importe les traductions
  const handleImport = async (file) => {
    const fileToImport = file || selectedFile

    if (!fileToImport) {
      onError("Veuillez sélectionner un fichier JSON à importer.")


      return
    }

    try {
      setIsLoading(true)

      // Lire le contenu du fichier
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = (e) => reject(e)
        reader.readAsText(fileToImport)
      })
      // Parser le JSON
      const jsonData = JSON.parse(fileContent)
      // Envoyer les données à l'endpoint d'import
      const response = await axios.post("/api/translations/imports", jsonData, {
        headers: {
          "Content-Type": "application/json",
          "x-user-data": localStorage.getItem("userData") || "",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || ""
        }
      })
      // Afficher le rapport d'importation
      const { report } = response.data
      onSuccess(`Import terminé: ${report.created} créées, ${report.updated} mises à jour, ${report.skipped} ignorées.`)

      // Réinitialiser la sélection de fichier
      setSelectedFile(null)

      if (fileInputRef.current) { fileInputRef.current.value = "" }
    } catch (error) {
      onError(error.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
      queryClient.invalidateQueries(["translations"])
    }
  }

  return (
    <>
      <Button
        onClick={handleSelectFile}
        disabled={isLoading}
        className={className}
        type="button"
        variant="secondary"
      >
        {isLoading ? "Importation..." : "Importer des traductions"}
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
    </>
  )
}

export default ImportTranslationsButton