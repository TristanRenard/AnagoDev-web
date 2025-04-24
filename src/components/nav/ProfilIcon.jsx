import Link from "@/components/CustomLink"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { useI18n } from "@/locales"
import axios from "axios"
import { UserRound } from "lucide-react"
import { useRouter } from "next/router"

const IconProfil = ({ isAdmin }) => {
  const t = useI18n()
  const router = useRouter()
  const handleLogout = async () => {
    try {
      const res = await axios.delete("/api/user/login")

      if (res.statusText === "OK") {
        umami.track("logout")
        toast({
          title: "Success",
          description: t("Vous êtes déconnecté"),
          status: "success",
        })
        umami.track("navigate", {
          from: router.asPath,
          to: "/",
        })
        router.push("/")
        router.reload()
      } else {
        console.error("Erreur lors de la déconnexion")
      }
    } catch (err) {
      console.error("Erreur réseau :", err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserRound className="h-8 w-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href="/profile">{t("Mon profil")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/orders">{t("Mes commandes")}</Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem>
            <Link href="/backoffice/">{t("Backoffice")}</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <button onClick={handleLogout}>{t("Deconnexion")}</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default IconProfil