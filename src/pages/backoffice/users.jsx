import AddProductSheet from "@/components/backoffice/addProductSheet"
import EditProductSheet from "@/components/backoffice/editProductSheet"
import BackofficeLayout from "@/components/layouts/BackofficeLayout"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useI18n, useScopedI18n } from "@/locales"
import authProps from "@/serverSideProps/authProps"
import { HoverCardTrigger } from "@radix-ui/react-hover-card"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import clsx from "clsx"
import { X, Check, SlidersHorizontal, Infinity } from "lucide-react"
import { useState } from "react"

// eslint-disable-next-line max-lines-per-function
const Users = () => {
  const t = useI18n()
  const productT = useScopedI18n("products")
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [filterCategoryId, setFilterCategoryId] = useState(null)
  const [filterIsTopProduct, setFilterIsTopProduct] = useState(null)
  const [filterIsActive, setFilterIsActive] = useState(null)
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => axios(`/api/categories`),
  })
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => axios(`/api/products?backoffice=1`),
    refetchInterval: 1000 * 20,
  })
  const handleDelete = async (id, title) => {
    try {
      await axios.delete(`/api/products?id=${id}`)
      await queryClient.invalidateQueries("products")
      toast({
        title: t("Product deleted"),
        description: t(`Product ${title} deleted`),
        variant: "default",
      })
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Error deleting product"),
        variant: "destructive",
      })
    }
  }

  return (
    <BackofficeLayout>
      <div className="flex-1 flex flex-col h-full relative">
        <div className="flex flex-col items-start gap-5 m-4 py-8 px-4">
          <h1 className="text-3xl font-black">{t("Users")}</h1>
          <div className="text-lg font-bold flex gap-4">
            <AddProductSheet
              categories={categories}
              queryClient={queryClient}
            />
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        )}
        {products && products.data && (
          <div className="flex-1 p-8">
            <div className="flex w-full justify-end pb-2">
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger className="p-2 rounded-sm transition-all hover:bg-gray-200 border">
                    <SlidersHorizontal className="h-5 w-5" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("Filters")}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-6 flex-col gap-x-8 gap-y-4">
                      <div className="gap-2 col-span-3">
                        <Label htmlFor="search" className="col-span-1">
                          {t("Search")}
                        </Label>
                        <Input
                          className="col-span-3"
                          id="search"
                          placeholder={t("Search...")}
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <div className="gap-2 col-span-3">
                        <Label htmlFor="category" className="col-span-1">
                          {t("Category")}
                        </Label>
                        <Select
                          onValueChange={(value) => setFilterCategoryId(value)}
                        >
                          <SelectTrigger className="w-full">
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
                      <div className="gap-2 col-span-3">
                        <Label htmlFor="isTopProduct" className="col-span-1">
                          {t("Top product")}
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setFilterIsTopProduct(value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("Is top product")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={null}>{t("All")}</SelectItem>
                            <SelectItem value="true">{t("Yes")}</SelectItem>
                            <SelectItem value="false">{t("No")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="gap-2 col-span-3">
                        <Label htmlFor="isActive" className="col-span-1">
                          {t("Active")}
                        </Label>
                        <Select
                          onValueChange={(value) => setFilterIsActive(value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("Is Active")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={null}>{t("All")}</SelectItem>
                            <SelectItem value="true">{t("Yes")}</SelectItem>
                            <SelectItem value="false">{t("No")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose>
                        <Button>{t("Filter")}</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Input
                  placeholder="Search..."
                  className="w-96"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full h-full p-4 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="h-fit">
                    <TableHead className="font-bold capitalize">
                      {t("id")}
                    </TableHead>
                    <TableHead className="font-bold capitalize text-ellipsis whitespace-nowrap">
                      {t("title")}
                    </TableHead>
                    <TableHead className="font-bold capitalize">
                      {t("price")}
                    </TableHead>
                    <TableHead className="font-bold capitalize text-ellipsis whitespace-nowrap">
                      {t("description")}
                    </TableHead>
                    <TableHead className="font-bold capitalize">
                      {t("stripeId")}
                    </TableHead>
                    <TableHead className="font-bold capitalize">
                      {t("category")}
                    </TableHead>
                    <TableHead className="font-bold capitalize">
                      {t("Stock")}
                    </TableHead>
                    <TableHead className="font-bold capitalize">
                      {t(`Top
                        products`)}
                    </TableHead>
                    <TableHead className="font-bold capitalize">
                      {t("Actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="w-full overflow-y-scroll">
                  {products.data
                    .filter((product) => {
                      if (
                        filterCategoryId &&
                        product.category.id !== filterCategoryId
                      ) {
                        return false
                      }

                      if (
                        filterIsTopProduct &&
                        product.isTopProduct !== (filterIsTopProduct === "true")
                      ) {
                        return false
                      }

                      if (
                        filterIsActive &&
                        product.isActive !== (filterIsActive === "true")
                      ) {
                        return false
                      }

                      if (
                        search &&
                        !product.title
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      ) {
                        return false
                      }

                      return true
                    })
                    .map((product, v) => (
                      <TableRow
                        key={product.id}
                        className={clsx(
                          v % 2 && "bg-gray-50 hover:bg-white",
                          !product.isActive && "text-gray-400",
                        )}
                      >
                        <TableCell>{productT(product.id)}</TableCell>
                        <TableCell>{productT(product.title)}</TableCell>
                        <TableCell>{productT(product.price)}</TableCell>
                        <TableCell>
                          <HoverCard>
                            <HoverCardTrigger className="text-ellipsis flex flex-col whitespace-nowrap max-w-xs overflow-hidden">
                              {productT(product.description)}
                            </HoverCardTrigger>
                            <HoverCardContent className="w-96">
                              <h5 className="font-bold mb-2">
                                {t("Description")}
                              </h5>
                              <p className="text-sm mb-2">
                                {productT(product.description)}
                              </p>
                            </HoverCardContent>
                          </HoverCard>
                        </TableCell>
                        <TableCell>{productT(product.stripeId)}</TableCell>
                        <TableCell>
                          {productT(product.category.title)}
                        </TableCell>
                        <TableCell>
                          {product.stock === -1 ? (
                            <Infinity className="text-gray-500" />
                          ) : (
                            product.stock
                          )}
                        </TableCell>
                        <TableCell>
                          {product.isTopProduct ? (
                            <Check className="text-green-500" />
                          ) : (
                            <X className="text-red-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {product.isActive && (
                              <EditProductSheet
                                product={product}
                                categories={categories}
                                queryClient={queryClient}
                              />
                            )}
                            <button
                              className={clsx(
                                "cursor-pointer underline",
                                product.isActive
                                  ? "text-red-500 "
                                  : "text-green-500",
                              )}
                              onClick={() =>
                                handleDelete(product.stripeId, product.title)
                              }
                            >
                              {product.isActive ? t("Archive") : t("Unarchive")}
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </BackofficeLayout>
  )
}

export default Users

export const getServerSideProps = async (context) => {
  const { user } = await authProps(context)

  if (!user || !user.isAdmin) {
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
