import { useI18n } from "@/locales"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useRouter } from "next/router"
import { PhoneInput } from "@/components/ui/phone-input"

const Account = () => {
  const t = useI18n()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const { isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await axios("/api/me")
        setUser(res.data.user)
      } catch (error) {
        router.push("/auth/login")
      }
    },
  })
  const sendAccountDeletionEmail = async () => {
    const res = await axios.post("/api/user/accountDeletion", {
      email: user.email,
    })

    if (res.status === 200) {
      toast({
        title: "Success",
        description: "Account deletion email sent, please check your email.",
        status: "success",
      })
    }
  }

  if (isLoading || !user) {
    return (
      <div className="flex-1 flex justify-center items-center gap-2">
        <LoaderCircle className="h-8 w-8 text-primary animate-spin" />
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col w-full p-4">
      <table>
        <tbody>
          <Row
            title={t("First name")}
            value={user.firstName}
            field="firstName"
          />
          <Row title={t("Last name")} value={user.lastName} field="lastName" />
          <Row title={t("Email")} value={user.email} field="email" />
          <Row title={t("Phone number")} value={user.phone} field="phone" />
        </tbody>
      </table>
      <Dialog>
        <DialogTrigger className="self-end mt-auto text-white p-2 rounded-md bg-red-500 hover:bg-red-600">
          <button>{t("Delete my account")}</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
              <Button
                onClick={() => sendAccountDeletionEmail()}
                className="absolute bottom-0 right-0 m-4"
              >
                {t("Yes")}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
const Row = ({ title, value, field }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedValue, setEditedValue] = useState(value)
  const saveModification = async () => {
    await axios.put("/api/user/modifyDetails", {
      field,
      editedValue,
    })
  }

  return (
    <tr>
      <th className="text-left w-48">{title}</th>
      <td className="text-left w-96">
        {isEditing
          ? field !== "email" &&
            (field === "phone" ? (
              <PhoneInput
                value={editedValue}
                onChange={(newValue) => {
                  if (newValue !== "") {
                    setEditedValue(newValue)
                  }
                }}
              />
            ) : (
              <input
                type="text"
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                className="border rounded p-1"
              />
            ))
          : editedValue}
      </td>
      {field !== "email" && (
        <td>
          <Button
            onClick={() => {
              setIsEditing(!isEditing)

              if (isEditing && editedValue !== "") {
                saveModification()
              }
            }}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
        </td>
      )}
    </tr>
  )
}

export default Account
