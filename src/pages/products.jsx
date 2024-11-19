import { Product } from "@/components/ui/product"
import axios from "axios"
import Link from "next/link"

export const getServerSideProps = async () => {
  const { data } = await axios(`${process.env.HOST_NAME}/api/products`)

  return {
    props: {
      data,
    },
  }
}
const Products = ({ data }) => (
  <div className="flex flex-1 justify-center">
    <div className="grid grid-cols-3 w-5/6 h-fit">
      {data.map((product) => (
        <>
          <Link href={`/product/${product.id}`}>
            <Product key={product.id} product={product} />
          </Link>
        </>
      ))}
    </div>
  </div>
)

export default Products
