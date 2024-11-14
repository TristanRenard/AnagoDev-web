import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Langs from "@/lib/langs"
import { useChangeLocale, useCurrentLocale, useI18n } from "@/locales"

const Footer = () => {
  const t = useI18n()
  const changeLocale = useChangeLocale()
  const locale = useCurrentLocale()
  const handleChangeLocale = (value) => {
    changeLocale(value)
  }

  return (
    <footer className="flex flex-col sm:flex-row gap-2 text-white items-center justify-between bg-gradient-to-r from-[#420A8F] to-[#240198] p-4">
      <p className="flex items-center">
        {t("All rights reserved")} &copy; {new Date().getFullYear()} - Cyna
      </p>
      <div className="flex gap-2 items-center">
        <Label className="font-bold">{t("Languages")} :</Label>
        <Select onValueChange={handleChangeLocale}>
          <SelectTrigger className="w-[180px] text-black">
            <SelectValue placeholder={Langs[locale].title} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.keys(Langs).map((key) => (
                <SelectItem key={key} value={key}>
                  {Langs[key].title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </footer >
  )
}

export default Footer