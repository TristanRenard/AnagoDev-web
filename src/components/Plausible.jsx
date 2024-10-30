
import { useEffect } from "react"

const Plausible = () => {
  useEffect(() => {
    const script = document.createElement("script")
    script.setAttribute("data-domain", "anagodev.com")
    script.setAttribute("src", "https://analytics.roksblog.de/js/script.js")
    script.defer = true
    document.head.appendChild(script)
  }, [])

  return null
}

export default Plausible
