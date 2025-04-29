// File: pages/api/backoffice/files/[filename].js
import * as Minio from "minio"

// Initialize MinIO client
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_HOST,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
})

export const config = {
  api: {
    // Disable Next.js body parsing - important for streaming binary files
    bodyParser: false,
    // Disable response transformation
    externalResolver: true,
  },
}
// eslint-disable-next-line consistent-return
const handler = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  // Handle OPTIONS request (CORS preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  // Extract filename from query parameters
  const filename = req.query.filename.join("/")

  if (!filename) {
    return res.status(400).json({ message: "Filename is required" })
  }

  try {
    // Get object metadata to check if it exists and get content type
    const stat = await minioClient.statObject("anago-dev", filename)

    // Determine content type
    let contentType = "application/octet-stream"

    // Check if content type is stored in metadata
    if (stat.metaData && stat.metaData["content-type"]) {
      contentType = stat.metaData["content-type"]
    } else {
      // Try to infer content type from file extension
      const extension = filename.split(".").pop().toLowerCase()
      const contentTypeMap = {
        // Images
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif",
        "svg": "image/svg+xml",
        "webp": "image/webp",
        "bmp": "image/bmp",
        "ico": "image/x-icon",

        // Documents
        "pdf": "application/pdf",
        "doc": "application/msword",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "xls": "application/vnd.ms-excel",
        "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "ppt": "application/vnd.ms-powerpoint",
        "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",

        // Text
        "txt": "text/plain",
        "csv": "text/csv",
        "md": "text/markdown",

        // Web
        "html": "text/html",
        "css": "text/css",
        "js": "text/javascript",
        "json": "application/json",
        "xml": "application/xml",

        // Archives
        "zip": "application/zip",
        "rar": "application/x-rar-compressed",
        "tar": "application/x-tar",
        "gz": "application/gzip",

        // Audio
        "mp3": "audio/mpeg",
        "wav": "audio/wav",
        "ogg": "audio/ogg",

        // Video
        "mp4": "video/mp4",
        "webm": "video/webm",
        "avi": "video/x-msvideo",
        "mov": "video/quicktime",
      }

      if (contentTypeMap[extension]) {
        contentType = contentTypeMap[extension]
      }
    }

    // Set cache control headers to prevent unnecessary API calls
    res.setHeader("Cache-Control", "public, max-age=86400")
    res.setHeader("Content-Type", contentType)

    // Set content disposition based on query parameter
    if (req.query.download === "true") {
      // Force download
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`)
    } else {
      // Try to display in browser if possible
      res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(filename)}"`)
    }

    // Get and stream the file
    const fileStream = await minioClient.getObject("anago-dev", filename)

    // Handle streaming data
    fileStream.on("data", (chunk) => {
      res.write(chunk)
    })

    // End the response when streaming is done
    fileStream.on("end", () => {
      res.end()
    })

    // Handle streaming errors
    fileStream.on("error", (err) => {
      console.error("Error streaming file:", err)

      // Only send error response if headers haven't been sent yet
      if (!res.headersSent) {
        res.status(500).json({ message: `Error streaming file: ${err.message}` })
      } else {
        // If headers are already sent, just end the response
        res.end()
      }
    })
  } catch (error) {
    console.error("Error retrieving file:", error)

    // Handle specific errors
    if (error.code === "NoSuchKey" || error.code === "NoSuchBucket") {
      return res.status(404).json({ message: "File not found" })
    }

    // Handle general errors
    res.status(500).json({
      message: `Failed to retrieve file: ${error.message}`,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined
    })
  }
}

export default handler