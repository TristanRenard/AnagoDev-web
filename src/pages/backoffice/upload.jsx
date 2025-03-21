import { useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { X, Link } from "lucide-react"
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
  const handleCopyImage = (index) => {
    const file = files[index]
    const reader = new FileReader()
    reader.onload = (event) => {
      navigator.clipboard.writeText(event.target.result)
      toast({
        title: "Success",
        description: "Image URL copied to clipboard",
        status: "success",
      })
    }
    reader.readAsDataURL(file)
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
        className="flex flex-col border-dashed rounded-lg border-2 mt-4 items-center justify-center border-[#A341F9] h-48 w-1/2 cursor-pointer bg-[#F6F6FB]"
      >
        <h1 className="text-2xl font-bold">Upload file</h1>
        <p>
          <span className="underline text-[#A341F9]">Select file</span> or drag
          and drop here
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
      <div className="flex gap-4 px-64 py-4 self-start w-full">
        {files.map((file, index) => (
          <div
            className="flex flex-col items-center p-2 gap-4 bg-gray-300 rounded-lg w-48 h-48"
            key={file.name}
          >
            <p>{file.name}</p>
            <div className="flex gap-1 mt-auto">
              <button onClick={() => handleCopyImage(index)} className="rounded-full p-1 bg-[#7AACEF]">
                <Link color="white" />
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="rounded-full bg-red-500 p-1 hover:bg-red-600"
              >
                <X color="white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Upload
