import ImageTextBlock from "@/components/home/ImageTextBlock"
import { useI18n } from "@/locales"

const Description = () => {
  const t = useI18n()

  return (
    <div className="mx-24 my-16">
      <h2 className="text-5xl font-medium mb-6">{t("About")}</h2>
      <ImageTextBlock
        titre={t("Proximity")}
        texte={t(
          "Our Cyna CERT team is at your side in the event of an attack, ensuring investigation, eradication and remediation to guarantee a rapid and effective response.",
        )}
        image="/Search.svg"
        isLeft
      />
      <ImageTextBlock
        titre={t("Expertise")}
        texte={t(
          "Certified cyber experts and in-depth knowledge of the SME market to offer you reliable solutions tailored to your needs.",
        )}
        image="/Avatar.svg"
      />
      <ImageTextBlock
        titre={t("Reactivity")}
        texte={t(
          "Protect your information system continuously with 24/7 monitoring to detect potential threats.",
        )}
        image="/Protection.svg"
        isLeft
      />
    </div>
  )
}

export default Description
