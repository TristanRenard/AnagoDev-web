import ChatBot from "@/components/ChatBot"
import Footer from "@/components/nav/Footer"
import NavBar from "@/components/nav/NavBar"
import { Toaster } from "@/components/ui/toaster"
import { I18nProvider } from "@/locales"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import axios from "axios"
import Script from "next/script"
import { useEffect, useState } from "react"

import "@/styles/globals.css"

const queryClient = new QueryClient()
const App = ({ Component, pageProps }) => {
  const [umamiScript, setUmamiScript] = useState(null)
  const [umamiWebsiteId, setUmamiWebsiteId] = useState(null)
  useEffect(() => {
    axios.get("/api/umami").then((response) => {
      setUmamiScript(response.data.umamiScript)
      setUmamiWebsiteId(response.data.umamiWebsiteId)
    })
  }, [])

  return (
    <>
      {umamiScript && umamiWebsiteId && (
        <Script
          async
          defer
          data-do-not-track="true"
          data-website-id={umamiWebsiteId}
          src={umamiScript}
          strategy="afterInteractive"
          onLoad={() => {
            console.log("umami loaded")
          }}
          onError={(e) => {
            console.error("Script failed to load", e)
          }}
        />
      )}

      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen flex flex-col">
            <NavBar {...pageProps} />
            <Component {...pageProps} />
            <Footer />
            <Toaster />
            <ChatBot />
          </div>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </I18nProvider>
    </>
  )
}

export default App
