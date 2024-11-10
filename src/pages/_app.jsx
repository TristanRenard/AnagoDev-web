import { Toaster } from "@/components/ui/toaster"
import { I18nProvider } from "@/locales"
import "@/styles/globals.css"
import { Analytics } from "@vercel/analytics/react"


const App = ({ Component, pageProps }) => (
  <I18nProvider>
    <div className="min-h-screen flex flex-col">
      < Component {...pageProps} />
      <Toaster />
      <Analytics />
    </div>
  </I18nProvider>
)

export default App
