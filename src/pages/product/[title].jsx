import CustomVerticalCarousel from "@/components/core/CustomVerticalCarousel"
import Product from "@/db/models/Product"
import knexInstance from "@/lib/db"
import { useI18n, useScopedI18n } from "@/locales"
import clsx from "clsx"
import Image from "next/image"
import { useState } from "react"
import ReactMarkdown from "react-markdown"


const ProductPage = ({ product, similarProducts }) => {
  const [selectedPrice, setSelectedPrice] = useState(product?.prices?.[0]?.id)
  const t = useI18n()
  const pt = useScopedI18n("products")
  console.log(product)
  console.log(similarProducts)

  return (
    <div className="flex flex-1 justify-center flex-col items-center">
      <section className="w-5/6 py-24 relative">
        <div className="flex flex-col-reverse lg:flex-row gap-32">
          {/* Section des images qui défilera normalement avec la page */}
          <section className="grid grid-cols-2 w-full lg:w-1/2 gap-4">
            {product.images.map((image, k) => (
              <Image
                key={k}
                src={image}
                alt=""
                width={1920}
                height={1080}
                className={clsx("rounded-lg aspect-square object-cover w-full h-full ", k === 0 ? "col-span-2 sm:col-span-2 md:col-span-1  lg:col-span-2" : "col-span-2 md:col-span-1")}
              />
            ))}
          </section>

          {/* Section description qui restera fixe pendant le défilement */}
          <section className="w-full lg:w-1/2">
            <div className="sticky top-24">
              <h1 className="text-5xl font-bold">
                {pt(product.title)}
              </h1>
              <p className="text-lg mt-4">
                <ReactMarkdown>
                  {pt(product.description)}
                </ReactMarkdown>
              </p>
              <div className="flex mt-6">
                {product.prices.map((price) => (
                  <button
                    key={price.id}
                    className={clsx(
                      "flex flex-col items-center rounded-md border-2 px-4 py-2 mr-4 w-full cursor-pointer",
                      selectedPrice === price.id
                        ? "border-primary bg-primary/10"
                        : "border-gray-300 bg-gray-100"
                    )}
                    onClick={() => setSelectedPrice(price.id)}
                  >
                    <span className="text-xl font-bold">
                      {t(price.nickname)}
                    </span>
                    <span>
                      {price.unit_amount / 100}
                      {price.currency}
                    </span>
                  </button>
                ))}
              </div>
              <button className="bg-primary text-primary-foreground rounded-md px-4 py-2 mt-6 w-full">
                Add to cart
              </button>
            </div>
          </section>
        </div>
      </section>
      <section className="w-5/6 py-24 flex flex-col gap-6">
        <h2 className="text-3xl font-bold mb-6">
          {t("Other products in")} {t(product.category.title)}
        </h2>
        <CustomVerticalCarousel slides={similarProducts} />
      </section>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const { title } = context.params
  const product = await Product.query(knexInstance).findOne({ title }).withGraphFetched("[category, prices]")

  if (!product) {
    return {
      notFound: true,
    }
  }

  const similarProducts = await Product.query(knexInstance).select("*").where({ "categoryId": product.categoryId }).whereNot({ id: product.id }).orderBy("isTopProduct", "desc")
  const slides = similarProducts.map((pr) => ({
    titre: pr.title,
    text: pr.description,
    img: pr.images,
    cta: `/product/${pr.title}`,
    textCta: "See more",
  }))


  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      similarProducts: slides,
    },
  }
}

export default ProductPage