import UploadTab from "@/components/backoffice/uploadTab"
import BackofficeLayout from "@/components/layouts/BackofficeLayout"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/locales"
import axios from "axios"
import {
  ChevronLeft,
  Download,
  Eye,
  FileIcon,
  Folder,
  FolderPlus,
  Image as Img,
  Link,
  Trash2,
  X
} from "lucide-react"
import Image from "next/image"
/* eslint-disable no-nested-ternary */
/* eslint-disable max-lines */
import { useEffect, useRef, useState } from "react"

// eslint-disable-next-line max-lines-per-function
const Upload = () => {
  const t = useI18n()
  const { toast } = useToast()
  const [files, setFiles] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [folders, setFolders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [currentPath, setCurrentPath] = useState("")
  const [newFolderName, setNewFolderName] = useState("")
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const inputRef = useRef(null)
  const folderInputRef = useRef(null)

  // Fetch existing files and folders when component mounts or path changes
  useEffect(() => {
    fetchUploadedFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath])

  const fetchUploadedFiles = async () => {
    setIsLoading(true)

    try {
      // Utilisez le paramètre path uniquement s'il y a un chemin actuel
      const response = await axios.get("/api/backoffice/upload",
        currentPath ? { params: { path: currentPath } } : {}
      )
      // Support pour l'ancien format de réponse API (tableau simple)
      // eslint-disable-next-line no-shadow
      const files = Array.isArray(response.data) ? response.data : (response.data.files || [])
      const apiFolders = Array.isArray(response.data) ? [] : (response.data.folders || [])
      // Traitement des fichiers et dossiers
      const directFolders = new Set(apiFolders)
      const directFiles = []

      // Analyser les chemins des fichiers pour identifier les dossiers implicites
      files.forEach(file => {
        const fileName = file.name

        if (fileName.includes("/")) {
          // Pour les fichiers avec des chemins (contenant des slashes)
          if (!currentPath) {
            // Extraire le premier segment de dossier
            // eslint-disable-next-line prefer-destructuring
            const firstDir = fileName.split("/")[0]
            directFolders.add(firstDir)
          } else {
            // Vérifier si ce fichier appartient au chemin du répertoire actuel
            const pathPrefix = `${currentPath}/`

            if (fileName.startsWith(pathPrefix)) {
              // Obtenir le reste du chemin après le chemin actuel
              const relativePath = fileName.substring(pathPrefix.length)

              // S'il y a encore des slashes, c'est un sous-dossier
              if (relativePath.includes("/")) {
                // eslint-disable-next-line prefer-destructuring
                const nextDir = relativePath.split("/")[0]
                directFolders.add(nextDir)
              } else {
                // C'est un fichier direct dans ce répertoire
                directFiles.push({
                  ...file,
                  displayName: relativePath
                })
              }
            }
          }
        } else if (!currentPath) {
          directFiles.push({
            ...file,
            displayName: fileName
          })
        }
      })

      setUploadedFiles(directFiles.length > 0 ? directFiles : files)
      setFolders([...directFolders])
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to fetch files: {{message}}", {
          message: error.message,
        }),
        status: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }
  const handleDrop = (event) => {
    event.preventDefault()
    const selectedFiles = Array.from(event.dataTransfer.files)
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
  }
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files)
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
  }
  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: t("Warning"),
        description: t("Please select files to upload"),
        status: "warning",
      })

      return
    }

    setIsLoading(true)
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("file", file)
    })

    // Add current path to the form data only if we're in a subfolder
    if (currentPath) {
      formData.append("path", currentPath)
    }

    try {
      await axios.post("/api/backoffice/upload", formData)
      toast({
        title: t("Success"),
        description:
          files.length === 1
            ? t("File uploaded successfully")
            : t("Files uploaded successfully"),
        status: "success",
      })
      setFiles([])
      fetchUploadedFiles()
      setActiveTab("files")
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Upload failed: {{message}}", {
          message: error.message,
        }),
        status: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }
  const handleCopyUrl = (fileName) => {
    // Include the path in the URL only if we're in a subfolder
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const fileUrl = `/api/backoffice/files/${currentPath ? `${currentPath}/` : ""}${fileName}`
    navigator.clipboard.writeText(`${origin}${fileUrl}`)
    toast({
      title: t("Success"),
      description: t("File URL copied to clipboard"),
      status: "success",
    })
  }
  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }
  const handleDeleteUploaded = async (fileName) => {
    try {
      await axios.delete("/api/backoffice/upload", {
        params: {
          fileName: currentPath ? `${currentPath}/${fileName}` : fileName
        },
      })
      toast({
        title: t("Information"),
        description: t(`${fileName} deleted successfully`),
        status: "info",
      })
      fetchUploadedFiles()
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to delete file: {{message}}", {
          message: error.message,
        }),
        status: "error",
      })
    }
  }
  const handleDeleteFolder = async (folderName) => {
    try {
      await axios.delete("/api/backoffice/folder", {
        params: {
          folderName: currentPath ? `${currentPath}/${folderName}` : folderName
        },
      })
      toast({
        title: t("Information"),
        description: t(`Folder ${folderName} deleted successfully`),
        status: "info",
      })
      fetchUploadedFiles()
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to delete folder: {{message}}", {
          message: error.message,
        }),
        status: "error",
      })
    }
  }
  const handleDownload = (fileName) => {
    const fileUrl = `/api/backoffice/files/${currentPath ? `${currentPath}/` : ""}${fileName}`
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const navigateToFolder = (folderName) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName
    setCurrentPath(newPath)
  }
  const navigateUp = () => {
    if (!currentPath) { return }

    const pathParts = currentPath.split("/")
    pathParts.pop()
    const newPath = pathParts.join("/")
    setCurrentPath(newPath)
  }
  const createNewFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: t("Warning"),
        description: t("Please enter a folder name"),
        status: "warning",
      })


      return
    }

    try {
      await axios.post("/api/backoffice/folder", {
        folderName: newFolderName,
        path: currentPath
      })

      toast({
        title: t("Success"),
        description: t("Folder created successfully"),
        status: "success",
      })

      setNewFolderName("")
      setShowNewFolderInput(false)
      fetchUploadedFiles()
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to create folder: {{message}}", {
          message: error.message,
        }),
        status: "error",
      })
    }
  }
  const isPreviewable = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase()

    return [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "svg",
      "webp",
      "pdf",
      "txt",
      "html",
      "css",
      "js",
      "ico",
      "pdf"
    ].includes(extension)
  }
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase()

    if (["jpg", "jpeg", "png", "gif", "svg", "webp", "ico"].includes(extension)) {
      return <Img className="h-6 w-6" />
    } else if (["pdf"].includes(extension)) {
      return <FileIcon className="h-6 w-6" />
    }

    return <FileIcon className="h-6 w-6" />
  }
  const getFilePreview = (file, isUploaded = false) => {
    // Get display name (without path)
    const fileName = isUploaded ? (file.displayName || file.name) : file.name
    const extension = fileName.split(".").pop().toLowerCase()

    if (["jpg", "jpeg", "png", "gif", "webp", "ico"].includes(extension)) {
      if (isUploaded) {
        // For uploaded files, use the URL to the file
        const fileUrl = `/api/backoffice/files/${currentPath ? `${currentPath}/` : ""}${fileName}`

        return (
          <div className="relative w-full h-32 bg-gray-200 rounded-md overflow-hidden">
            <Image
              src={fileUrl}
              alt={fileName}
              width={256}
              height={256}
              className="w-full h-full object-cover"
            />
          </div>
        )
      }

      // For files being uploaded, use FileReader
      return (
        <div className="relative w-full h-32 bg-gray-200 rounded-md overflow-hidden">
          <PreviewImage file={file} />
        </div>
      )
    }

    // Default preview for non-image files
    return (
      <div className="flex items-center justify-center w-full h-32 bg-gray-100 rounded-md">
        {getFileIcon(fileName)}
        <span className="ml-2 text-sm text-gray-500">
          {extension.toUpperCase()}
        </span>
      </div>
    )
  }
  // Component to handle image preview
  const PreviewImage = ({ file }) => {
    const [preview, setPreview] = useState(null)

    useEffect(() => {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)

      return () => {
        // Clean up when unmounting
        reader.abort()
      }
    }, [file])

    return preview ? (
      <Image
        src={preview}
        alt={file.name}
        className="w-full h-full object-cover"
        width={256}
        height={256}
      />
    ) : (
      <div className="flex items-center justify-center w-full h-full">
        {t("Loading...")}
      </div>
    )
  }
  // Generate breadcrumbs from current path
  const renderBreadcrumbs = () => {
    if (!currentPath) { return null }

    const parts = currentPath.split("/")

    return (
      <div className="flex items-center text-sm text-gray-600 flex-wrap">
        <button
          onClick={() => setCurrentPath("")}
          className="hover:text-purple-600 transition-colors mb-1"
        >
          {t("Home")}
        </button>

        {parts.map((part, index) => (
          <div key={index} className="flex items-center mb-1">
            <span className="mx-2">/</span>
            <button
              onClick={() => setCurrentPath(parts.slice(0, index + 1).join("/"))}
              className="hover:text-purple-600 transition-colors"
            >
              {part}
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <BackofficeLayout>
      <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2 mr-2 font-medium ${activeTab === "upload"
              ? "text-purple-700 border-b-2 border-purple-700"
              : "text-gray-500 hover:text-purple-500"
              }`}
          >
            {t("Upload Files")}
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={`px-4 py-2 font-medium ${activeTab === "files"
              ? "text-purple-700 border-b-2 border-purple-700"
              : "text-gray-500 hover:text-purple-500"
              }`}
          >
            {t("File Library")}
          </button>
        </div>

        {activeTab === "upload" ? (
          <UploadTab
            files={files}
            getFilePreview={getFilePreview}
            handleDelete={handleDelete}
            handleFileChange={handleFileChange}
            handleUpload={handleUpload}
            inputRef={inputRef}
            isLoading={isLoading}
            setFiles={setFiles}
            handleDrop={handleDrop}
            t={t}
          />
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {t("File Library")}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowNewFolderInput(true)
                    setTimeout(() => {
                      if (folderInputRef.current) {
                        folderInputRef.current.focus()
                      }
                    }, 100)
                  }}
                  className="flex items-center text-sm text-purple-600 hover:text-purple-800 mr-4"
                >
                  <FolderPlus className="h-4 w-4 mr-1" />
                  {t("New Folder")}
                </button>
                <button
                  onClick={fetchUploadedFiles}
                  className="flex items-center text-sm text-purple-600 hover:text-purple-800"
                >
                  <svg
                    className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {t("Refresh")}
                </button>
              </div>
            </div>

            {/* Show new folder input if active */}
            {showNewFolderInput && (
              <div className="mb-4 flex items-center">
                <input
                  type="text"
                  ref={folderInputRef}
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder={t("Enter folder name")}
                  className="border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-grow"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      createNewFolder()
                    } else if (e.key === "Escape") {
                      setShowNewFolderInput(false)
                      setNewFolderName("")
                    }
                  }}
                />
                <button
                  onClick={createNewFolder}
                  className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700"
                >
                  {t("Create")}
                </button>
                <button
                  onClick={() => {
                    setShowNewFolderInput(false)
                    setNewFolderName("")
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Path indicator and breadcrumbs */}
            {currentPath && (
              <div className="items-center px-4 py-2 bg-gray-50 rounded-md border border-gray-200 flex  gap-1">
                {renderBreadcrumbs()}
              </div>
            )}

            {/* Back button when in a subfolder */}
            {currentPath && (
              <button
                onClick={navigateUp}
                className="flex items-center mb-4 text-purple-600 hover:text-purple-800"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                {t("Back to parent folder")}
              </button>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <svg
                  className="animate-spin h-8 w-8 text-purple-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="ml-3 text-gray-600">
                  {t("Loading files...")}
                </span>
              </div>
            ) : folders.length === 0 && uploadedFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-12">
                <svg
                  className="h-16 w-16 text-gray-400 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {currentPath
                    ? t("This folder is empty")
                    : t("No files uploaded yet")}
                </h3>
                <p className="text-gray-500 mb-4">
                  {t("Start by uploading your first file or creating a folder")}
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    {t("Upload Files")}
                  </button>
                  <button
                    onClick={() => {
                      setShowNewFolderInput(true)
                      setTimeout(() => {
                        if (folderInputRef.current) {
                          folderInputRef.current.focus()
                        }
                      }, 100)
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    {t("Create Folder")}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Render folders first */}
                {folders.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-700 mb-3">
                      {t("Folders")}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {folders.map((folder) => (
                        <div
                          key={folder}
                          className="flex flex-col bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div
                            className="flex items-center justify-center w-full h-32 bg-yellow-50 cursor-pointer"
                            onClick={() => navigateToFolder(folder)}
                          >
                            <Folder className="h-16 w-16 text-yellow-500" />
                          </div>
                          <div className="p-3">
                            <div
                              className="truncate text-sm font-medium text-gray-800 cursor-pointer"
                              title={folder}
                              onClick={() => navigateToFolder(folder)}
                            >
                              {folder}
                            </div>
                            <div className="flex justify-end mt-3">
                              <button
                                onClick={() => handleDeleteFolder(folder)}
                                className="flex items-center justify-center p-2 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                                title={t("Delete folder")}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Render files */}
                {uploadedFiles.length > 0 && (
                  <div>
                    {folders.length > 0 && (
                      <h3 className="text-md font-medium text-gray-700 mb-3">
                        {t("Files")}
                      </h3>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.displayName || file.name}
                          className="flex flex-col bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          {getFilePreview(file, true)}
                          <div className="p-3">
                            <div
                              className="truncate text-sm font-medium text-gray-800"
                              title={file.displayName || file.name}
                            >
                              {file.displayName || file.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(file.lastModified).toLocaleDateString()} •{" "}
                              {(file.size / 1024).toFixed(1)} KB
                            </div>
                            <div className="flex gap-2 mt-3 justify-between">
                              <div className="flex gap-1">
                                {isPreviewable(file.displayName || file.name) && (
                                  <button
                                    onClick={() =>
                                      window.open(
                                        `/api/backoffice/files/${currentPath ? `${currentPath}/` : ""}${file.displayName || file.name}`,
                                        "_blank",
                                      )
                                    }
                                    className="flex items-center justify-center p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                                    title={t("Preview file")}
                                  >
                                    <Eye className="h-4 w-4 text-blue-600" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDownload(file.displayName || file.name)}
                                  className="flex items-center justify-center p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                                  title={t("Download file")}
                                >
                                  <Download className="h-4 w-4 text-green-600" />
                                </button>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleCopyUrl(file.displayName || file.name)}
                                  className="flex items-center justify-center p-2 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
                                  title={t("Copy file URL")}
                                >
                                  <Link className="h-4 w-4 text-purple-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUploaded(file.displayName || file.name)}
                                  className="flex items-center justify-center p-2 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                                  title={t("Delete file")}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </BackofficeLayout>
  )
}

export default Upload