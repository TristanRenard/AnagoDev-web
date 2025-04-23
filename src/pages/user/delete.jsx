import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const DeletePage = () => {
  const [remainingTime, setRemainingTime] = useState(10)
  const router = useRouter()
  const { customerId } = router.query

  useEffect(() => {
    const deleteUser = async () => {
      if (!customerId) {
        return
      }

      try {
        const res = await axios.delete(
          `/api/user/delete?customerId=${customerId}`,
        )

        if (res.status === 200) {
          const interval = setInterval(() => {
            setRemainingTime((prev) => {
              if (prev === 0) {
                clearInterval(interval)
                umami.track("deleteUser", {
                  customerId,
                })
                umami.track("navigate", {
                  from: router.asPath,
                  to: "/auth/login",
                })
                router.push("/auth/login")

                return
              }

              // eslint-disable-next-line consistent-return
              return prev - 1
            })
          }, 1000)

          // eslint-disable-next-line consistent-return
          return () => clearInterval(interval)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error deleting user:", error)
      }
    }

    deleteUser()
  }, [customerId, router])

  return (
    <div className="flex-1">
      <h1>
        User deleted successfully, you will be redirect to the login page in{" "}
        {remainingTime}
      </h1>
    </div>
  )
}

export default DeletePage
