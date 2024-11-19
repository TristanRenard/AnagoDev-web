import React, { useState } from "react"
import Image from "next/image"
import axios from "axios"
import { useRouter } from "next/router"
import clsx from "clsx"

const ProductPage = ({ data }) => {
  const [optionSelected, setOptionSelected] = useState("")
  const routeur = useRouter()
  const formatPrice = (amount, currency) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(amount / 100)
  const addTocard = () => {
    axios
      .post("/api/cart", {
        priceId: optionSelected,
        quantity: 1,
      })
      .then(() => {
        routeur.push("/cart")
      })
  }

  return (
    <div className="font-sans p-6 max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 flex-1">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mt-4">{data.name}</h1>

        <p className="mt-4 text-gray-700">{data.description}</p>

        <div className="mt-6">
          <h4 className="text-lg font-medium">Prix</h4>
          <div className="flex space-x-4 mt-2">
            {data?.prices.map((price) => (
              <button
                key={price.id}
                className={clsx(
                  "p-4 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 focus:outline-none",
                  price.id === optionSelected && "border-indigo-600",
                )}
                onClick={() => setOptionSelected(price.id)}
              >
                <p className="font-semibold">{price.name}</p>
                <p className="text-sm text-gray-500">
                  {formatPrice(price.unit_amount, price.currency)}
                </p>
              </button>
            ))}
          </div>
        </div>

        <button
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 focus:outline-none"
          onClick={addTocard}
        >
          Add to bag
        </button>
      </div>

      <div className="flex-1">
        {data.images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={data.name}
            className="rounded-lg"
            width={500}
            height={500}
          />
        ))}
      </div>
    </div>
  )
}
const getServerSideProps = async (context) => {
  const data = await (await axios(`${process.env.HOST_NAME}/api/products`)).data
  const { id } = context.query

  return {
    props: {
      data: data.filter((product) => product.id === id)[0],
    },
  }
}
export { getServerSideProps }

export default ProductPage
