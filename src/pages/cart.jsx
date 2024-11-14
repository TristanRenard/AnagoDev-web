import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { LoaderCircle, ScanBarcode } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const CartPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart"], queryFn: async () => {
      const res = await axios.get("/api/cart")

      return res.data
    }
  })

  return (
    <main className="flex flex-1 flex-col p-4 sm:p-8">
      <h1 className="p-8 text-3xl font-bold">
        Cart
      </h1>
      {isLoading &&
        <div className="flex justify-center items-center gap-2">
          <LoaderCircle className="h-8 w-8 text-primary animate-spin" /> <span>Loading...</span>
        </div>
      }
      {isError &&
        <div className="flex flex-1 justify-center items-center gap-2">
          <span>Error loading cart</span>
        </div>
      }
      {data && (data.length === 0 ? (

        <div className="flex flex-1 justify-center items-center gap-2">
          <span>Your cart is empty</span>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4">
          {
            data.map((item, index) => {
              // eslint-disable-next-line prefer-destructuring
              const key = Object.keys(item)[0]
              const checkout = item[key]

              return (
                <section key={index} className="flex flex-col gap-4 p-2 sm:p-8 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">
                      {key}
                    </h3>

                  </div>
                  <ul className="flex flex-col gap-2">
                    {
                      checkout.products.map((product, k) => (
                        <li key={k} className="p-2 border rounded-md">
                          <div className="flex flex-col md:flex-row gap-8 h-fit ">

                            <Image width={1920} height={1080} src={product.images[0]} alt={product.name} className="md:h-32 md:w-auto aspect-square object-cover rounded-md" />
                            <div className="flex flex-1 flex-col gap-2 p-1">
                              <div className="flex justify-between">
                                <h4 className="text-lg font-bold">
                                  {product.name}
                                </h4>
                                <p className="md:hidden font-semibold">
                                  {Math.round((product.amount_total / 100) * 100) / 100} {checkout.currency.toUpperCase()}
                                </p>
                              </div>
                              <div className="flex justify-between">
                                <div>
                                  <p>
                                    {product.description}
                                  </p>
                                  <p>
                                    {product.price.priceName} - {product.quantity} x {Math.round((product.price.unit_amount / 100) * 100) / 100} {checkout.currency.toUpperCase()}
                                  </p>
                                </div>
                                <p className="hidden md:block">
                                  {Math.round((product.amount_total / 100) * 100) / 100} {checkout.currency.toUpperCase()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">
                      {Math.round((checkout.amount_total / 100) * 100) / 100
                      } {checkout.currency.toUpperCase()}
                    </p>
                    <Link href={checkout.checkoutURL} className="flex w-fit p-3 self-end rounded-md text-white items-center gap-2 bg-gradient-to-r from-[#420A8F] to-[#240198] ">
                      <ScanBarcode className="h-4 w-4 stroke-2" />
                      <span>Checkout</span>
                    </Link>
                  </div>
                </section>
              )
            })
          }
        </div>
      ))
      }
    </main>
  )
}

export default CartPage