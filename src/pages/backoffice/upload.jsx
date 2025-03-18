import { useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import axios from "axios"

const Upload = () => {
  const { toast } = useToast()
  const [files, setFiles] = useState([])
  const inputRef = useRef(null)
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
      return
    }

    const formData = new FormData()
    files.forEach((file) => {
      formData.append("file", file)
    })

    try {
      await axios.post("http://localhost:3000/api/backoffice/upload", formData)
      toast({
        title: "Success",
        description: files.length === 1 ? "File uploaded" : "Files uploaded",
        status: "success",
      })
      setFiles([])
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
      })
    }
  }
  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  return (
    <div className="flex-1 flex flex-col items-center">
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className="flex flex-col border-dashed rounded-lg border-2 mt-4 items-center justify-center border-black h-32 w-1/2 cursor-pointer hover:bg-indigo-200 bg-indigo-300"
      >
        <h1>Upload file</h1>
        <p>
          <span className="underline">Select file</span> or drag and drop here
        </p>
        <input
          type="file"
          multiple
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <button
        onClick={handleUpload}
        className="bg-gradient-to-r from-[#420A8F] to-[#240198] font-bold rounded-full py-4 px-16 text-white mt-4"
      >
        Upload
      </button>
      {files.map((file, index) => (
        <div className="flex items-center p-2  gap-4" key={file.name}>
          <p>{file.name}</p>
          <button
            onClick={() => handleDelete(index)}
            className="rounded-lg bg-red-500 p-2 hover:bg-red-600"
          >
            <X color="white" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Upload
