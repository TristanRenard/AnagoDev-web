import React from "react"
import Image from "next/image"

const data = {
  id: "prod_RDPr0TeZcSO661",
  name: "🤷‍♀️",
  description: "je ne sais pas",
  prices: [
    {
      id: "price_1QKz1NKkUjjBJCSDVkAywDLP",
      name: "monthly payment",
      unitAmont: 2300,
      currency: "eur",
    },
  ],
  images: [
    "https://files.stripe.com/links/MDB8YWNjdF8xUTQzVEVLa1VqakJKQ1NEfGZsX3Rlc3RfRUk5NjJ4RlZ6cE03MTB6OVN4dXFPRVdn00EJor9zSQ",
  ],
}
const ProductPage = () => {
  const formatPrice = (amount, currency) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(amount / 100)

  return (
    <div className="font-sans p-6 max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <nav className="text-sm text-gray-500">
          Chemin / vers / le / produit
        </nav>

        <h1 className="text-3xl font-bold mt-4">{data.name}</h1>
        <p className="text-xl font-semibold mt-2 text-gray-800">
          {formatPrice(data.prices[0].unitAmont, data.prices[0].currency)}
        </p>

        <div className="flex items-center mt-2">
          <span className="text-lg mr-2">⭐️⭐️⭐️⭐️☆</span>
          <span className="text-gray-500">(1624 reviews)</span>
        </div>

        <p className="mt-4 text-gray-700">{data.description}</p>

        <p className="mt-4 text-green-600 font-medium">
          ✓ In stock and ready to ship
        </p>

        <div className="mt-6">
          <h4 className="text-lg font-medium">Size</h4>
          <div className="flex space-x-4 mt-2">
            <button className="p-4 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 focus:outline-none">
              <p className="font-semibold">18L</p>
              <p className="text-sm text-gray-500">
                Perfect for a reasonable amount of snacks.
              </p>
            </button>
            <button className="p-4 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 focus:outline-none">
              <p className="font-semibold">20L</p>
              <p className="text-sm text-gray-500">
                Enough room for a serious amount of snacks.
              </p>
            </button>
          </div>
        </div>

        <button className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 focus:outline-none">
          Add to bag
        </button>
        <p className="text-center mt-2 text-gray-500">Lifetime Guarantee</p>
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

export default ProductPage
