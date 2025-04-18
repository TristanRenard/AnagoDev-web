import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useI18n } from "@/locales"

const UpdateHomepageSheet = () => {
    const t = useI18n()
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
                    <p>{t("Homepage content")}</p>
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