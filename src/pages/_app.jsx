import { Toaster } from "@/components/ui/toaster"
import { I18nProvider } from "@/locales"
import "@/styles/globals.css"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient()
const App = ({ Component, pageProps }) => (
  <I18nProvider>
    <QueryClientProvider client={queryClient}>

      <div className="min-h-screen flex flex-col">
        < Component {...pageProps} />
        <Toaster />
        <Analytics />
      </div>
    </QueryClientProvider>
  </I18nProvider>
)

export default App
