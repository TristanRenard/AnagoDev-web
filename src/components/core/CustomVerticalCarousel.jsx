import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"

const slideTest = [
  {
    titre: "Titre 1",
    text: "Lorem ipsum dolor sit amet consectetur. Nulla egestas fringilla tincidunt maecenas in mauris quis arcu. ",
    img: ["https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api", "https://tse2.mm.bing.net/th?id=OIP.1XSv8DcyMLXx8lYwXd6-1QHaEo&pid=Api", "https://tse3.mm.bing.net/th?id=OIP.lwwQeVivLFPnoCQ9PqDxpQHaEK&pid=Api"],
    cta: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
    textCta: "Voir la photo",
  },
  {
    titre: "Titre 2",
    text: "Lorem ipsum dolor sit amet consectetur. Nulla egestas fringilla tincidunt maecenas in mauris quis arcu. ",
    img: "https://tse2.mm.bing.net/th?id=OIP.1XSv8DcyMLXx8lYwXd6-1QHaEo&pid=Api",
    cta: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
    textCta: "Voir la photo",
  },
  {
    titre: "Titre 3",
    text: "Lorem ipsum dolor sit amet consectetur. Nulla egestas fringilla tincidunt maecenas in mauris quis arcu. ",
    img: "https://tse3.mm.bing.net/th?id=OIP.lwwQeVivLFPnoCQ9PqDxpQHaEK&pid=Api",
    cta: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
    textCta: "Voir la photo",
  },
  {
    titre: "Titre 4",
    text: "Lorem ipsum dolor sit amet consectetur. Nulla egestas fringilla tincidunt maecenas in mauris quis arcu. ",
    img: "https://tse1.mm.bing.net/th?id=OIP.9GmvSZuaFCbJ8_SyPbU8UQHaH4&pid=Api",
    cta: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
    textCta: "",
  },
  {
    titre: "Titre 5",
    text: "Lorem ipsum dolor sit amet consectetur. Nulla egestas fringilla tincidunt maecenas in mauris quis arcu. ",
    img: "https://tse4.mm.bing.net/th?id=OIP.mq8WdKHatG6vLSWQYApkCwHaE-&pid=Api",
    cta: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
    textCta: "Voir la photo",
  },
  {
    titre: "Titre 6",
    text: "Lorem ipsum dolor sit amet consectetur. Nulla egestas fringilla tincidunt maecenas in mauris quis arcu. ",
    img: "https://tse1.explicit.bing.net/th?id=OIP.Mm0lI07tzxLe_5oHo0rFUwHaFj&pid=Api",
    cta: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
    textCta: "Voir la photo",
  },
]
const CustomVerticalCarousel = ({ slides = slideTest }) => {
  const [multiImageApis, setMultiImageApis] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }


    checkMobile()


    window.addEventListener("resize", checkMobile)


    return () => window.removeEventListener("resize", checkMobile)
  }, [])


  const carouselConfig = useMemo(() => {
    const visibleSlides = isMobile ? 1 : 3
    const maxIndex = Math.max(0, slides.length - 1)
    const isCarouselEnabled = slides.length > 1
    const slideWidth = isMobile ? 100 : 33.33

    return {
      visibleSlides,
      maxIndex,
      isCarouselEnabled,
      slideWidth
    }
  }, [slides.length, isMobile])
  const nextSlide = () => {
    if (!carouselConfig.isCarouselEnabled) { return }


    setCurrentIndex((prevIndex) =>
      prevIndex < carouselConfig.maxIndex ? prevIndex + 1 : prevIndex
    )
  }
  const prevSlide = () => {
    if (!carouselConfig.isCarouselEnabled) { return }


    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : 0
    )
  }
  const progressPercentage = carouselConfig.maxIndex > 0
    ? (currentIndex / carouselConfig.maxIndex) * 100
    : 100
  const setApiForIndex = (api, index) => {
    if (api) {
      setMultiImageApis(prev => ({
        ...prev,
        [index]: api
      }))
    }
  }

  return (
    <div className="relative w-full">
      {/* Conteneur principal strict avec overflow caché */}
      <div className="overflow-hidden rounded-2xl">
        {/* Conteneur de slides avec transform */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * carouselConfig.slideWidth}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`flex-none ${isMobile ? "w-full" : "w-1/3"} h-[30rem] p-4 box-border`}
            >
              {/* Carte avec conteneur strict pour éviter les débordements */}
              <div className="flex flex-col h-full rounded-2xl bg-cyna-purple-grey overflow-hidden">
                {/* Conteneur d'image avec hauteur fixe et overflow hidden */}
                <div className="h-[40%] w-full overflow-hidden">
                  {typeof slide.img === "string" ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={slide.img}
                        alt={slide.titre}
                        width={400}
                        height={300}
                        className="object-cover w-full h-full"
                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                      />
                    </div>
                  ) : (
                    <Carousel
                      opts={{ loop: true }}
                      setApi={(api) => setApiForIndex(api, index)}
                      className="w-full h-full overflow-hidden"
                    >
                      <CarouselContent className="h-full">
                        {slide.img.map((image, k) => (
                          <CarouselItem key={k} className="h-full overflow-hidden">
                            <div className="relative h-full w-full overflow-hidden">
                              <Image
                                src={image}
                                alt={`${slide.titre} - image ${k + 1}`}
                                width={400}
                                height={300}
                                className="object-cover w-full h-full"
                                style={{ maxWidth: "100%", maxHeight: "100%" }}
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {/* Boutons de navigation superposés sur l'image */}
                      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            multiImageApis[index]?.scrollPrev()
                          }}
                          className="bg-white rounded-full p-1 backdrop-blur-sm pointer-events-auto"
                          aria-label="Image précédente"
                        >
                          <ArrowLeft className="w-4 h-4 text-black" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            multiImageApis[index]?.scrollNext()
                          }}
                          className="bg-white rounded-full p-1 backdrop-blur-sm pointer-events-auto"
                          aria-label="Image suivante"
                        >
                          <ArrowRight className="w-4 h-4 text-black" />
                        </button>
                      </div>
                    </Carousel>
                  )}
                </div>

                {/* Section de contenu */}
                <div className="flex-1 flex flex-col p-4 overflow-hidden">
                  <h3 className="text-2xl font-bold truncate">{slide.titre}</h3>
                  <p className="text-lg mb-4 flex-1 overflow-y-auto">
                    <ReactMarkdown>
                      {slide.text}
                    </ReactMarkdown>
                  </p>
                  {slide.cta && slide.textCta && (
                    <a
                      className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors duration-300 w-fit"
                      href={slide.cta}
                    >
                      {slide.textCta}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contrôles de navigation - n'apparaissent que si le carousel est activé */}
      {carouselConfig.isCarouselEnabled && (
        <div className="relative flex justify-end gap-2 items-center p-2 mt-2">
          <button
            onClick={prevSlide}
            className={`p-3 rounded-full transition-all duration-300 ${currentIndex === 0
              ? "bg-cyna-purple-grey/50 cursor-not-allowed"
              : "bg-cyna-purple-grey hover:bg-cyna-purple-grey/90"
              }`}
            disabled={currentIndex === 0}
          >
            <Image
              src="/ArrowLeft.svg"
              alt="left arrow"
              width={24}
              height={24}
              className={`w-6 h-6 ${currentIndex === 0 ? "opacity-50" : ""}`}
            />
          </button>
          <div className="bg-cyna-purple-grey rounded-full w-32 flex flex-col justify-center items-center py-5 px-4">
            <div className="w-full h-1.5 bg-slate-300 rounded-full">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{
                  width: `${progressPercentage}%`,
                  minWidth: "5%",
                }}
              />
            </div>
          </div>
          <button
            onClick={nextSlide}
            className={`p-3 rounded-full transition-all duration-300 ${currentIndex >= carouselConfig.maxIndex
              ? "bg-cyna-purple-grey/50 cursor-not-allowed"
              : "bg-cyna-purple-grey hover:bg-cyna-purple-grey/90"
              }`}
            disabled={currentIndex >= carouselConfig.maxIndex}
          >
            <Image
              src="/ArrowRight.svg"
              alt="right arrow"
              width={24}
              height={24}
              className={`w-6 h-6 ${currentIndex >= carouselConfig.maxIndex ? "opacity-50" : ""}`}
            />
          </button>
        </div>
      )}
    </div>
  )
}

export default CustomVerticalCarousel