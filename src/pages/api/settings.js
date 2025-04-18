import Settings from "@/db/models/Settings"
import knexInstance from "@/lib/db"

const handler = async (req, res) => {
    const { "x-user-data": userData } = req.headers
    const user = JSON.parse(userData || "{}")
    const isAdmin = user?.role === "admin"

    if (req.method === "GET") {
        const settings = await Settings.query(knexInstance).findById(1)

        if (!settings) {
            return res.status(404).json({ message: "Settings not found" })
        }

        return res.status(200).json(settings)
    }

    if (req.method === "PUT") {
        if (!isAdmin) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const { carrousel, mainCTA } = req.body

        if (!carrousel || !carrousel.slides || !Array.isArray(carrousel.slides)) {
            return res.status(400).json({ message: "Missing or invalid carrousel" })
        }

        try {
            const existing = await Settings.query(knexInstance).findById(1)

            // eslint-disable-next-line init-declarations
            let updated

            if (existing) {
                updated = await Settings.query(knexInstance)
                    .patchAndFetchById(1, { carrousel, mainCTA })
            } else {
                updated = await Settings.query(knexInstance)
                    .insert({
                        id: 1,
                        carrousel,
                        mainCTA
                    })
            }

            return res.status(200).json(updated)
        } catch (error) {
            console.log("error", error)

            return res.status(500).json({
                message: "Failed to update settings",
                error: error.message,
            })
        }
    }

    return res.status(405).end(`Method ${req.method} Not Allowed`)
}

export default handler