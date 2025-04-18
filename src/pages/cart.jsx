/* eslint-disable camelcase */
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { LoaderCircle, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/router"

const CartPage = () => {
  const { toast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axios("/api/cart")

      return res.data
    },
  })
  const addProductMutation = useMutation({
    mutationFn: async ({ selectedPrice, action = "add" }) => {
      const res = await axios.post("/api/cart", {
        selectedPrice,
        action,
      })

      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur est survenue",
        status: "error",
      })
    },
  })
  const handleUpdateQuantity = (selectedPriceId, action) => {
    addProductMutation.mutate({ selectedPrice: selectedPriceId, action })
  }
  const calculateTotal = () => {
    if (!data) {
      return 0
    }

    return (
      data.orderPrice.reduce(
        (acc, { unit_amount }, index) =>
          acc + unit_amount * data.quantity[index].quantity,
        0,
      ) / 100
    )
  }
  const handlePayment = async () => {
    const res = await axios.post("/api/payment", {
      products: data.allProducts,
      quantity: data.quantity,
    })
    await router.push(res.data.url)
  }

  return (
    <main className="flex flex-1 flex-col p-4 sm:p-8">
      <h1 className="p-8 text-3xl font-bold">Cart</h1>

      {isLoading && (
        <div className="flex justify-center items-center gap-2">
          <LoaderCircle className="h-8 w-8 text-primary animate-spin" />
          <span>Loading...</span>
        </div>
      )}

      {isError && (
        <div className="flex flex-1 justify-center items-center gap-2">
          <span>Error loading cart</span>
        </div>
      )}

      {data && data.orderPrice.length === 0 ? (
        <div className="flex flex-1 justify-center items-center gap-2 text-gray-500">
          <span className="flex flex-row gap-2 text-lg">
            <ShoppingCart /> Votre panier est vide
          </span>
        </div>
      ) : (
        data && (
          <>
            <div className="flex flex-1 flex-col gap-6">
              {data.allProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gray-200 shadow-sm rounded-2xl p-6 bg-white hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-row gap-4 items-center">
                    <Image
                      src={product.images[0]}
                      width={200}
                      height={150}
                      alt="Product image"
                    />
                    <div className="flex flex-col">
                      <p className="text-lg font-semibold text-gray-800">
                        {product.title}
                      </p>
                      <span className="text-sm text-gray-500">
                        {data.quantity[index].quantity} ×{" "}
                        {data.orderPrice[index].unit_amount / 100} €
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(product.default_price, "remove")
                      }
                      disabled={addProductMutation.isPending}
                      className="flex items-center justify-center w-9 h-9 border border-gray-300 rounded-full hover:border-primary hover:bg-gray-100 transition disabled:opacity-50 text-lg"
                    >
                      −
                    </button>
                    <p className="text-lg font-medium text-gray-800 w-6 text-center">
                      {data.quantity[index].quantity}
                    </p>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(product.default_price, "add")
                      }
                      disabled={addProductMutation.isPending}
                      className="flex items-center justify-center w-9 h-9 border border-gray-300 rounded-full hover:border-primary hover:bg-gray-100 transition disabled:opacity-50 text-lg"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-xl font-semibold text-gray-700 mt-2 md:mt-0">
                    {(data.orderPrice[index].unit_amount *
                      data.quantity[index].quantity) /
                      100}{" "}
                    €
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-end gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Total de la commande: {calculateTotal().toFixed(2)} €
              </h1>

              <Button
                onClick={handlePayment}
                className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary/90 transition flex items-center gap-2 text-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                Passer au paiement
              </Button>
            </div>
          </>
        )
      )}
    </main>
  )
}

export default CartPage
