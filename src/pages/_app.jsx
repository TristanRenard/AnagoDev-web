import { Toaster } from "@/components/ui/toaster"
import "@/styles/globals.css"

const App = ({ Component, pageProps }) => (
  <div className="min-h-screen flex flex-col">
    < Component {...pageProps} />
    <Toaster />
  </div>
)

export default App
