import Image from "next/image"

const ImageTextBlock = ({ titre, texte, image, isLeft = false }) => (
  <div className="flex flex-col md:flex-row items-center gap-8 mb-32">
    {isLeft && (
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl font-bold mb-2">{titre}</h2>
        <p className="text-lg text-justify">{texte}</p>
      </div>
    )}

    <div className="w-full md:w-1/2">
      <Image
        width={1920}
        height={1080}
        src={image}
        alt={titre}
        className="w-full h-auto rounded-xl max-h-[200px]"
      />
    </div>

    {!isLeft && (
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl font-bold mb-2">{titre}</h2>
        <p className="text-lg text-justify">{texte}</p>
      </div>
    )}
  </div>
)

export default ImageTextBlock
