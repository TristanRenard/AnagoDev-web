import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useI18n } from "@/locales"
import { useState } from "react"

const UpdateHomepageSheet = () => {
    const t = useI18n()
    const [slides, setSlides] = useState([
        {
            titre: "Titre 1",
            text: "texte 1",
            img: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
            cta: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
            textCta: "Voir la photo",
        },
        {
            titre: "Titre 2",
            text: "texte 2",
            img: "https://tse2.mm.bing.net/th?id=OIP.1XSv8DcyMLXx8lYwXd6-1QHaEo&pid=Api",
            cta: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
            textCta: "Voir la photo",
        },
        {
            titre: "Titre 3",
            text: "texte 3",
            img: "https://tse3.mm.bing.net/th?id=OIP.lwwQeVivLFPnoCQ9PqDxpQHaEK&pid=Api",
            cta: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
            textCta: "Voir la photo",
        },
        {
            titre: "Titre 4",
            text: "texte 4",
            img: "https://tse1.mm.bing.net/th?id=OIP.9GmvSZuaFCbJ8_SyPbU8UQHaH4&pid=Api",
            cta: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
            textCta: "",
        },
        {
            titre: "Titre 5",
            text: "texte 5",
            img: "https://tse4.mm.bing.net/th?id=OIP.mq8WdKHatG6vLSWQYApkCwHaE-&pid=Api",
            cta: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
            textCta: "Voir la photo",
        },
    ])
    const [editingIndex, setEditingIndex] = useState(null)
    const handleSubmit = () => {
        console.log("Submit")
    }

    return (
        <Sheet>
            <SheetTrigger>
                <Button>
                    {t("Update homepage")}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-3/4 sm:max-w-full">
                <SheetHeader>
                    <SheetTitle>{t("Update homepage")}</SheetTitle>
                    <SheetDescription>
                        {t("Update homepage content")}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">{t("Carrousel Existing slides")}</h3>
                    <table className="table-auto w-full border rounded">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">{t("Title")}</th>
                                <th className="p-2 border">{t("Text")}</th>
                                <th className="p-2 border">{t("CTA")}</th>
                                <th className="p-2 border">{t("CTA Text")}</th>
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
                                            <td className="p-2 flex gap-2">
                                                <Button size="sm" onClick={() => setEditingIndex(null)}>{t("Save")}</Button>
                                                <Button size="sm" variant="secondary" onClick={() => setEditingIndex(null)}>{t("Cancel")}</Button>
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
                                            <td className="p-2 flex gap-2 justify-center h-full">
                                                <Button size="sm" onClick={() => setEditingIndex(index)}>{t("Edit")}</Button>
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

                <SheetFooter className="flex">
                    <SheetClose asChild >
                        <Button className="w-full" onClick={handleSubmit}>{t("Sauvegarder les changements")}</Button>
                    </SheetClose>
                    <SheetClose asChild >
                        <Button className="w-full" variant="secondary">{t("Close")}</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default UpdateHomepageSheet