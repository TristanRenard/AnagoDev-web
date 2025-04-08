import ImageTextBlock from "@/components/home/ImageTextBlock"
import { useI18n } from "@/locales"

const Description = () => {
  const t = useI18n()

  return (
    <div className="mx-24 my-16">
      <h2 className="text-5xl font-medium mb-6">{t("About")}</h2>
      <ImageTextBlock
        titre={t("Prevention")}
        texte={t(
          "Lorem ipsum dolor sit amet consectetur. Eget pharetra tristique lorem quam elementum mi massa. Elit pretium morbi elementum risus diam aenean enim feugiat gravida. Non nisl morbi donec sed massa fusce in eget. Lobortis semper eu pharetra tristique nec vulputate quam ornare. Sit dolor semper vitae at tellus sed risus at. Mi ipsum diam.",
        )}
        image="/Search.svg"
        isLeft
      />
      <ImageTextBlock
        titre={t("Protect your data")}
        texte={t(
          "Lorem ipsum dolor sit amet consectetur. Eget pharetra tristique lorem quam elementum mi massa. Elit pretium morbi elementum risus diam aenean enim feugiat gravida. Non nisl morbi donec sed massa fusce in eget. Lobortis semper eu pharetra tristique nec vulputate quam ornare. Sit dolor semper vitae at tellus sed risus at. Mi ipsum diam.",
        )}
        image="/Protection.svg"
      />
      <ImageTextBlock
        titre={t("Prevail your privacy")}
        texte={t(
          "Lorem ipsum dolor sit amet consectetur. Eget pharetra tristique lorem quam elementum mi massa. Elit pretium morbi elementum risus diam aenean enim feugiat gravida. Non nisl morbi donec sed massa fusce in eget. Lobortis semper eu pharetra tristique nec vulputate quam ornare. Sit dolor semper vitae at tellus sed risus at. Mi ipsum diam.",
        )}
        image="/Avatar.svg"
        isLeft
      />
    </div>
  )
}

export default Description
