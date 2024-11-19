import Image from "next/image"

export const Product = ({ product }) => (
  <div className="p-6 border rounded-lg border-gray-300 shadow-lg bg-white hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 m-4">
    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
      {product.name}
    </h1>
    <p className="text-gray-600 text-sm mb-4">{product.description}</p>

    <div className="relative w-full h-64 mb-4">
      <Image
        src={product.images[0]}
        alt="Product"
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
      />
    </div>
  </div>
)
