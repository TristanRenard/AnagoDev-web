import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import axios from "axios"
import { Check, FileIcon, GripVertical, Loader2, Search, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

/**
 * SortableFile component for handling individual file items in the sortable list
 */
const SortableFile = ({ file, onRemove, isImageFile }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: file.url })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-white border-b last:border-b-0"
    >
      <div className="flex items-center flex-1">
        <div
          {...attributes}
          {...listeners}
          className="mr-2 text-gray-400 cursor-grab touch-manipulation"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {isImageFile(file.name) ? (
          <div className="w-10 h-10 mr-3 rounded-md overflow-hidden bg-gray-100">
            <Image
              width={1920}
              height={1080}
              src={file.url}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 mr-3 flex items-center justify-center bg-gray-100 rounded-md">
            <FileIcon className="w-5 h-5 text-gray-500" />
          </div>
        )}
        <div className="flex-1 truncate">
          <p className="font-medium text-sm truncate">{file.name}</p>
          {!file.isPlaceholder && (
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
          )}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove(file.url)
        }}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  )
}
/**
 * Regular File component (non-sortable) for displaying files when organize is false
 */
const RegularFile = ({ file, onRemove, isImageFile }) => (
  <div className="flex items-center justify-between p-3 bg-white border-b last:border-b-0">
    <div className="flex items-center">
      {isImageFile(file.name) ? (
        <div className="w-10 h-10 mr-3 rounded-md overflow-hidden bg-gray-100">
          <Image
            width={1920}
            height={1080}
            src={file.url}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-10 h-10 mr-3 flex items-center justify-center bg-gray-100 rounded-md">
          <FileIcon className="w-5 h-5 text-gray-500" />
        </div>
      )}
      <div className="flex-1 truncate">
        <p className="font-medium text-sm truncate">{file.name}</p>
        {!file.isPlaceholder && (
          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
        )}
      </div>
    </div>
    <button
      onClick={() => onRemove(file.url)}
      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
    >
      <X className="w-4 h-4 text-gray-500" />
    </button>
  </div>
)

/**
 * MultiFileSelector component for selecting multiple files from previously uploaded files
 * @param {Object} props Component props
 * @param {Array<string>} props.selectedFiles Array of currently selected file URLs
 * @param {Function} props.setSelectedFiles Function to update the selected files state
 * @param {Function} props.onSelect Optional callback when files selection changes
 * @param {string} props.apiEndpoint API endpoint to fetch files from (default: "/api/backoffice/upload")
 * @param {string} props.fileBaseUrl Base URL for file access (default: "/api/backoffice/files/")
 * @param {Array<string>} props.allowedTypes Array of allowed file extensions (e.g. ["jpg", "png"])
 * @param {number} props.maxFiles Maximum number of files that can be selected (optional)
 * @param {boolean} props.organize Enable drag and drop reordering of selected files
 */
