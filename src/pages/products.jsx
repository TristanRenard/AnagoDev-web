import ProductsSection from "@/components/ProductSection"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Category from "@/db/models/Category"
import Product from "@/db/models/Product"
import knexInstance from "@/lib/db"
import { useI18n } from "@/locales"
import { useState } from "react"


const ProductsPage = ({ categories, products }) => {
  const t = useI18n()
  const [selectedCategories, setSelectedCategories] = useState([...categories.map((category) => category.id)])
  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      }

      return [...prev, categoryId]
    })
  }

  console.log(categories)
  console.log(products)

  return (
    <div className="flex flex-1 flex-col items-center">
      <header className="w-11/12 py-16">
        <h1 className="text-4xl font-bold mb-4">
          {t("Products")}
        </h1>
        <p className="text-lg text-gray-600">
          {t("Discover our products")}
        </p>
      </header>
      <section className="w-5/6 flex justify-between">
        <section>
          <h3 className="text-2xl font-bold mb-4">
            {t("Filters")}
          </h3>
          <div className="pl-4">
            <h4 className="text-lg font-semibold mb-2">
              {t("Categories")}
            </h4>
            <ul className="pl-2">
              {categories.map((category) => (
                <li key={category.id} className="mb-8 flex items-center">
                  <Checkbox id={category.id} onCheckedChange={() => { toggleCategory(category.id) }} checked={selectedCategories.includes(category.id)} />
                  <Label htmlFor={category.id} className="ml-2">
                    {category.title}
                  </Label>
                </li>
              ))}
            </ul>
          </div>

        </section>
        <section className="w-5/6 pl-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {
            products.filter((product) => selectedCategories.includes(product.categoryId)).map((product) => (
              <ProductsSection
                key={product.id}
                product={product}
              />
            )).sort((a, b) => {
              if (a.isTopProduct && !b.isTopProduct) {
                return -1
              }

              if (!a.isTopProduct && b.isTopProduct) {
                return 1
              }

              return 0
            }

            )
          }
        </section>

      </section>
    </div >
  )
}

export const getServerSideProps = async () => {
  const products = await Product.query(knexInstance).select("categoryId", "title", "description", "images", "isMarkdown", "isSubscription", "stock", "price", "isTopProduct", "isActive").where({ isActive: true, isSubscription: false }).withGraphFetched("[category, prices]")
  const categories = await Category.query(knexInstance).select("id", "title").whereNot({ title: "subscriptions" })

  console.log(categories)

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      categories: JSON.parse(JSON.stringify(categories)),
    },
  }
}

export default ProductsPage