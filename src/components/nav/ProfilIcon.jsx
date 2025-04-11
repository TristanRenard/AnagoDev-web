import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserRound } from "lucide-react"
import { useI18n } from "@/locales"
import Link from "next/link"

const IconProfil = () => {
  const t = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserRound className="h-8 w-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href="/profile">{t("Mon profil")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>{t("Deconnexion")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default IconProfil
