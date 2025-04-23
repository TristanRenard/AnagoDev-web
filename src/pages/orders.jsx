import { useI18n } from "@/locales"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { LoaderCircle } from "lucide-react"
import { useState } from "react"

const Orders = () => {
  const t = useI18n()
  const [userOrders, setUserOrders] = useState(null)
  const { isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios("/api/user/orders")
      setUserOrders(res.data.orders)
    },
  })

  if (isLoading || !userOrders) {
    return (
      <div className="flex-1 flex justify-center items-center gap-2">
        <LoaderCircle className="h-8 w-8 text-primary animate-spin" />
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {t("My Orders")} ({userOrders.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {userOrders.map((order, index) => {
          const totalPrice =
            order.orderPrices.reduce(
              (acc, orderPrice) =>
                acc + orderPrice.price.unit_amount * orderPrice.quantity,
              0,
            ) / 100
          const formattedDate = new Date(order.createdAt).toLocaleDateString()

          return (
            <div
              key={order.id}
              className="p-4 border rounded-xl shadow-sm bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  {t("Order")} #{index + 1}
                </span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {formattedDate}
                </span>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {totalPrice.toFixed(2)} €
              </div>
              <div className="text-sm text-gray-500">
                {order.totalQuantity} {t("items")}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders
