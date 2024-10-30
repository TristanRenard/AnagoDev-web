import Plausible from "@/components/Plausible"
import { Toaster } from "@/components/ui/toaster"
import "@/styles/globals.css"
import { Analytics } from "@vercel/analytics/react"


const App = ({ Component, pageProps }) => (
  <div className="min-h-screen flex flex-col">
    < Component {...pageProps} />
    <Toaster />
    <Analytics />
    <Plausible />
  </div>
)

export default App
