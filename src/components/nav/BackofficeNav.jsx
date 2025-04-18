import { useI18n } from "@/locales"
import clsx from "clsx"
import Link from "next/link"

const links = {
  dashboard: "/backoffice",
  users: "/backoffice/users",
  products: "/backoffice/products",
  categories: "/backoffice/categories",
  orders: "/backoffice/orders",
  translations: "/backoffice/trads",
  mediatech: "/backoffice/upload",
  settings: "/backoffice/homepage",
}
const BackofficeNav = () => {
  const t = useI18n()

  return (
    <nav className="w-full sticky top-0 p-6">
      <ul className="flex flex-col gap-4">
        {
          Object.keys(links).map((link, index) => (
            <li className="w-full flex" key={index}>
              <Link className={clsx("bg-gray-100 p-2 rounded-sm capitalize w-full truncate flex-1", window.location.href.endsWith(links?.[link]) && "bg-purple-500 text-white font-bold", link === "dashboard" && "font-bold")} href={links?.[link]}>{t(link)}</Link>
            </li>
          ))
        }
      </ul>
    </nav>
  )
}

export default BackofficeNav