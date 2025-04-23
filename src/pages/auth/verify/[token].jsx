import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/router"
import { useState } from "react"

const Verify = ({ token }) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const handleVerify = () => {
    setLoading(true)
    axios.post("/api/user/verify", { verificationToken: token })
      .then(() => {
        toast({
          title: "Success",
          description: "Account verified",
          status: "success",
        })
        umami.track("navigate", {
          from: router.asPath,
          to: "/",
        })
        router.push("/")
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.response.data.message,
          status: "error",
        })
      }
      )
      .finally(() => setLoading(false))
  }

  return (
    <main className="flex flex-1 flex-col gap-4 justify-center items-center">
      {loading ?
        <Button className="font-normal" size="lg" disabled >
          <Loader2 className="mx-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
        :
        <Button className="font-bold text-xl" size="lg" onClick={handleVerify} >
          Verify Account
        </Button>
      }
    </main>
  )
}

export default Verify
const getServerSideProps = ({ params }) => {
  const { token } = params

  return { props: { token } }
}

export { getServerSideProps }
