/* eslint-disable max-lines-per-function */

import { SingleFileSelector } from "@/components/form/selectFile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/locales"
import axios from "axios"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil } from "lucide-react"

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })
const EditProductSheet = ({ product, queryClient, categories }) => {
  const t = useI18n()
  const { toast } = useToast()
  const [productName, setProductName] = useState("")
  const [productDescription, setProductDescription] = useState("")
  // eslint-disable-next-line no-unused-vars
  const [productImages, setProductImages] = useState([])
  const [productImage, setProductImage] = useState("")
  const [productIsSubscription, setProductIsSubscription] = useState(true)
  const [productMonthlyPrice, setProductMonthlyPrice] = useState(0)
  const [productYearlyPrice, setProductYearlyPrice] = useState(0)
  const [productPrice, setProductPrice] = useState(0)
  const [categoryId, setCategoryId] = useState(null)
  const [productDuties, setProductDuties] = useState(0)
  const [productStock, setProductStock] = useState("")
  const [productIsTopProduct, setProductIsTopProduct] = useState(false)
  const [productIsActive, setProductIsActive] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  // Initialize form with product data when it's loaded or changed
  useEffect(() => {
    if (product && isOpen) {
      setProductName(product.title || "")
      setProductDescription(product.description || "")

      // Parse images if stored as JSON string
      const images = typeof product.images === "string" ? JSON.parse(product.images) : product.images || []
      setProductImages(images)
      setProductImage(images[0] || "")

      setProductIsSubscription(Boolean(product.isSubscription))
      setProductIsActive(Boolean(product.isActive))
      setProductIsTopProduct(Boolean(product.isTopProduct))
      setCategoryId(product.categoryId || null)
      setProductDuties(product.duties || 0)

      // Handle infinite stock (-1)
      setProductStock(product.stock === -1 ? "" : product.stock)

      // Initialize prices
      if (product.prices && product.prices.length > 0) {
        if (product.isSubscription) {
          // Find monthly and yearly prices
          const monthlyPrice = product.prices.find(p => p.nickname === "monthly")
          const yearlyPrice = product.prices.find(p => p.nickname === "yearly")

          setProductMonthlyPrice(monthlyPrice ? monthlyPrice.unit_amount / 100 : 0)
          setProductYearlyPrice(yearlyPrice ? yearlyPrice.unit_amount / 100 : 0)
        } else {
          // For non-subscription products, use the first price
          setProductPrice(product.prices[0]?.unit_amount ? product.prices[0].unit_amount / 100 : 0)
        }
      }
    }
  }, [product, isOpen])

  const handleSubmit = async () => {
    // Prepare price updates
    const updatedPrices = []

    if (productIsSubscription) {
      // Find existing prices to update if they exist
      const existingMonthly = product.prices?.find(p => p.nickname === "monthly")
      const existingYearly = product.prices?.find(p => p.nickname === "yearly")

      // Monthly price
      if (existingMonthly) {
        updatedPrices.push({
          id: existingMonthly.id,
          "unit_amount": productMonthlyPrice * 100,
          currency: "eur",
          nickname: "monthly",
          recurring: {
            interval: "month",
            "interval_count": 1,
            "trial_period_days": 0,
            "usage_type": "licensed"
          }
        })
      } else {
        // Add new monthly price
        updatedPrices.push({
          "unit_amount": productMonthlyPrice * 100,
          currency: "eur",
          nickname: "monthly",
          recurring: {
            interval: "month",
            "interval_count": 1,
            "trial_period_days": 0,
            "usage_type": "licensed"
          }
        })
      }

      // Yearly price
      if (existingYearly) {
        updatedPrices.push({
          id: existingYearly.id,
          "unit_amount": productYearlyPrice * 100,
          currency: "eur",
          nickname: "yearly",
          recurring: {
            interval: "year",
            "interval_count": 1,
            "trial_period_days": 0,
            "usage_type": "licensed"
          }
        })
      } else {
        // Add new yearly price
        updatedPrices.push({
          "unit_amount": productYearlyPrice * 100,
          currency: "eur",
          nickname: "yearly",
          recurring: {
            interval: "year",
            "interval_count": 1,
            "trial_period_days": 0,
            "usage_type": "licensed"
          }
        })
      }
    } else {
      // For non-subscription products
      const existingPrice = product.prices?.[0]

      if (existingPrice) {
        updatedPrices.push({
          id: existingPrice.id,
          "unit_amount": productPrice * 100,
          currency: "eur"
        })
      } else {
        updatedPrices.push({
          "unit_amount": productPrice * 100,
          currency: "eur"
        })
      }
    }

    // Prepare update payload
    const payload = {
      name: productName,
      description: productDescription,
      images: productImage ? [productImage] : [],
      isSubscription: productIsSubscription,
      categoryId,
      duties: Number(productDuties),
      stock: productStock === "" ? -1 : Number(productStock),
      isActive: productIsActive,
      isTopProduct: productIsTopProduct,
      prices: updatedPrices
    }

    try {
      const res = await axios.patch(`/api/products?id=${product.id}`, payload)
      queryClient.invalidateQueries("products")

      if (res.status === 200) {
        toast({
          title: t("Product updated"),
          description: t("The product has been updated successfully"),
          variant: "default",
        })
        setIsOpen(false)
      } else {
        toast({
          title: t("Error"),
          description: t("An error occurred while updating the product"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("Error"),
        description: error.response?.data?.error || t("An error occurred while updating the product"),
        variant: "destructive",
      })
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="text-blue-500 cursor-pointer underline flex justify-center items-center gap-1">
          {t("Edit")} <Pencil className="h-3 w-3" />
        </button>
      </SheetTrigger>
      <SheetContent className="w-3/4 sm:max-w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("Edit product")}</SheetTitle>
          <SheetDescription>
            {t("Update product information")}
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
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-10 items-center gap-4 h-fit">
            <Label htmlFor="subscription" className="text-right col-span-2">
              {t("Is a subscription?")}
            </Label>
            <Switch
              className="col-span-1"
              id="subscription"
              checked={productIsSubscription}
              onCheckedChange={(e) => setProductIsSubscription(e)}
            />

            <Label htmlFor="topProduct" className="text-right col-span-2">
              {t("Is a top product?")}
            </Label>
            <Switch
              className="col-span-1"
              id="topProduct"
              checked={productIsTopProduct}
              onCheckedChange={(e) => setProductIsTopProduct(e)}
            />

            <Label htmlFor="isActive" className="text-right col-span-2">
              {t("Is active?")}
            </Label>
            <Switch
              className="col-span-1"
              id="isActive"
              checked={productIsActive}
              onCheckedChange={(e) => setProductIsActive(e)}
            />
          </div>

          {productIsSubscription ? (
            <>
              <div className="grid grid-cols-5 items-center gap-4 h-fit">
                <Label htmlFor="monthly-price" className="text-right col-span-1">
                  {t("Monthly price")}
                </Label>
                <Input
                  className="col-span-3"
                  id="monthly-price"
                  type="number"
                  value={productMonthlyPrice}
                  onChange={(e) => setProductMonthlyPrice(e.target.value)}
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
                  value={productYearlyPrice}
                  onChange={(e) => setProductYearlyPrice(e.target.value)}
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
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>
          )}
          <div className="grid grid-cols-5 items-start gap-4 h-fit">
            <Label htmlFor="category" className="text-right col-span-1">
              {t("Category")}
            </Label>
            <Select value={categoryId} onValueChange={(value) => setCategoryId(value)} defaultValue={categoryId?.toString()}>
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
            <div className="col-span-3" data-color-mode="light">
              <Editor
                id="description"
                markdown={productDescription}
                onChange={(e) => {
                  setProductDescription(e)
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 items-center gap-4 h-fit">
            <Label htmlFor="image" className="text-right col-span-1">
              {t("Product image URL")}
            </Label>
            <SingleFileSelector selectedFile={productImage} setSelectedFile={setProductImage} />
            <Input
              className="col-span-3"
              id="image"
              type="text"
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-6 items-center gap-4 h-fit">
            <Label htmlFor="stock" className="text-right col-span-1">
              {t("Product stock")}
            </Label>
            <Input
              className="col-span-2"
              id="stock"
              type="number"
              value={productStock}
              onChange={(e) => setProductStock(e.target.value)}
            />
            <Label htmlFor="duties" className="text-right col-span-1">
              {t("Product duties")}
            </Label>
            <Input
              className="col-span-2"
              id="duties"
              type="number"
              value={productDuties}
              onChange={(e) => setProductDuties(e.target.value)}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">{t("Cancel")}</Button>
          </SheetClose>
          <Button onClick={handleSubmit}>{t("Update product")}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default EditProductSheet