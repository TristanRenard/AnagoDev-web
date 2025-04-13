/* eslint-disable max-lines-per-function */

import { MultiFileSelector } from "@/components/form/MultipleSelectFile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/locales"
import axios from "axios"
import dynamic from "next/dynamic"
import { useState } from "react"

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })
const AddProductSheet = ({ queryClient, categories }) => {
  const t = useI18n()
  const { toast } = useToast()
  const [newProductName, setNewProductName] = useState("")
  const [newProductDescription, setNewProductDescription] = useState("")
  const [newProductImages, setNewProductImages] = useState([])
  const [newProductIsSubscription, setNewProductIsSubscription] = useState(true)
  const [newProductMonthlyPrice, setNewProductMonthlyPrice] = useState(0)
  const [newProductYearlyPrice, setNewProductYearlyPrice] = useState(0)
  const [newProductPrice, setNewProductPrice] = useState(0)
  const [newCategoryId, setCategoryId] = useState(null)
  const [newProducrStock, setNewProductStock] = useState("")
  const [newProductIsTopProduct, setNewProductIsTopProduct] = useState(false)
  const handleSubmit = async () => {
    const payload = {
      name: newProductName,
      description: newProductDescription,
      images: newProductImages,
      isSubscription: newProductIsSubscription,
      categoryId: newCategoryId,
      stock: newProducrStock === "" ? -1 : Number(newProducrStock),
    }

    if (newProductIsSubscription) {
      payload.prices = [
        {
          "unit_amount": newProductMonthlyPrice * 100,
          "currency": "eur",
          "nickname": "monthly",
          "recurring": {
            "interval": "month",
            "interval_count": 1,
            "trial_period_days": 0,
            "usage_type": "licensed"
          }
        },
        {
          "unit_amount": newProductYearlyPrice * 100,
          "currency": "eur",
          "nickname": "yearly",
          "recurring": {
            "interval": "year",
            "interval_count": 1,
            "trial_period_days": 0,
            "usage_type": "licensed"
          }
        }
      ]
    } else {
      payload.prices = [{
        "unit_amount": newProductPrice * 100,
        "currency": "eur",
      }]
    }

    try {
      const res = await axios.post("/api/products", payload)
      queryClient.invalidateQueries("products")

      if (res.status === 200) {
        toast({
          title: t("Product added"),
          description: t("The product has been added successfully"),
          variant: "default",
        })

        setNewProductName("")
        setNewProductDescription("")
        setNewProductImages([])
        setNewProductIsSubscription(true)
        setNewProductMonthlyPrice(0)
        setNewProductYearlyPrice(0)
        setNewProductPrice(0)
        setCategoryId(null)
        setNewProductStock("")
        setNewProductIsTopProduct(false)
      } else {
        toast({
          title: t("Error"),
          description: t("An error occurred while adding the product"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: t("Error"),
        description: t("An error occurred while adding the product"),
        variant: "destructive",
      })
    }
  }

  return (
    <Sheet >
      <SheetTrigger>
        <Button>{t("Add product")}</Button>
      </SheetTrigger>
      <SheetContent className="w-3/4 sm:max-w-full">
        <SheetHeader>
          <SheetTitle>{t("Add product")}</SheetTitle>
          <SheetDescription>
            {t("Add a new product to the store")}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-5 items-center gap-4 h-fit">
            <Label htmlFor="name" className="text-right col-span-1">
              {t("Product name")}
            </Label>
            <Input
              className="col-span-3"
              id="name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-10 items-center gap-4 h-fit">
            <Label htmlFor="image" className="text-right col-span-2">
              {t("Is a subscription?")}
            </Label>
            <Switch
              className="col-span-3"
              id="subscription"
              checked={newProductIsSubscription}
              onCheckedChange={(e) => setNewProductIsSubscription(e)}
            />
            <Label htmlFor="topProduct" className="text-right col-span-2">
              {t("Is a top product?")}
            </Label>
            <Switch
              className="col-span-3"
              id="topProduct"
              checked={newProductIsTopProduct}
              onCheckedChange={(e) => setNewProductIsTopProduct(e)}
            />
          </div>

          {newProductIsSubscription ? (
            <>
              <div className="grid grid-cols-5 items-center gap-4 h-fit">
                <Label htmlFor="monthly-price" className="text-right col-span-1">
                  {t("Monthly price")}
                </Label>
                <Input
                  className="col-span-3"
                  id="monthly-price"
                  type="number"
                  value={newProductMonthlyPrice}
                  onChange={(e) => setNewProductMonthlyPrice(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-5 items-center gap-4 h-fit">
                <Label htmlFor="yearly-price" className="text-right col-span-1">
                  {t("Yearly price")}
                </Label>
                <Input
                  className="col-span-3"
                  id="yearly-price"
                  type="number"
                  value={newProductYearlyPrice}
                  onChange={(e) => setNewProductYearlyPrice(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-5 items-center gap-4 h-fit">
              <Label htmlFor="price" className="text-right col-span-1">
                {t("Product price")}
              </Label>
              <Input
                className="col-span-3"
                id="price"
                type="number"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
              />
            </div>
          )}
          <div className="grid grid-cols-5 items-start gap-4 h-fit">
            <Label htmlFor="category" className="text-right col-span-1">
              {t("Category")}
            </Label>
            <Select onValueChange={(value) => setCategoryId(value)}>
              <SelectTrigger className="w-full col-span-3">
                <SelectValue placeholder={t("Select a category")} />
              </SelectTrigger>
              <SelectContent>
                {categories?.data.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {t(category.title)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-5 items-start gap-4 h-fit">
            <Label htmlFor="description" className="text-right col-span-1 pt-2">
              {t("Product description")}
            </Label>
            <div className="col-span-3 max-h-80 h-full" data-color-mode="light">
              <Editor
                id="description"
                markdown={newProductDescription}
                onChange={(e) => {
                  setNewProductDescription(e)
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 items-center gap-4 h-fit">
            <Label htmlFor="image" className="text-right col-span-1">
              {t("Product image URL")}
            </Label>
            <div className="col-span-3">
              <MultiFileSelector selectedFiles={newProductImages} setSelectedFiles={setNewProductImages} organize />
            </div>
          </div>
          <div className="grid grid-cols-6 items-center gap-4 h-fit">
            <Label htmlFor="stock" className="text-right col-span-1">
              {t("Product stock")} {t("(leave empty for infinite stock)")}
            </Label>
            <Input
              className="col-span-2"
              id="stock"
              type="number"
              value={newProducrStock}
              onChange={(e) => setNewProductStock(e.target.value)}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleSubmit}>{t("Add product")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default AddProductSheet