import { useI18n } from "@/locales"
import confetti from "canvas-confetti"
import { CircleCheckBig } from "lucide-react"
import { useEffect } from "react"

const Sucess = () => {
  const t = useI18n()
  const startConfettiRain = () => {
    confetti({
      particleCount: 200,
      spread: 360,
      startVelocity: 50,
      origin: { x: 0.5, y: 0.5 },
      shapes: ["square"],
    })
  }
  const handleConfettiClick = (event) => {
    const x = event.clientX / window.innerWidth
    const y = event.clientY / window.innerHeight

    confetti({
      particleCount: 100,
      spread: 60,
      origin: { x, y },
      shapes: ["square"],
    })
  }

  useEffect(() => {
    startConfettiRain()
  }, [])

  return (
    <main
      className="flex flex-1 flex-col gap-8 justify-center items-center"
      onClick={handleConfettiClick}
    >
      <h1 className="flex text-3xl font-black gap-4 items-center">
        <CircleCheckBig className="h-8 w-8 text-green-400 text-success" /> {t("success")}
      </h1>
      <div>
        <p className="text-center">
          {t("Thank you for your submission! Now you can go to your account to see your orders.")}
        </p>
        <p className="text-center">
          {t("We will send you an email with the activation code.")}
        </p>
      </div>
    </main>
  )
}

export default Sucess