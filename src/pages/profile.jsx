/* eslint-disable no-nested-ternary */
import { useI18n } from "@/locales"
import axios from "axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { LoaderCircle, User } from "lucide-react"
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

const Profile = () => {
  const t = useI18n()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [userAddress, setUserAddress] = useState(null)
  const { isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await axios("/api/me")
        setUser(res.data.user)
        setUserAddress(res.data.userAddress[0])
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

  console.log(userAddress)

  return (
    <div className="flex-1 flex justify-center py-10 bg-gray-100 min-h-screen">
      <div className="w-full max-w-4xl space-y-8 px-4">
        <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <User size={48} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-700">
            {t("Personal information")}
          </h2>
          <div className="divide-y divide-gray-200">
            <table className="w-full text-sm">
              <tbody>
                <Row
                  title={t("First name")}
                  value={user.firstName}
                  field="firstName"
                />
                <Row
                  title={t("Last name")}
                  value={user.lastName}
                  field="lastName"
                />
                <Row
                  title={t("Phone number")}
                  value={user.phone}
                  field="phone"
                />
                <Row
                  title={t("Street")}
                  value={userAddress.street}
                  field="street"
                />
                <Row
                  title={t("City")}
                  value={userAddress.city ?? "-"}
                  field="city"
                />
                <Row
                  title={t("State")}
                  value={userAddress.state ?? "-"}
                  field="state"
                />
                <Row
                  title={t("Zip")}
                  value={userAddress.zip ?? "-"}
                  field="zip"
                />
                <Row
                  title={t("Country")}
                  value={userAddress.country ?? "-"}
                  field="country"
                />
                <Row
                  title={t("Complement")}
                  value={userAddress.complement ?? "-"}
                  field="complement"
                />
                <Row
                  title={t("Name")}
                  value={userAddress.name ?? "-"}
                  field="name"
                />
                <Row
                  title={t("Is default")}
                  value={
                    userAddress.isDefault === true ? t("True") : t("False")
                  }
                  field="isDefault"
                />
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-red-500">
          <h2 className="text-lg font-semibold mb-4 text-red-600">
            {t("Danger Zone")}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {t(
              "Delete your account permanently. This action cannot be undone.",
            )}
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                {t("Delete my account")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("Are you absolutely sure?")}</DialogTitle>
                <DialogDescription>
                  {t(
                    "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => sendAccountDeletionEmail()}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {t("Yes, delete it")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
const Row = ({ title, value, field }) => {
  const t = useI18n()
  const [isEditing, setIsEditing] = useState(false)
  const [editedValue, setEditedValue] = useState(value)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async () => {
      await axios.put("/api/user/modifyDetails", {
        field,
        editedValue,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })
  const handleSave = () => {
    if (editedValue && editedValue !== value) {
      mutation.mutate()
    }

    setIsEditing(false)
  }

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <th className="py-2 px-4 text-left text-sm font-bold text-gray-700 w-48">
        {title}
      </th>
      <td className="py-2 px-4 text-left text-sm text-gray-900 w-96">
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
        <td className="py-2 px-4 text-right space-x-2">
          <Button
            onClick={() => {
              if (isEditing) {
                handleSave()
              } else {
                setIsEditing(true)
              }
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isEditing ? "bg-green-600 hover:bg-green-500 text-white" : ""
            }`}
            disabled={mutation.isPending}
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

          {isEditing && (
            <Button
              onClick={() => {
                setEditedValue(value)
                setIsEditing(false)
              }}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-red-600 hover:bg-red-500 text-white"
            >
              <span className="flex items-center gap-2">
                <span>{t("Cancel")}</span>
              </span>
            </Button>
          )}
        </td>
      )}
    </tr>
  )
}

export default Profile
