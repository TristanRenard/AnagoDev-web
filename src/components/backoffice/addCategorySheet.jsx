import { MultiFileSelector } from "@/components/form/MultipleSelectFile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/locales"
import axios from "axios"
import { useEffect, useState } from "react"

const AddCategorySheet = ({ categories = [], queryClient }) => {
  const t = useI18n()
  const { toast } = useToast()
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  const [newCategoryImages, setNewCategoryImages] = useState([])
  const [newCategoryOrder, setNewCategoryOrder] = useState(0)
  const handleSubmit = () => {
    const payload = {
      name: newCategoryName,
      description: newCategoryDescription,
      images: newCategoryImages,
      order: newCategoryOrder,
    }

    if (!newCategoryName || !newCategoryDescription || !newCategoryImages || !newCategoryOrder) {
      return toast({
        title: t("Error"),
        description: t("Please fill all the fields"),
        variant: "destructive",
      })
    }

    try {
      axios.post("/api/categories", payload).then((response) => {
        if (response.status === 201) {
          toast({
            title: t("Success"),
            description: t("Category created successfully"),
          })
          queryClient.invalidateQueries(["categories"])
          setNewCategoryName("")
          setNewCategoryDescription("")
          setNewCategoryImages([])
        } else {
          toast({
            title: t("Error"),
            description: t("Error creating category"),
            variant: "destructive",
          })
        }
      }
      ).catch((error) => {
        toast({
          title: t("Error"),
          description: error.response?.data?.message || t("Error creating category"),
          variant: "destructive",
        })
      })
    }
    catch (error) {
      toast({
        title: t("Error"),
        description: error.message || t("Error creating category"),
        variant: "destructive",
      })
    }

    return null
  }


  useEffect(() => {
    const maxOrder = categories.reduce((max, category) => Math.max(max, category.order), 0)
    setNewCategoryOrder(maxOrder + 1)
  }, [categories])

  return (
    <Sheet>
      <SheetTrigger>
        <Button>
          {t("Add Category")}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-3/4 sm:max-w-full">
        <SheetHeader>
          <SheetTitle>{t("Add category")}</SheetTitle>
          <SheetDescription>
            {t("Add a new category to the store")}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 items-center gap-4 h-fit">
            <Label htmlFor="name" className="text-right col-span-1">
              {t("Category name")}
            </Label>
            <Input
              className="col-span-3"
              id="name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-5 items-center gap-4 h-fit">
            <Label htmlFor="description" className="text-right col-span-1">
              {t("Category description")}
            </Label>
            <Input
              className="col-span-3"
              id="description"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
            />
          </div>
          <MultiFileSelector selectedFiles={newCategoryImages} setSelectedFiles={setNewCategoryImages} organize />
          <p>
            {newCategoryOrder}
          </p>
        </div>
        <SheetFooter className="flex">
          <SheetClose asChild >
            <Button className="w-full" onClick={handleSubmit}>{t("Add product")}</Button>
          </SheetClose>
          <SheetClose asChild >
            <Button className="w-full" variant="secondary">{t("Close")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default AddCategorySheet