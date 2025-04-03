import Footer from "@/components/nav/Footer"
import NavBar from "@/components/nav/NavBar"
import { Toaster } from "@/components/ui/toaster"
import { I18nProvider } from "@/locales"
import "@/styles/globals.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Script from "next/script"

const queryClient = new QueryClient()
const App = ({ Component, pageProps }) => (
  <>
    <Script
      src="http://localhost:30938/script.js"
      data-website-id="ddb11268-73cc-46eb-901d-06aadcd78d60"
      strategy="afterInteractive"
    />
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col">
          <NavBar {...pageProps} />
          <Component {...pageProps} />
          <Footer />
          <Toaster />
        </div>
      </QueryClientProvider>
    </I18nProvider>
  </>
)

export default App
