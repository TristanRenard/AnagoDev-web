import { MultiFileSelector } from "@/components/form/MultipleSelectFile"
import BackofficeLayout from "@/components/layouts/BackofficeLayout"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/locales"
import authProps from "@/serverSideProps/authProps"
import { useEffect, useState } from "react"

const Settings = () => {
    const t = useI18n()
    const [slides, setSlides] = useState([])
    const [editingIndex, setEditingIndex] = useState(null)
    const [mainCTA, setMainCTA] = useState("")
    const [mainCTAText, setMainCtaText] = useState("")
    const [roleAllowed, setRoleAllowed] = useState("user")
    const [chatbotModel, setChatbotModel] = useState("gpt-3.5-turbo")
    const [newProductImages, setNewProductImages] = useState([])
    const [availableModels, setAvailableModels] = useState([])
    const [saveMessage, setSaveMessage] = useState("")
    const handleSubmit = async () => {
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-data": localStorage.getItem("userData")
                },
                body: JSON.stringify({
                    mainCTA,
                    carrousel: { slides },
                    RoleAllowedChatbot: roleAllowed,
                    modelChatbot: chatbotModel,
                    mainCTAText
                })
            })

            if (!res.ok) {
                throw new Error("Failed to save settings")
            }

            setSaveMessage("✅ Sauvegarde réussie !")
            setTimeout(() => setSaveMessage(""), 3000)
        } catch (err) {
            console.error("Error saving settings:", err)
            setSaveMessage("❌ Erreur lors de la sauvegarde.")
            setTimeout(() => setSaveMessage(""), 3000)
        }
    }

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings")

                if (!res.ok) {
                    throw new Error("Failed to fetch settings")
                }

                const data = await res.json()

                setMainCTA(data.mainCTA || "")
                setSlides(data.carrousel?.slides || [])
                setRoleAllowed(data.RoleAllowedChatbot || "user")
                setChatbotModel(data.modelChatbot || "gpt-3.5-turbo")

                const modelsRes = await fetch("/api/backoffice/models")

                if (modelsRes.ok) {
                    const modelsData = await modelsRes.json()
                    setAvailableModels(modelsData.data)
                }
            } catch (err) {
                console.error("Erreur lors du chargement des paramètres :", err)
            }
        }

        fetchSettings()
    }, [])

    return (
        <BackofficeLayout>
            <div className="flex-1 flex flex-col h-full relative">
                <div className="flex flex-col items-start gap-5 m-4 py-8 px-4">
                    <h1 className="text-3xl font-black">{t("Settings")}</h1>
                    {saveMessage && (
                        <div className="text-sm text-green-600 font-medium">
                            {saveMessage}
                        </div>
                    )}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-2xl font-bold">{t("Chatbot")}</h2>
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium">{t("Allowed Role for Chatbot")}</span>
                            <select value={roleAllowed} onChange={(e) => setRoleAllowed(e.target.value)} className="border px-3 py-2 rounded">
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                                <option value="superadmin">superadmin</option>
                            </select>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium">{t("Chatbot Model")}</span>
                            <select
                                value={chatbotModel}
                                onChange={(e) => setChatbotModel(e.target.value)}
                                className="border px-3 py-2 rounded"
                            >
                                {availableModels.map((model) => (
                                    <option key={model.id} value={model.id}>
                                        {model.display_name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <h2 className="text-2xl font-bold">{t("Homepage")}</h2>
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium">{t("Main CTA Link")}</span>
                            <input
                                type="text"
                                className="input w-full border px-3 py-2 rounded"
                                value={mainCTA}
                                onChange={(e) => setMainCTA(e.target.value)}
                                placeholder="https://example.com"
                            />
                        </label>
                        <input
                            type="text"
                            value={mainCTAText}
                            onChange={(e) => setMainCtaText(e.target.value)}
                            className="mt-2 p-2 border border-gray-300 rounded"
                            placeholder="Enter the text for the CTA"
                        />

                        <table className="table-auto w-full border rounded">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 border">{t("Title")}</th>
                                    <th className="p-2 border">{t("Text")}</th>
                                    <th className="p-2 border">{t("CTA")}</th>
                                    <th className="p-2 border">{t("CTA Text")}</th>
                                    <th className="p-2 border">{t("Image")}</th>
                                    <th className="p-2 border">{t("Actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {slides.map((slide, index) => (
                                    <tr key={index} className={editingIndex === index ? "bg-gray-50" : ""}>
                                        {editingIndex === index ? (
                                            <>
                                                <td className="p-2 border">
                                                    <input
                                                        className="w-full"
                                                        value={slide.titre}
                                                        onChange={(e) => {
                                                            const newSlides = [...slides]
                                                            newSlides[index].titre = e.target.value
                                                            setSlides(newSlides)
                                                        }}
                                                    />
                                                </td>
                                                <td className="p-2 border">
                                                    <input
                                                        className="w-full"
                                                        value={slide.text}
                                                        onChange={(e) => {
                                                            const newSlides = [...slides]
                                                            newSlides[index].text = e.target.value
                                                            setSlides(newSlides)
                                                        }}
                                                    />
                                                </td>
                                                <td className="p-2 border">
                                                    <input
                                                        className="w-full"
                                                        value={slide.cta}
                                                        onChange={(e) => {
                                                            const newSlides = [...slides]
                                                            newSlides[index].cta = e.target.value
                                                            setSlides(newSlides)
                                                        }}
                                                    />
                                                </td>
                                                <td className="p-2 border">
                                                    <input
                                                        className="w-full"
                                                        value={slide.textCta}
                                                        onChange={(e) => {
                                                            const newSlides = [...slides]
                                                            newSlides[index].textCta = e.target.value
                                                            setSlides(newSlides)
                                                        }}
                                                    />
                                                </td>
                                                <td className="p-2 border">
                                                    <MultiFileSelector selectedFiles={newProductImages} setSelectedFiles={setNewProductImages} organize />
                                                </td>
                                                <td className="p-2 flex gap-2">
                                                    <Button size="sm" onClick={() => {
                                                        setEditingIndex(null)
                                                        const newSlides = [...slides]
                                                        newSlides[index].img = newProductImages
                                                        setSlides(newSlides)
                                                        setNewProductImages([])
                                                    }}>{t("Save")}</Button>
                                                    <Button size="sm" variant="secondary" onClick={() => {
                                                        setEditingIndex(null)
                                                        setNewProductImages([])
                                                    }}>{t("Cancel")}</Button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-2 border">{slide.titre}</td>
                                                <td className="p-2 border">{slide.text}</td>
                                                <td
                                                    className="p-2 border max-w-[14rem] truncate"
                                                    title={slide.cta}
                                                >
                                                    {slide.cta}
                                                </td>
                                                <td className="p-2 border">{slide.textCta}</td>
                                                <td className="p-2 border">{slide.img}</td>
                                                <td className="p-2 flex gap-2 justify-center h-full">
                                                    <Button size="sm" onClick={() => {
                                                        setEditingIndex(index)
                                                        setNewProductImages(slide.img.length > 0 ? slide.img : [])
                                                    }}>{t("Edit")}</Button>
                                                    <Button size="sm" variant="destructive" onClick={() => {
                                                        const newSlides = slides.filter((_, i) => i !== index)
                                                        setSlides(newSlides)
                                                    }}>{t("Delete")}</Button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Button className="self-start my-4" onClick={() => {
                            const newSlide = {
                                titre: "",
                                text: "",
                                img: "",
                                cta: "",
                                textCta: "",
                            }
                            const updatedSlides = [...slides, newSlide]
                            setSlides(updatedSlides)
                            setEditingIndex(updatedSlides.length - 1)
                        }}>{t("Add new slide")}</Button>
                    </div>
                    <Button className="" onClick={handleSubmit}>{t("Sauvegarder les changements")}</Button>
                </div>

            </div>
        </BackofficeLayout>
    )
}

export default Settings

export const getServerSideProps = async (context) => {
    const { user } = await authProps(context)

    if (!user || !user.role || user.role !== "admin") {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            user,
        },
    }
}
