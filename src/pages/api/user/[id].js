import User from "@/db/models/User"
import knexInstance from "@/lib/db"

const handler = async (req, res) => {
  console.log(`Requête reçue - Méthode: ${req.method}`)

  try {
    const { method } = req
    const bearer = req.headers.authorization

    if (!bearer) {
      console.log("Erreur: Header d'autorisation manquant")


      return res.status(401).json({ message: "Unauthorized" })
    }

    const token = bearer.split(" ")

    if (!token[1] || token[1] !== process.env.API_KEY) {
      console.log("Erreur: Token invalide")


      return res.status(401).json({ message: "Unauthorized" })
    }

    if (method === "GET") {
      const { id } = req.query
      console.log(`Recherche utilisateur avec ID: ${id}`)

      try {
        const user = await User.query(knexInstance).findOne({
          id
        })

        if (!user) {
          console.log(`Utilisateur non trouvé pour ID: ${id}`)


          return res.status(404).json({ message: "User not found" })
        }

        delete user.password
        console.log("Utilisateur trouvé et renvoyé")


        return res.status(200).json({ user })
      } catch (dbError) {
        console.error("Erreur lors de la requête DB:", dbError)


        return res.status(500).json({ message: "Database error" })
      }
    }

    console.log(`Méthode non autorisée: ${method}`)


    return res.status(405).json({ message: "Method Not Allowed" })
  } catch (error) {
    console.error("Erreur non gérée:", error)


    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export default handler