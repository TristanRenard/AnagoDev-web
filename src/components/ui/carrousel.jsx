import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"

const slides = [
  {
    title: "title 1",
    content:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publ.",
    image:
      "https://blog.personal.com.py/wp-content/uploads/2023/03/como-funciona-chat-gpt-inteligencia-artificial.jpg",
    link: "/card",
    cta: "Voir",
  },
  {
    title: "title 2",
    content:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publ.",
    image:
      "https://blog.personal.com.py/wp-content/uploads/2023/03/como-funciona-chat-gpt-inteligencia-artificial.jpg",
    link: "/card",
    cta: "Voir",
  },
  {
    title: "title 3",
    content:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publ.",
    image:
      "https://blog.personal.com.py/wp-content/uploads/2023/03/como-funciona-chat-gpt-inteligencia-artificial.jpg",
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
    <div className="w-full mx-auto">
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((item, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 flex gap-4 align-top"
            >
              <div className="w-1/3 p-4 flex flex-col gap-2">
                <h2 className="text-xl font-bold">{item.title}</h2>
                <p className="flex-1">{item.content}</p>
                <Link
                  href={item.link}
                  className="w-fit justify-self-end bg-primary text-white px-4 py-2 rounded-lg"
                >
                  {item.cta}
                </Link>
              </div>
              <div className="w-2/3">
                <Image
                  src={item}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end slides-center gap-4 mt-4">
        <button
          onClick={handlePrev}
          className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
        >
          ◀
        </button>
        <button
          onClick={handleNext}
          className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
        >
          ▶
        </button>
      </div>
    </div>
  )
}

export default Carousel
