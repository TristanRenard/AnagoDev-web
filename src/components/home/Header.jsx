import { useI18n } from "@/locales"
import Image from "next/image"


const Header = () => {
  const t = useI18n()

  return (
    <header className="flex flex-col gap-8 min-h-[70vh] py-28 justify-center items-center bg-gradient-to-r from-[#420A8F] to-[#240198]">
      <h1 className="font-bold text-4xl hidden">Cyna</h1>
      <Image
        className="h-24 w-auto "
        src="/logo.png"
        alt="logo"
        height={358}
        width={1080}
      />
      <h2 className="w-1/2 flex flex-col gap-4 md:flex-row justify-around font-semibold text-white text-xl">
        <span className="text-center">{t("Secure")}</span>
        <span className="text-center">{t("Protect")}</span>
        <span className="text-center">{t("Prevail")}</span>
      </h2>
    </header>
  )
}

export default Header