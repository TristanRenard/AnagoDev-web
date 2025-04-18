import { MultiFileSelector } from "@/components/form/MultipleSelectFile"
import BackofficeLayout from "@/components/layouts/BackofficeLayout"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/locales"
import authProps from "@/serverSideProps/authProps"
import { useEffect, useState } from "react"

const Homepage = () => {
    const t = useI18n()
    const [slides, setSlides] = useState([])
    const [editingIndex, setEditingIndex] = useState(null)
    const [mainCTA, setMainCTA] = useState("")
    const handleSubmit = async () => {
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-data": localStorage.getItem("userData")
                },
                body: JSON.stringify({ mainCTA, carrousel: { slides } })
            })

            if (!res.ok) {
                throw new Error("Failed to save settings")
            }
        } catch (err) {
            console.error("Error saving settings:", err)
        }
    }
    const [newProductImages, setNewProductImages] = useState([])

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
                    <h1 className="text-3xl font-black">{t("Homepage")}</h1>
                    {/* <div className="text-lg font-bold flex gap-4 w-full justify-between">
                        <UpdateHomepageSheet />
                    </div> */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold">{t("Carrousel Existing slides")}</h3>
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

export default Homepage

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
