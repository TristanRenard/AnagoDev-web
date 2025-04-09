import * as Minio from "minio"
import fs from "fs"
import multiparty from "multiparty"

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_HOST,
  port: parseInt(process.env.MINIO_PORT, 10),
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
})

export const config = {
  api: {
    bodyParser: false,
  },
}
const handler = async (req, res) => {
  if (req.method === "GET") {
    const files = await minioClient.listObjectsV2("anago-dev", "", true)
    const fileList = []
    files.on("data", (obj) => {
      fileList.push(obj)
    })
    files.on("end", () => {
      res.status(200).json(fileList)
    })
    files.on("error", (err) => {
      console.error(err)
      res.status(500).json({ message: `Error listing files: ${err.message}` })
    })

    return
  }

  if (req.method === "POST") {
    const form = new multiparty.Form()

    try {
      const parsedData = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            reject(err)
          } else {
            resolve({ fields, files })
          }
        })
      })
      const { files } = parsedData

      if (!files || !files.file) {
        res.status(400).json({ message: "No files uploaded" })
      }

      await Promise.all(
        files.file.map(async (file) => {
          const destinationObject = file.originalFilename || file.fieldName

          try {
            await minioClient.fPutObject(
              process.env.MINIO_BUCKET,
              destinationObject,
              file.path,
            )
            await fs.promises.unlink(file.path)
          } catch (error) {
            throw new Error(
              `Failed to upload ${destinationObject}: ${error.message}`,
            )
          }
        }),
      )

      res.status(200).json({
        message: `${files.file.length} files uploaded successfully.`,
      })
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ message: `File upload failed: ${error.message}` })
    }
  }

  res.status(405).json({ message: "Method Not Allowed" })
}

export default handler
