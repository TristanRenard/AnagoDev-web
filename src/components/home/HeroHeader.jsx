import { useI18n } from "@/locales"
import Image from "next/image"

const HeroHeader = () => {
  const t = useI18n()

  return (
    <>
      {/* Affichage uniquement sur écrans larges */}
      <div className="relative flex flex-col pt-36 hidden md:flex">
        <div className="absolute" style={{ top: "20%", right: "10%" }}>
          <Image
            src="/logo_cyna_black.png"
            alt="logo"
            width={200}
            height={100}
          />
          <h1 className="text-4xl font-bold">
            {t("Secure")}{" "}
            <span className="text-purple-600">{t("your future")}</span>
          </h1>
          <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-full text-md">
            Call to action
          </button>
        </div>
        <Image
          src="/phone.png"
          alt="background image"
          width={200}
          height={100}
          className="object-cover w-4/5 self-end hidden md:hidden"
        />
        <Image
          src="/phone_with_hand.png"
          alt="background image"
          width={200}
          height={100}
          className="object-cover w-4/5 self-end block md:block"
        />
      </div>

      {/* Affichage sur écrans plus petits */}
      <div className="flex flex-col items-start md:hidden px-16 mt-16">
        <h1 className="text-[clamp(2rem,5vw,4rem)] font-bold w-full">
          {t("Secure")}{" "}
          <span className="text-purple-600">{t("your future")}</span>
        </h1>
        <button className="mt-2 bg-purple-600 text-white px-6 py-3 rounded-full text-md">
          Call to action
        </button>
        <Image
          src="/phone_cyna.png"
          alt="background image"
          width={200}
          height={100}
          className="w-full mt-16"
        />
      </div>
    </>
  )
}

export default HeroHeader
