/* eslint-disable no-nested-ternary */
/* eslint-disable max-lines */
import { useState, useRef, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { X, Link, Upload as UploadIcon, Trash2, Image as Img, FileIcon, Eye, Download } from "lucide-react"
import axios from "axios"
import BackofficeLayout from "@/components/layouts/BackofficeLayout"
import Image from "next/image"
import { useI18n } from "@/locales"

// eslint-disable-next-line max-lines-per-function
const Upload = () => {
  const t = useI18n()
  const { toast } = useToast()
  const [files, setFiles] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const inputRef = useRef(null)

  // Fetch existing files when component mounts
  useEffect(() => {
    fetchUploadedFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchUploadedFiles = async () => {
    setIsLoading(true)

    try {
      const response = await axios.get("http://localhost:3000/api/backoffice/upload")
      setUploadedFiles(response.data)
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to fetch files: {{message}}", { message: error.message }),
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

    try {
      await axios.post("http://localhost:3000/api/backoffice/upload", formData)
      toast({
        title: t("Success"),
        // eslint-disable-next-line no-undef
        description: files.length === 1 ? t("File uploaded successfully") : t("Files uploaded successfully"),
        status: "success",
      })
      setFiles([])
      fetchUploadedFiles()
      setActiveTab("files")
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Upload failed: {{message}}", { message: error.message }),
        status: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }
  const handleCopyUrl = (fileName) => {
    const fileUrl = `http://localhost:3000/api/backoffice/files/${fileName}`
    navigator.clipboard.writeText(fileUrl)
    toast({
      title: t("Success"),
      description: t("File URL copied to clipboard"),
      status: "success",
    })
  }
  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }
  const handleDeleteUploaded = (fileName) => {
    // This would require an API endpoint to delete files
    // For now, we'll just show what it would look like
    toast({
      title: t("Information"),
      description: t("Delete functionality would remove \"{{fileName}}\"", { fileName }),
      status: "info",
    })
  }
  const handleDownload = (fileName) => {
    const fileUrl = `http://localhost:3000/api/backoffice/files/${fileName}`
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const isPreviewable = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase()


    return ["jpg", "jpeg", "png", "gif", "svg", "webp", "pdf", "txt", "html", "css", "js"].includes(extension)
  }
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase()

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) {
      return <Img className="h-6 w-6" />
    } else if (["pdf"].includes(extension)) {
      return <FileIcon className="h-6 w-6" />
    }


    return <FileIcon className="h-6 w-6" />
  }
  const getFilePreview = (file, isUploaded = false) => {
    const fileName = isUploaded ? file.name : file.name
    const extension = fileName.split(".").pop().toLowerCase()

    if (["jpg", "jpeg", "png", "gif", "webp", "ico"].includes(extension)) {
      if (isUploaded) {
        // For uploaded files, use the URL to the file
        const fileUrl = `http://localhost:3000/api/backoffice/files/${fileName}`


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
        <span className="ml-2 text-sm text-gray-500">{extension.toUpperCase()}</span>
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
      <Image src={preview} alt={file.name} className="w-full h-full object-cover" width={256} height={256} />
    ) : (
      <div className="flex items-center justify-center w-full h-full">{t("Loading...")}</div>
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
          <>
            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              onClick={() => inputRef.current.click()}
              className="flex flex-col border-dashed rounded-lg border-2 items-center justify-center border-purple-500 h-64 w-full cursor-pointer bg-purple-50 transition-colors hover:bg-purple-100"
            >
              <UploadIcon className="h-12 w-12 text-purple-500 mb-2" />
              <h1 className="text-2xl font-bold text-gray-800">{t("Upload Files")}</h1>
              <p className="text-gray-600 mt-2">
                <span className="underline text-purple-600 font-medium">{t("Select files")}</span> {t("or drag and drop here")}
              </p>
              <p className="text-gray-500 text-sm mt-1">{t("Any file type, up to 10MB per file")}</p>
              <input
                type="file"
                multiple
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {files.length > 0 && (
              <>
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">{t("Files to Upload ({count})", { count: files.length })}</h2>
                    <button
                      onClick={() => setFiles([])}
                      className="text-sm text-red-500 hover:text-red-700 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> {t("Clear All")}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex flex-col bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        {getFilePreview(file)}
                        <div className="p-3">
                          <div className="truncate text-sm font-medium text-gray-800" title={file.name}>
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {(file.size / 1024).toFixed(1)} KB
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(index)
                              }}
                              className="flex items-center justify-center p-2 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                              title={t("Remove file")}
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className={`flex items-center justify-center ${isLoading ? "bg-purple-400" : "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800"
                    } font-bold rounded-full py-4 px-16 text-white mt-6 self-center transition-all shadow-md hover:shadow-lg`}
                >
                  {isLoading ? (
                    <span>{t("Uploading...")}</span>
                  ) : (
                    <>
                      <UploadIcon className="mr-2 h-5 w-5" />
                      <span>{t("Upload {count} {file}", {
                        count: files.length,
                        file: files.length === 1 ? t("File") : t("Files")
                      })}</span>
                    </>
                  )}
                </button>
              </>
            )}
          </>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">{t("File Library")}</h2>
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
                <span className="ml-3 text-gray-600">{t("Loading files...")}</span>
              </div>
            ) : uploadedFiles.length === 0 ? (
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
                <h3 className="text-lg font-medium text-gray-600 mb-2">{t("No files uploaded yet")}</h3>
                <p className="text-gray-500 mb-4">{t("Start by uploading your first file")}</p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  {t("Upload Files")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex flex-col bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {getFilePreview(file, true)}
                    <div className="p-3">
                      <div className="truncate text-sm font-medium text-gray-800" title={file.name}>
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(file.lastModified).toLocaleDateString()} • {(file.size / 1024).toFixed(1)} KB
                      </div>
                      <div className="flex gap-2 mt-3 justify-between">
                        <div className="flex gap-1">
                          {isPreviewable(file.name) && (
                            <button
                              onClick={() => window.open(`http://localhost:3000/api/backoffice/files/${file.name}`, "_blank")}
                              className="flex items-center justify-center p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                              title={t("Preview file")}
                            >
                              <Eye className="h-4 w-4 text-blue-600" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDownload(file.name)}
                            className="flex items-center justify-center p-2 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                            title={t("Download file")}
                          >
                            <Download className="h-4 w-4 text-green-600" />
                          </button>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleCopyUrl(file.name)}
                            className="flex items-center justify-center p-2 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
                            title={t("Copy file URL")}
                          >
                            <Link className="h-4 w-4 text-purple-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteUploaded(file.name)}
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
            )}
          </div>
        )}
      </div>
    </BackofficeLayout>
  )
}

export default Upload