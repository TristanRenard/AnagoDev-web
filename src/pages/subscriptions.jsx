import Link from "@/components/CustomLink"
import Product from "@/db/models/Product"
import knexInstance from "@/lib/db"
import { useI18n } from "@/locales"
import { Clock, Zap } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"

const SubscriptionsPage = () => {
    const t = useI18n()
    const [subscriptions, setSubscriptions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const res = await fetch("/api/subscriptionsProducts")
                const data = await res.json()
                setSubscriptions(data)
            } catch (error) {
                console.error("Failed to fetch subscriptions:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchSubscriptions()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-1 justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (subscriptions.length === 0) {
        return (
            <div className="flex flex-1 justify-center items-center min-h-[50vh]">
                <p className="text-xl text-gray-500">{t("No subscriptions found")}</p>
            </div>
        )
    }

    // Sort subscriptions with featured (top) products first
    const sortedSubscriptions = [...subscriptions].sort((a, b) => {
        if (a.isTopProduct && !b.isTopProduct) { return -1 }

        if (!a.isTopProduct && b.isTopProduct) { return 1 }

        return 0
    })

    return (
        <div className="flex flex-1 flex-col items-center bg-gray-50">
            <header className="w-full bg-white py-16 px-4 text-center shadow-sm">
                <h1 className="text-4xl font-bold mb-4">
                    {t("Subscriptions")}
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    {t("Discover our premium subscription plans designed to meet your needs")}
                </p>
            </header>

            <section className="w-full max-w-7xl py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedSubscriptions.map((product) => (
                        <div
                            key={product.id}
                            className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg ${product.isTopProduct ? "ring-2 ring-primary" : ""
                                }`}
                        >
                            <div className="relative h-64">
                                {product.images && product.images.length > 0 ? (

                                    <div className="relative h-full w-full">
                                        <Image
                                            src={product.images[0]}
                                            alt={product.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                    </div>

                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <p className="text-gray-500">{t("No image available")}</p>
                                    </div>
                                )}

                                {product.isTopProduct && (
                                    <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                        <Zap className="w-4 h-4 mr-1" />
                                        {t("Featured")}
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-bold mb-2 text-gray-800">
                                    {product.title}
                                </h3>

                                <div className="text-gray-700 mb-4 prose-sm max-h-32 overflow-y-auto">
                                    <ReactMarkdown>
                                        {product.description}
                                    </ReactMarkdown>
                                </div>

                                <div className="mt-6 space-y-4">
                                    {product.prices && product.prices.length > 0 ? (
                                        <div className="space-y-2">
                                            {product.prices.map((price) => (
                                                <div key={price.id} className="flex items-center justify-between">
                                                    <div className="flex items-center text-gray-600">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        <span>
                                                            {price.interval === "month" ? t("Monthly") :
                                                                price.interval === "year" ? t("Yearly") :
                                                                    price.interval}
                                                        </span>
                                                    </div>
                                                    <span className="text-lg font-semibold">
                                                        {(price.unit_amount / 100).toFixed(2)} {price.currency.toUpperCase()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">{t("Price")}</span>
                                            <span className="text-lg font-semibold">
                                                {product.price}€
                                            </span>
                                        </div>
                                    )}

                                    <Link
                                        href={`/subscription/${product.title}`}
                                        className="w-full block bg-primary hover:bg-primary-dark text-white text-center py-3 rounded-md transition-colors font-medium"
                                    >
                                        {t("View subscription")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export const getServerSideProps = async () => {
    try {
        // Fetch subscription products with their prices
        const products = await Product.query(knexInstance)
            .where({ isSubscription: true, isActive: true })
            .withGraphFetched("prices")

        return {
            props: {
                initialSubscriptions: JSON.parse(JSON.stringify(products))
            }
        }
    } catch (error) {
        console.error("Error fetching subscriptions:", error)

        return {
            props: {
                initialSubscriptions: []
            }
        }
    }
}

export default SubscriptionsPage