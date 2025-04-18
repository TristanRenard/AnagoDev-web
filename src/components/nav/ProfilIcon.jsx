import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useI18n } from "@/locales"
import axios from "axios"
import { UserRound } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"

const IconProfil = () => {
  const t = useI18n()
  const router = useRouter()
  const handleLogout = async () => {
    try {
      const res = await axios.delete("/api/user/login")

      if (res.statusText === "OK") {
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
          <button onClick={handleLogout}>{t("Deconnexion")}</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default IconProfil
