import React, { useState } from "react"
import { useI18n } from "@/locales"

const slideTest = [
  {
    titre: "Titre 1",
    text: "Lorem ipsum dolor sit amet consectetur. Nulla egestas fringilla tincidunt maecenas in mauris quis arcu. ",
    img: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 3 ? 0 : prevIndex + 1,
    )
  }
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 3 : prevIndex - 1,
    )
  }
  const t = useI18n()
  
  return (
    <div className="relative mx-24 my-16">
      <h2 className="text-5xl font-medium mb-4">{t("More solutions")}</h2>
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-none w-[33.33%] h-[30rem] relative rounded-2xl p-4"
            >
              <div className="flex flex-col h-full justify-between rounded-2xl bg-cyna-purple-grey ">
                <div className="h-[40%]">
                  <img
                    src={slide.img}
                    alt="background"
                    className="object-cover w-full h-full rounded-t-2xl"
                  />
                </div>
                <div className="h-2/3 flex flex-col p-4">
                  <h3 className="text-2xl font-bold">{slide.titre}</h3>
                  <p className="text-lg mb-4 flex-1">{slide.text}</p>
                  {slide.cta && (
                    <a
                      className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:primary/90 transition-colors duration-300 w-fit"
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
      <div className="flex justify-end gap-2 items-center p-2 mt-2">
        <button
          onClick={prevSlide}
          className="bg-cyna-purple-grey p-3 rounded-full hover:bg-cyna-purple-grey/90 transition-all duration-300"
        >
          <img
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
          <div className="w-full h-2 bg-slate-300 rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / (slides.length - 2)) * 100}%`,
              }}
            />
          </div>
        </div>
        <button
          onClick={nextSlide}
          className="bg-cyna-purple-grey p-3 rounded-full hover:bg-cyna-purple-grey/90 transition-all duration-300"
        >
          <img
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

export default CustomVerticalCarousel
