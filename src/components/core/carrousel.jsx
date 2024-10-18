/* eslint-disable array-callback-return */
import React, { useState } from "react"

const slideTest = [
  {
    titre: "Titre 1",
    text: "texte 1",
    img: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
    cta: "https://tse2.mm.bing.net/th?id=OIP.3EUlVP8Kj7LJqpPg3ARRwwHaE8&pid=Api",
    textCta: "Voir la photo",
  },
  {
    titre: "Titre 2",
    text: "texte 2",
    img: "https://tse2.mm.bing.net/th?id=OIP.1XSv8DcyMLXx8lYwXd6-1QHaEo&pid=Api",
    cta: "",
    textCta: "",
  },
  {
    titre: "Titre 3",
    text: "texte 3",
    img: "https://tse3.mm.bing.net/th?id=OIP.lwwQeVivLFPnoCQ9PqDxpQHaEK&pid=Api",
    cta: "",
    textCta: "",
  },
  {
    titre: "Titre 4",
    text: "texte 4",
    img: "https://tse1.mm.bing.net/th?id=OIP.9GmvSZuaFCbJ8_SyPbU8UQHaH4&pid=Api",
    cta: "",
    textCta: "",
  },
  {
    titre: "Titre 5",
    text: "texte 5",
    img: "https://tse4.mm.bing.net/th?id=OIP.mq8WdKHatG6vLSWQYApkCwHaE-&pid=Api",
    cta: "",
    textCta: "",
  },
  {
    titre: "Titre 6",
    text: "texte 6",
    img: "https://tse1.explicit.bing.net/th?id=OIP.Mm0lI07tzxLe_5oHo0rFUwHaFj&pid=Api",
    cta: "",
    textCta: "",
  },
]
const CustomCarousel = ({ slides = slideTest }) => {
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

  return (
    <div className="relative w-full mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-none w-full h-64 p-8 relative"
              style={{
                backgroundImage: `url(${slide.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black opacity-20 z-0"></div>
              <div className="relative z-10 flex flex-col justify-between h-full align-top">
                <div>
                  <h3 className="text-4xl font-bold text-white">
                    {slide.titre}
                  </h3>
                  <p className="text-white text-2xl mb-4">{slide.text}</p>
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
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 items-center p-2">
        <button
          onClick={prevSlide}
          className="bg-primary py-2 px-3 text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="bg-primary py-2 px-3 text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300"
        >
          ▶
        </button>
      </div>
    </div>
  )
}

export default CustomCarousel
