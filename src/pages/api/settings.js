import Settings from "@/db/models/Settings"
import knexInstance from "@/lib/db"

const handler = async (req, res) => {
    const { "x-user-data": userData } = req.headers
    const user = JSON.parse(userData || "{}")
    const isAdmin = user?.role === "admin"

    if (req.method === "GET") {
        let settings = await Settings.query(knexInstance).findById(1)

        // eslint-disable-next-line logical-assignment-operators
        if (!settings) {
            settings = await Settings.query(knexInstance).insert({
                id: 1,
                mainCTA: "",
                carrousel: { slides: [] },
                RoleAllowedChatbot: "user",
                modelChatbot: "gpt-3.5-turbo"
            })
        }

        return res.status(200).json(settings)
    }

    if (req.method === "PUT") {
        if (!isAdmin) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const { carrousel, mainCTA, RoleAllowedChatbot, modelChatbot, mainCTAText } = req.body

        if (!carrousel || !carrousel.slides || !Array.isArray(carrousel.slides)) {
            return res.status(400).json({ message: "Missing or invalid carrousel" })
        }

        try {
            const existing = await Settings.query(knexInstance).findById(1)

            // eslint-disable-next-line init-declarations
            let updated

            if (existing) {
                updated = await Settings.query(knexInstance)
                    .patchAndFetchById(1, {
                        carrousel,
                        mainCTA,
                        RoleAllowedChatbot,
                        modelChatbot,
                        mainCTAText
                    })
            } else {
                updated = await Settings.query(knexInstance)
                    .insert({
                        id: 1,
                        carrousel,
                        mainCTA,
                        RoleAllowedChatbot,
                        modelChatbot,
                        mainCTAText
                    })
            }

            return res.status(200).json(updated)
        } catch (error) {
            return res.status(500).json({
                message: "Failed to update settings",
                error: error.message,
            })
        }
    }

    return res.status(405).end(`Method ${req.method} Not Allowed`)
}

export default handler