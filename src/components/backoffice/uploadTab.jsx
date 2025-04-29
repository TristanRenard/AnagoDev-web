import { Trash2, UploadIcon, X } from "lucide-react"


const UploadTab = ({ files, t, inputRef, setFiles, handleUpload, isLoading, getFilePreview, handleFileChange, handleDelete, handleDrop }) => (
  <>
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
      className="flex flex-col border-dashed rounded-lg border-2 items-center justify-center border-purple-500 h-64 w-full cursor-pointer bg-purple-50 transition-colors hover:bg-purple-100"
    >
      <UploadIcon className="h-12 w-12 text-purple-500 mb-2" />
      <h1 className="text-2xl font-bold text-gray-800">
        {t("Upload Files")}
      </h1>
      <p className="text-gray-600 mt-2">
        <span className="underline text-purple-600 font-medium">
          {t("Select files")}
        </span>{" "}
        {t("or drag and drop here")}
      </p>
      <p className="text-gray-500 text-sm mt-1">
        {t("Any file type, up to 10MB per file")}
      </p>
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
            <h2 className="text-lg font-medium">
              {t("Files to Upload ({count})", { count: files.length })}
            </h2>
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
                  <div
                    className="truncate text-sm font-medium text-gray-800"
                    title={file.name}
                  >
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
          className={`flex items-center justify-center ${isLoading
            ? "bg-purple-400"
            : "bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800"
            } font-bold rounded-full py-4 px-16 text-white mt-6 self-center transition-all shadow-md hover:shadow-lg`}
        >
          {isLoading ? (
            <span>{t("Uploading...")}</span>
          ) : (
            <>
              <UploadIcon className="mr-2 h-5 w-5" />
              <span>
                {t("Upload {count} {file}", {
                  count: files.length,
                  file: files.length === 1 ? t("File") : t("Files"),
                })}
              </span>
            </>
          )}
        </button>
      </>
    )}
  </>
)

export default UploadTab