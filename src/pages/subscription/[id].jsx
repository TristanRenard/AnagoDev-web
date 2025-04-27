import CustomVerticalCarousel from "@/components/core/CustomVerticalCarousel"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import knexInstance from "@/lib/db"
import { useI18n, useScopedI18n } from "@/locales"
import axios from "axios"
import clsx from "clsx"
import Image from "next/image"
import { useRouter } from "next/router"
import ReactMarkdown from "react-markdown"
import Product from "@/db/models/Product"

const SubscriptionPage = ({ subscription, similarSubscriptions }) => {
  console.log(subscription)
  console.log(similarSubscriptions)
  const { toast } = useToast()
  const router = useRouter()
  const t = useI18n()
  const pt = useScopedI18n("subscriptions")
  const handleAddToCart = async () => {
    try {
      await axios.post("/api/cart", {
        subscriptionId: subscription.id,
        action: "add",
      })
      toast({
        title: t("Subscription added to cart"),
        description: t("Subscription successfully added to your cart"),
        status: "success",
      })
      umami.track("addToCart", {
        subscriptionId: subscription.id,
        subscriptionTitle: subscription.title,
      })
      umami.track("navigate", {
        from: router.asPath,
        to: "/cart",
      })
      router.push("/cart")
    } catch (error) {
      toast({
        title: t("Error adding subscription to cart"),
        description: error.response?.data?.message || t("Something went wrong"),
        status: "error",
      })
    }
  }

  return (
    <div className="flex flex-1 justify-center flex-col items-center">
      <section className="w-5/6 py-24 relative">
        <div className="flex flex-col-reverse lg:flex-row gap-32">
          {/* Images */}
          <section className="grid grid-cols-2 w-full lg:w-1/2 gap-4">
            {subscription.images.map((image, k) => (
              <Image
                key={k}
                src={image}
                alt=""
                width={1920}
                height={1080}
                className={clsx(
                  "rounded-lg aspect-square object-cover w-full h-full",
                  k === 0
                    ? "col-span-2 sm:col-span-2 md:col-span-1  lg:col-span-2"
                    : "col-span-2 md:col-span-1",
                )}
              />
            ))}
          </section>

          {/* Détail */}
          <section className="w-full lg:w-1/2">
            <div className="sticky top-24">
              <h1 className="text-5xl font-bold">{pt(subscription.title)}</h1>
              <p className="text-lg mt-4">
                <ReactMarkdown>{pt(subscription.description)}</ReactMarkdown>
              </p>
              <div className="flex flex-col gap-4 mt-6">
                <span className="text-3xl font-bold">{subscription.price} €</span>
                <Button
                  onClick={handleAddToCart}
                  className="bg-primary text-primary-foreground rounded-md px-4 py-2 w-full"
                >
                  {t("Subscribe now")}
                </Button>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="w-5/6 py-24 flex flex-col gap-6">
        <h2 className="text-3xl font-bold mb-6">
          {t("Other subscriptions in")} {t(subscription.category.title)}
        </h2>
        <CustomVerticalCarousel slides={similarSubscriptions} />
      </section>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const { id } = context.params
  const subscription = await Product.query(knexInstance)
    .findOne({ id })
    .withGraphFetched("[category, prices]")

  if (!subscription) {
    return {
      notFound: true,
    }
  }

  const similarProducts = await Product.query(knexInstance)
    .select("*")
    .where({ categoryId: subscription.categoryId })
    .whereNot({ id: subscription.id })
    .orderBy("isTopProduct", "desc")
  const slides = similarProducts.map((pr) => ({
    titre: pr.title,
    text: pr.description,
    img: pr.images,
    cta: `/product/${pr.title}`,
    textCta: "See more",
  }))

  return {
    props: {
      subscription: JSON.parse(JSON.stringify(subscription)),
      similarSubscriptions: slides,
    },
  }
}

export default SubscriptionPage