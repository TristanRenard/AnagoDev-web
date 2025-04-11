import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserRound } from "lucide-react"
import { useI18n } from "@/locales"
import Link from "next/link"
import axios from "axios"

const IconProfil = () => {
  const t = useI18n()
  const handleLogout = async () => {
    try {
      const res = axios.delete("/api/user/login")

      if (res.ok) {
        window.location.href = "/"
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
