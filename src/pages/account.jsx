/* eslint-disable no-nested-ternary */
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
  const t = useI18n()
  const [isEditing, setIsEditing] = useState(false)
  const [editedValue, setEditedValue] = useState(value)
  const saveModification = async () => {
    await axios.put("/api/user/modifyDetails", {
      field,
      editedValue,
    })
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <th className="py-4 px-6 text-left text-sm font-bold text-gray-700 w-48">
        {title}
      </th>
      <td className="py-4 px-6 text-left text-sm text-gray-900 w-96">
        {isEditing && field !== "email" ? (
          field === "phone" ? (
            <div className="relative">
              <PhoneInput
                value={editedValue}
                onChange={(newValue) => {
                  if (newValue !== "") {
                    setEditedValue(newValue)
                  }
                }}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ) : (
            <input
              type="text"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          )
        ) : (
          <span className="inline-block py-1">{editedValue}</span>
        )}
      </td>
      {field !== "email" && (
        <td className="py-4 px-6 text-right">
          <Button
            onClick={() => {
              setIsEditing(!isEditing)

              if (isEditing && editedValue !== "") {
                saveModification()
              }
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isEditing && "bg-green-600 hover:bg-green-500 text-white"
            }`}
          >
            {isEditing ? (
              <span className="flex items-center gap-2">
                <span>{t("Save")}</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>{t("Modify")}</span>
              </span>
            )}
          </Button>
        </td>
      )}
    </tr>
  )
}

export default Account