// eslint-disable-next-line max-lines-per-function
export const MultiFileSelector = ({
  selectedFiles = [],
  setSelectedFiles,
  onSelect,
  apiEndpoint = "/api/backoffice/upload",
  fileBaseUrl = "/api/backoffice/files/",
  allowedTypes = [],
  maxFiles = 0,
  organize = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState(null)
  const [activeId, setActiveId] = useState(null)
  // Pour forcer le rendu après réorganisation
  const [renderKey, setRenderKey] = useState(0)
  const prevSelectedFilesRef = useRef(selectedFiles)
  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Surveiller les changements dans selectedFiles pour forcer un re-rendu si nécessaire
  useEffect(() => {
    if (JSON.stringify(prevSelectedFilesRef.current) !== JSON.stringify(selectedFiles)) {
      prevSelectedFilesRef.current = selectedFiles
      setRenderKey(prev => prev + 1)
    }
  }, [selectedFiles])

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
  const getFileNameFromUrl = (url) => {
    if (!url) { return null }


    return url.split("/").pop()
  }
  const getFileNamesFromUrls = () => selectedFiles.map(url => getFileNameFromUrl(url))
  const toggleFileSelection = (file) => {
    const fileUrl = `${fileBaseUrl}${file.name}`
    let newSelectedFiles = [...selectedFiles]

    if (selectedFiles.includes(fileUrl)) {
      // Remove file if already selected
      newSelectedFiles = selectedFiles.filter(f => f !== fileUrl)
    } else {
      // Add file if not at max limit
      if (maxFiles > 0 && selectedFiles.length >= maxFiles) {
        alert(`You can select a maximum of ${maxFiles} files.`)


        return
      }

      newSelectedFiles.push(fileUrl)
    }

    setSelectedFiles(newSelectedFiles)

    if (onSelect) {
      onSelect(newSelectedFiles)
    }
  }
  const handleRemoveFile = (fileUrl) => {
    const newSelectedFiles = selectedFiles.filter(f => f !== fileUrl)
    setSelectedFiles(newSelectedFiles)

    if (onSelect) {
      onSelect(newSelectedFiles)
    }
  }
  const isImageFile = (fileName) => {
    if (!fileName) { return false }

    const extension = fileName.split(".").pop().toLowerCase()


    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension)
  }
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const getSelectedFilesData = () => {
    const fileNames = getFileNamesFromUrls()


    return files.filter(file => fileNames.includes(file.name)).map(file => ({
      ...file,
      url: `${fileBaseUrl}${file.name}`
    }))
  }
  // Get display files with fallback for files not yet loaded from API
  const getDisplayFiles = () => {
    const loadedFiles = getSelectedFilesData()
    // eslint-disable-next-line no-unused-vars
    const loadedUrls = loadedFiles.map(file => file.url)
    // Créer un Map pour conserver l'ordre correct basé sur selectedFiles
    const fileMap = new Map()

    // Mapper les fichiers chargés par URL
    loadedFiles.forEach(file => {
      fileMap.set(file.url, file)
    })

    // Ajouter les URLs manquantes
    selectedFiles.forEach(url => {
      if (!fileMap.has(url)) {
        fileMap.set(url, {
          name: getFileNameFromUrl(url),
          url,
          size: 0,
          isPlaceholder: true,
        })
      }
    })

    // Construire le tableau final dans l'ordre de selectedFiles
    return selectedFiles.map(url => fileMap.get(url)).filter(Boolean)
  }
  // Handle drag end event
  const handleDragEnd = (event) => {
    const { active, over } = event

    setActiveId(null)

    if (!over) { return }

    if (active.id !== over.id) {
      const oldIndex = selectedFiles.findIndex(url => url === active.id)
      const newIndex = selectedFiles.findIndex(url => url === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        // Create a completely new array to ensure state updates properly
        const newSelectedFiles = [...selectedFiles]
        // Remove the item from its old position
        const [movedItem] = newSelectedFiles.splice(oldIndex, 1)

        // Insert at new position
        newSelectedFiles.splice(newIndex, 0, movedItem)

        // Directement mettre à jour l'état avec le nouvel array 
        console.log("Updating order from:", selectedFiles)
        console.log("to:", newSelectedFiles)

        // Important: utiliser une nouvelle référence pour forcer la mise à jour
        const uniqueArray = [...newSelectedFiles]
        setSelectedFiles(uniqueArray)

        // Aussi notifier le composant parent si le callback existe
        if (onSelect) {
          onSelect(uniqueArray)
        }

        // Force le re-rendu pour s'assurer que les changements sont visibles
        setRenderKey(prev => prev + 1)
      }
    }
  }
  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }
  // Get the active file for drag overlay
  const getActiveFile = () => {
    if (!activeId) { return null }


    return getDisplayFiles().find(file => file.url === activeId)
  }
  const displayFiles = getDisplayFiles()

  return (
    <div className="w-full">
      {/* Selected files display */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">Selected Files ({selectedFiles.length})</div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-3 py-1 text-sm bg-purple-600 text-white hover:bg-purple-700 rounded-md transition-colors"
          >
            {selectedFiles.length > 0 ? "Change Files" : "Select Files"}
          </button>
        </div>

        {selectedFiles.length === 0 ? (
          <div className="border border-dashed rounded-lg p-4 flex items-center justify-center bg-gray-50">
            <p className="text-sm text-gray-500">No files selected</p>
          </div>
        ) : organize ? (
          <div key={renderKey} className="border rounded-lg overflow-hidden">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedFiles}
                strategy={verticalListSortingStrategy}
              >
                {displayFiles.map((file) => (
                  <SortableFile
                    key={`sortable-${file.url}-${renderKey}`}
                    file={file}
                    onRemove={handleRemoveFile}
                    isImageFile={isImageFile}
                  />
                ))}
              </SortableContext>

              <DragOverlay>
                {activeId ? (
                  <div className="flex items-center justify-between p-3 bg-white shadow-lg rounded-md border-2 border-purple-400">
                    <div className="flex items-center">
                      {(() => {
                        const activeFile = getActiveFile()

                        if (!activeFile) { return null }

                        return isImageFile(activeFile.name) ? (
                          <div className="w-10 h-10 mr-3 rounded-md overflow-hidden bg-gray-100">
                            <Image
                              width={1920}
                              height={1080}
                              src={activeFile.url}
                              alt={activeFile.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 mr-3 flex items-center justify-center bg-gray-100 rounded-md">
                            <FileIcon className="w-5 h-5 text-gray-500" />
                          </div>
                        )
                      })()}
                      <div className="flex-1 truncate">
                        <p className="font-medium text-sm truncate">
                          {getActiveFile()?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-1">
              {displayFiles.map((file) => (
                <RegularFile
                  key={file.url}
                  file={file}
                  onRemove={handleRemoveFile}
                  isImageFile={isImageFile}
                />
              ))}
            </div>
          </div>
        )}
        {organize && selectedFiles.length > 1 && (
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <GripVertical className="w-3 h-3 mr-1" />
            <span>Drag and drop to reorder files</span>
          </div>
        )}
      </div>

      {/* File selection modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Select Files
                {maxFiles > 0 && ` (${selectedFiles.length}/${maxFiles})`}
              </h3>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.name}
                      onClick={() => toggleFileSelection(file)}
                      className={`relative flex flex-col border rounded-lg overflow-hidden cursor-pointer transition-colors ${selectedFiles.includes(`${fileBaseUrl}${file.name}`)
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/30"
                        }`}
                    >
                      {/* Preview */}
                      <div className="h-20 bg-gray-100 flex items-center justify-center">
                        {isImageFile(file.name) ? (
                          <Image
                            width={1920}
                            height={1080}
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
                      {selectedFiles.includes(`${fileBaseUrl}${file.name}`) && (
                        <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-between">
              <div className="text-sm text-gray-500">
                {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""} selected
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}