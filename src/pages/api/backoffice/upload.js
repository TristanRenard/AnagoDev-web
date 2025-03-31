import * as Minio from "minio"
import fs from "fs"
import multiparty from "multiparty"

const minioClient = new Minio.Client({
  endPoint: process.env.DOMAIN,
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
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

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
      return res.status(400).json({ message: "No files uploaded" })
    }

    await Promise.all(
      files.file.map(async (file) => {
        const destinationObject = file.originalFilename || file.fieldName

        try {
          await minioClient.fPutObject(
            "anago-dev",
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

    return res.status(200).json({
      message: `${files.file.length} files uploaded successfully.`,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: `File upload failed: ${error.message}` })
  }
}

export default handler
