import BackofficeLayout from "@/components/layouts/BackofficeLayout"
import { useI18n } from "@/locales"
import authProps from "@/serverSideProps/authProps"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/fr"
dayjs.locale("fr")

const Orders = () => {
    const t = useI18n()
    const [orders, setOrders] = useState([])
    const { isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            try {
                const res = await axios.get("/api/user/orders?all=true")
                const formatted = res.data.orders.map((order) => ({
                    id: order.id,
                    userId: order.userId,
                    usermail: order.user?.email,
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
                return []
            }
        },
    })
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.patch(`/api/user/order/${orderId}`, { status: newStatus })
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            )
        } catch (error) {
            console.error("Failed to update order status", error)
            alert(t("An error occurred while updating the status."))
        }
    }

    if (isLoading) {
        return (
            <BackofficeLayout>
                <div className="flex-1 p-4">{t("Loading...")}</div>
            </BackofficeLayout>
        )
    }

    return (
        <BackofficeLayout>
            <div className="flex-1 p-4">
                <h1 className="text-xl font-bold mb-4">{t("Orders")}</h1>
                {orders.length === 0 ? (
                    <p>{t("No orders found")}</p>
                ) : (
                    <table className="min-w-full border border-gray-300 text-sm text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">{t("ID")}</th>
                                <th className="p-2 border">{t("User")}</th>
                                <th className="p-2 border">{t("Status")}</th>
                                <th className="p-2 border">{t("Date")}</th>
                                <th className="p-2 border">{t("Products")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="p-2 border">{order.id}</td>
                                    <td className="p-2 border">{order.usermail}</td>
                                    <td className="p-2 border">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="border border-gray-300 rounded p-1 text-sm"
                                        >
                                            <option value="in-progress">{t("In progress")}</option>
                                            <option value="paid">{t("Paid")}</option>
                                            <option value="cancelled">{t("Cancelled")}</option>
                                            <option value="refunded">{t("Refunded")}</option>
                                        </select>
                                    </td>
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
        </BackofficeLayout>
    )
}

export default Orders

export const getServerSideProps = async (context) => {
    const { user } = await authProps(context)

    if (!user || user.role !== "admin") {
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
