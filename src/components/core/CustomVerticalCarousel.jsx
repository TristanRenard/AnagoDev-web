import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
  const multiImageApisRef = useRef({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [slideDirection, setSlideDirection] = useState("none")
  const [isAnimating, setIsAnimating] = useState(false)
  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < 768

    if (isMobile !== mobile) {
      setIsMobile(mobile)
    }
  }, [isMobile])

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (typeof window !== "undefined") {
      checkMobile()


      window.addEventListener("resize", checkMobile)


      return () => window.removeEventListener("resize", checkMobile)
    }
  }, [checkMobile])


  const getSlideWidthClass = useMemo(() => {
    if (isMobile) { return "w-full" }

    switch (Math.min(slides.length, 3)) {
      default:
        return "w-1/3"
    }
  }, [slides.length, isMobile])
  const carouselConfig = useMemo(() => {
    const visibleSlides = isMobile ? 1 : Math.min(slides.length, 3)
    const maxIndex = Math.max(0, slides.length - 1)
    const isCarouselEnabled = slides.length > visibleSlides

    return {
      visibleSlides,
      maxIndex,
      isCarouselEnabled
    }
  }, [slides.length, isMobile])
  const nextSlide = useCallback(() => {
    if (!carouselConfig.isCarouselEnabled || isAnimating) { return }

    setIsAnimating(true)
    setSlideDirection("left")

    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= slides.length - 1) {
          return 0
        }


        return prevIndex + 1
      })


      setTimeout(() => {
        setSlideDirection("none")
        setIsAnimating(false)
      }, 50)
    }, 300)
  }, [carouselConfig.isCarouselEnabled, slides.length, isAnimating])
  const prevSlide = useCallback(() => {
    if (!carouselConfig.isCarouselEnabled || isAnimating) { return }

    setIsAnimating(true)
    setSlideDirection("right")

    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex <= 0) {
          return slides.length - 1
        }


        return prevIndex - 1
      })


      setTimeout(() => {
        setSlideDirection("none")
        setIsAnimating(false)
      }, 50)
    }, 300)
  }, [carouselConfig.isCarouselEnabled, slides.length, isAnimating])
  const visibleIndices = useMemo(() => {
    if (isMobile) {
      return [currentIndex]
    }


    if (slides.length <= 3) {
      return Array.from({ length: slides.length }, (_, i) => i)
    }


    const indices = [currentIndex]
    for (let i = 1; i < 3; i++) {
      const nextIndex = (currentIndex + i) % slides.length
      indices.push(nextIndex)
    }

    return indices
  }, [currentIndex, isMobile, slides.length])
  const progressPercentage = carouselConfig.maxIndex > 0
    ? (currentIndex / carouselConfig.maxIndex) * 100
    : 100
  const setApiForIndex = useCallback((api, index) => {
    if (api) {
      multiImageApisRef.current[index] = api
    }
  }, [])
  const getAnimationClasses = useCallback(() => {
    switch (slideDirection) {
      case "left":
        return "animate-slide-left"

      case "right":
        return "animate-slide-right"

      default:
        return ""
    }
  }, [slideDirection])

  return (
    <div className="relative w-full">
      {/* Styles pour les animations */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        @keyframes slideLeft {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRight {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-left {
          animation: slideLeft 0.3s ease-out forwards;
        }
        .animate-slide-right {
          animation: slideRight 0.3s ease-out forwards;
        }
      `}</style>

      {/* Conteneur principal strict avec overflow caché */}
      <div className="overflow-hidden rounded-2xl">
        {/* Conteneur de slides avec justification automatique */}
        <div
          className={`flex ${getAnimationClasses()}`}
          style={{
            justifyContent: "flex-start"
          }}
        >
          {visibleIndices.map((slideIndex) => {
            const slide = slides[slideIndex]


            return (
              <div
                key={`visible-${slideIndex}`}
                className={`flex-none ${getSlideWidthClass} h-[30rem] p-4 box-border`}
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
                          className="object-cover object-center w-full h-full"
                          style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                      </div>
                    ) : (
                      <Carousel
                        opts={{ loop: true }}
                        setApi={(api) => setApiForIndex(api, slideIndex)}
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
                                  className="object-cover object-center w-full h-full"
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
                              const api = multiImageApisRef.current[slideIndex]

                              if (api) { api.scrollPrev() }
                            }}
                            className="bg-white rounded-full p-1 backdrop-blur-sm pointer-events-auto"
                            aria-label="Image précédente"
                          >
                            <ArrowLeft className="w-4 h-4 text-black" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const api = multiImageApisRef.current[slideIndex]

                              if (api) { api.scrollNext() }
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
            )
          })}
        </div>
      </div>

      {/* Contrôles de navigation - n'apparaissent que si le carousel est activé et s'il y a plus de 3 slides */}
      {carouselConfig.isCarouselEnabled && (
        <div className="relative flex justify-end gap-2 items-center p-2 mt-2">
          <button
            onClick={prevSlide}
            className={`p-3 rounded-full transition-all duration-300 ${isAnimating
              ? "bg-cyna-purple-grey/50 cursor-not-allowed"
              : "bg-cyna-purple-grey hover:bg-cyna-purple-grey/90"}`}
            disabled={isAnimating}
          >
            <Image
              src="/ArrowLeft.svg"
              alt="left arrow"
              width={24}
              height={24}
              className={`w-6 h-6 ${isAnimating ? "opacity-50" : ""}`}
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
            className={`p-3 rounded-full transition-all duration-300 ${isAnimating
              ? "bg-cyna-purple-grey/50 cursor-not-allowed"
              : "bg-cyna-purple-grey hover:bg-cyna-purple-grey/90"}`}
            disabled={isAnimating}
          >
            <Image
              src="/ArrowRight.svg"
              alt="right arrow"
              width={24}
              height={24}
              className={`w-6 h-6 ${isAnimating ? "opacity-50" : ""}`}
            />
          </button>
        </div>
      )}
    </div>
  )
}

export default CustomVerticalCarousel