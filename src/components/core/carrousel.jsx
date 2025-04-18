/* eslint-disable array-callback-return */
import { useI18n } from "@/locales"
import Image from "next/image"
import { useEffect, useState } from "react"

const CustomCarousel = () => {
  const [slides, setSlides] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1,
    )
  }
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1,
    )
  }
  const t = useI18n()
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("/api/settings")

        if (!res.ok) {
          throw new Error("Failed to fetch slides")
        }

        const data = await res.json()
        setSlides(data.carrousel?.slides || [])
      } catch (err) {
        console.error("Error fetching slides:", err)
      }
    }

    fetchSlides()
  }, [])

  return (
    <div className="relative mx-24 my-16">
      <h2 className="text-5xl font-medium mb-4">{t("Popular solutions")}</h2>
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-none w-full h-64 relative rounded-2xl"
            >
              <div className="flex justify-between h-full align-top rounded-2xl">
                <div className="relative z-10 flex flex-col justify-between h-full w-1/2 p-8 align-top bg-cyna-purple-grey">
                  <div>
                    <h3 className="text-4xl font-bold">{slide.titre}</h3>
                    <p className=" text-2xl mb-4">{slide.text}</p>
                  </div>
                  {slide.cta && (
                    <a
                      className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:primary/90 transition-colors duration-300 w-fit"
                      href={slide.cta}
                    >
                      {slide.textCta}
                    </a>
                  )}
                </div>
                <Image
                  src={slide.img[0] || "/logo_cyna_black.png"}
                  alt="background image"
                  width={200}
                  height={100}
                  className="object-cover w-1/2 h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 items-center p-2 mt-2">
        <button
          onClick={prevSlide}
          className="bg-cyna-purple-grey p-3 rounded-full hover:bg-cyna-purple-grey/90 transition-all duration-300"
        >
          <Image
            src="/ArrowLeft.svg"
            alt="left arrow"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
        <div
          className="bg-cyna-purple-grey rounded-full w-32 flex flex-col justify-center items-center"
          style={{
            padding: `1.3rem`,
          }}
        >
          <div className="w-full h-1.5 bg-slate-300 rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / slides.length) * 100}%`,
              }}
            />
          </div>
        </div>
        <button
          onClick={nextSlide}
          className="bg-cyna-purple-grey p-3 rounded-full hover:bg-cyna-purple-grey/90 transition-all duration-300"
        >
          <Image
            src="/ArrowRight.svg"
            alt="right arrow"
            width={24}
            height={24}
            className="w-6 h-6"
          />
        </button>
      </div>
    </div>
  )
}

export default CustomCarousel
