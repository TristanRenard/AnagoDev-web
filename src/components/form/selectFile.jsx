/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import axios from "axios"
import { Check, File, FileIcon, Loader2, Search, X } from "lucide-react"
import React, { useEffect, useState } from "react"

/**
 * SingleFileSelector component for selecting a single file from previously uploaded files
 * @param {Object} props Component props
 * @param {string|null} props.selectedFile Currently selected file URL
 * @param {Function} props.setSelectedFile Function to update the selected file state
 * @param {Function} props.onSelect Optional callback when a file is selected
 * @param {string} props.apiEndpoint API endpoint to fetch files from (default: "/api/backoffice/upload")
 * @param {string} props.fileBaseUrl Base URL for file access (default: "/api/backoffice/files/")
 * @param {Array<string>} props.allowedTypes Array of allowed file extensions (e.g. ["jpg", "png"])
 */
export const SingleFileSelector = ({
  selectedFile,
  setSelectedFile,
  onSelect,
  apiEndpoint = "/api/backoffice/upload",
  fileBaseUrl = "/api/backoffice/files/",
  allowedTypes = [],
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)

  // Fetch files when modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchFiles()
    }
  }, [isOpen])

  const fetchFiles = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(apiEndpoint)

      // If allowedTypes is provided, filter files by extension
      let filteredFiles = response.data

      if (allowedTypes.length > 0) {
        filteredFiles = response.data.filter(file => {
          const extension = file.name.split(".").pop().toLowerCase()


          return allowedTypes.includes(extension)
        })
      }

      setFiles(filteredFiles)
    } catch (err) {
      console.error("Error fetching files:", err)
      setError("Failed to load files. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  const handleSelectFile = (file) => {
    const fileUrl = `${fileBaseUrl}${file.name}`
    setSelectedFile(fileUrl)
    setIsOpen(false)

    if (onSelect) {
      onSelect({ ...file, url: fileUrl })
    }
  }
  const handleClearSelection = () => {
    setSelectedFile(null)

    if (onSelect) {
      onSelect(null)
    }
  }
  const getFileNameFromUrl = (url) => {
    if (!url) { return null }

    return url.split("/").pop()
  }
  const isImageFile = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase()


    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)
  }
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full">
      {/* Selected file display */}
      {selectedFile ? (
        <div className="flex items-center justify-between border rounded-lg p-3 bg-white">
          <div className="flex items-center">
            {isImageFile(selectedFile) ? (
              <div className="w-12 h-12 mr-3 rounded-md overflow-hidden bg-gray-100">
                <img
                  src={selectedFile}
                  alt={getFileNameFromUrl(selectedFile)}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 mr-3 flex items-center justify-center bg-gray-100 rounded-md">
                <FileIcon className="w-6 h-6 text-gray-500" />
              </div>
            )}
            <div className="flex-1 truncate">
              <p className="font-medium text-sm truncate">{getFileNameFromUrl(selectedFile)}</p>
              <p className="text-xs text-gray-500 truncate">{selectedFile}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsOpen(true)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Change
            </button>
            <button
              onClick={handleClearSelection}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex flex-col items-center text-gray-500">
            <File className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Select a file</span>
          </div>
        </button>
      )}

      {/* File selection modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Select a File</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search files..."
                  className="w-full p-2 pl-9 border rounded-md"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              {allowedTypes.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Allowed types: {allowedTypes.join(", ")}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                  <p className="mt-2 text-gray-500">Loading files...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-40 text-red-500">
                  <p>{error}</p>
                  <button
                    onClick={fetchFiles}
                    className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <p>No files found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.name}
                      onClick={() => handleSelectFile(file)}
                      className={`relative flex flex-col border rounded-lg overflow-hidden cursor-pointer transition-colors ${selectedFile === file.name
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"
                        }`}
                    >
                      {/* Preview */}
                      <div className="h-24 bg-gray-100 flex items-center justify-center">
                        {isImageFile(file.name) ? (
                          <img
                            src={`${fileBaseUrl}${file.name}`}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileIcon className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      {/* File name and details */}
                      <div className="p-2">
                        <div className="truncate text-xs font-medium" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      {/* Selected indicator */}
                      {selectedFile === file.name && (
                        <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={fetchFiles}
                className="px-4 py-2 flex items-center border rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-1"
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
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}