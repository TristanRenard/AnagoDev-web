import authProps from "@/serverSideProps/authProps"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import "dayjs/locale/fr"
import { useI18n } from "@/locales"
dayjs.locale("fr")

const OrdersPage = () => {
    const t = useI18n()
    const router = useRouter()
    const [orders, setOrders] = useState([])
    const { isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            try {
                const res = await axios.get("/api/user/orders")
                const formatted = res.data.orders.map((order) => ({
                    id: order.id,
                    status: order.status,
                    createdAt: dayjs(order.created_at).format("D MMMM YYYY à HH:mm"),
                    paymentMethod: order.paymentMethodId,
                    stripeSessionId: order.stripeSessionId,
                    products: order.orderPrices.map((op) => ({
                        quantity: op.quantity,
                        price: op.price?.unit_amount,
                        currency: op.price?.currency,
                        productName: op.price?.product?.title,
                    })),
                }))
                setOrders(formatted)

                return formatted
            } catch (err) {
                router.push("/auth/login")

                return []
            }
        },
    })

    if (isLoading) { return <div>Chargement...</div> }

    return (
        <div className="flex-1 p-4">
            <h1 className="text-xl font-bold mb-4">{t("Orders")}</h1>
            {orders.length === 0 ? (
                <p>{t("No orders found")}</p>
            ) : (
                <table className="min-w-full border border-gray-300 text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">{t("ID")}</th>
                            <th className="p-2 border">{t("Status")}</th>
                            <th className="p-2 border">{t("Date")}</th>
                            <th className="p-2 border">{t("Products")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-t">
                                <td className="p-2 border">{order.id}</td>
                                <td className="p-2 border">{order.status}</td>
                                <td className="p-2 border">{order.createdAt}</td>
                                <td className="p-2 border">
                                    <ul className="list-disc pl-4">
                                        {order.products?.map((orderPrice) => {
                                            const { quantity, price, currency, productName } = orderPrice
                                            const formattedPrice = price
                                                ? `${(price / 100).toFixed(2)} ${currency?.toUpperCase()}`
                                                : t("Price not available")

                                            return (
                                                <li key={orderPrice.id} className="text-sm">
                                                    {quantity} × {productName || t("Unknown product")} ({formattedPrice})
                                                </li>
                                            )
                                        }) ?? (
                                                <li className="text-sm text-muted-foreground">{t("No products")}</li>
                                            )}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}


export default OrdersPage

export const getServerSideProps = async (context) => {
    const { user } = await authProps(context)

    return {
        props: {
            user,
        },
    }
}