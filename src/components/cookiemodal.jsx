import { useRouter } from "next/router"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog"
import { useEffect, useState } from "react"

const CookieModal = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const handleCookiePolicy = (value) => {
    setIsOpen(false)
    document.cookie = `cookiePolicy=${value}; max-age=31536000;`
    router.reload()
  }

  useEffect(() => {
    if (!document.cookie.includes("cookiePolicy")) {
      setIsOpen(true)
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={() => handleCookiePolicy(false)}>
      <DialogContent className="flex flex-col items-center justify-center text-center">
        <DialogTitle className="text-2xl font-bold">
          Police des cookies 🚔
        </DialogTitle>
        Police des cookies, garez le véhicule sur la chaussée et montrer vos
        papiers.
        <div className="flex w-full items-center justify-center gap-2">
          <Button className="w-fit" onClick={() => handleCookiePolicy(true)}>
            Accepter le contrôle
          </Button>
          <Button className="w-fit" onClick={() => handleCookiePolicy(false)}>
            Hésiter
          </Button>
          <Button
            className="w-fit"
            onClick={() => router.push("https://www.google.com")}
          >
            Refuser d'obtempérer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CookieModal
