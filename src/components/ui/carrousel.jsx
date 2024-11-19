import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"

const slides = [
  {
    title: "title 1",
    content:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publ.",
    image: "",
    link: "/card",
    cta: "Voir",
  },
  {
    title: "title 2",
    content:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publ.",
    image: "",
    link: "/card",
    cta: "Voir",
  },
  {
    title: "title 3",
    content:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publ.",
    image: "",
    link: "/card",
    cta: "Voir",
  },
]
const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1,
    )
  }
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1,
    )
  }

  return (
    <div className="w-full mx-auto flex flex-col items-center">
      <div className="relative overflow-hidden w-11/12 md:w-5/6 rounded-lg">
        <div
          className="flex transition-transform duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((item, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 flex flex-col md:flex-row gap-4 align-top"
            >
              <div className="w-full md:w-1/3 p-4 flex flex-col gap-2 bg-slate-200">
                <h2 className="text-lg md:text-xl font-bold">{item.title}</h2>
                <p className="flex-1 text-sm md:text-base">{item.content}</p>
                <Link
                  href={item.link}
                  className="w-fit self-end bg-primary text-white px-4 py-2 rounded-lg text-sm md:text-base"
                >
                  {item.cta}
                </Link>
              </div>
              <div className="w-full md:w-2/3">
                <Image
                  src={item.image}
                  alt={`Slide ${index + 1}`}
                  width="500"
                  height="300"
                  className="w-full h-40 md:h-64 object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="self-en flex gap-2 m-4">
        <button
          onClick={handlePrev}
          className="px-3 py-1 text-sm md:px-4 md:py-2 bg-slate-200 rounded-full hover:bg-slate-300"
        >
          ◀
        </button>
        <button
          onClick={handleNext}
          className="px-3 py-1 text-sm md:px-4 md:py-2 bg-slate-200 rounded-full hover:bg-slate-300"
        >
          ▶
        </button>
      </div>
    </div>
  )
}

export default Carousel
