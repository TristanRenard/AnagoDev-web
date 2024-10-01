import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { useRouter } from "next/router"

const Verify = ({ token }) => {
  const router = useRouter()
  const { toast } = useToast()
  const handleVerify = () => {
    axios.post("/api/user/verify", { verificationToken: token })
      .then(() => {
        toast({
          variant: "success",
          title: "Success",
          description: "Account verified",
          status: "success",
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
  }

  return (
    <main className="flex flex-1 flex-col gap-4 justify-center items-center">
      <Button className="font-black text-xl" size="lg" onClick={handleVerify}>Verify Account</Button>
    </main>
  )
}

export default Verify
const getServerSideProps = ({ params }) => {
  const { token } = params

  return { props: { token } }
}

export { getServerSideProps }
