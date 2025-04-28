import Link from "@/components/CustomLink"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { useI18n } from "@/locales"
import { ArrowRight, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import ReactMarkdown from "react-markdown"

const ProductsSection = ({ product }) => {
    const t = useI18n()
    const [multiImageApis, setMultiImageApis] = useState(null)

    return (
        <div key={product.id} className="border p-4 mb-4 rounded-lg col-span-1 h-[500px] flex flex-col">

            <div className="mb-2 relative">
                {product.images && product.images.length > 0 && (
                    <Carousel
                        opts={{ loop: true }}
                        setApi={setMultiImageApis}
                        className="w-full h-full overflow-hidden"
                    >
                        <CarouselContent className="h-full">
                            {product.images.map((image, k) => (
                                <CarouselItem key={k} className="h-full overflow-hidden">
                                    <div className="relative h-full w-full overflow-hidden">
                                        <Image
                                            src={image}
                                            alt=""
                                            width={400}
                                            height={300}
                                            className="object-cover w-full h-full rounded-sm aspect-square"
                                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                )}
                <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            multiImageApis?.scrollPrev()
                        }}
                        className="bg-white rounded-full p-1 backdrop-blur-sm pointer-events-auto"
                        aria-label="Image précédente"
                    >
                        <ArrowLeft className="w-4 h-4 text-black" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            multiImageApis?.scrollNext()
                        }}
                        className="bg-white rounded-full p-1 backdrop-blur-sm pointer-events-auto"
                        aria-label="Image suivante"
                    >
                        <ArrowRight className="w-4 h-4 text-black" />
                    </button>
                </div>
            </div>
            <h3 className="text-xl font-bold mb-2">
                {product.title}
            </h3>
            <p className="text-gray-600 mb-4  overflow-hidden text-ellipsis">
                <ReactMarkdown>
                    {product.description}
                </ReactMarkdown>
            </p>
            <div className="flex flex-col gap-2">
                <span className="text-lg font-semibold">
                    {product.price}€
                </span>
                <Link href={`/product/${product.title}`} className="bg-primary text-white px-4 py-2 rounded-md">
                    {t("View product")}
                </Link>
            </div>
        </div>
    )
}

export default ProductsSection