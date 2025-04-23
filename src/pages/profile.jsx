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
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { PhoneInput } from "@/components/ui/phone-input"

const Profile = () => {
  const t = useI18n()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [userAddress, setUserAddress] = useState(null)
  const [editing, setEditing] = useState(false)
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
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (modifiedFields) => {
      await Promise.all(
        modifiedFields.map(({ field, editedValue }) =>
          axios.put("/api/user/modifyDetails", { field, editedValue }),
        ),
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })
  const [editedFields, setEditedFields] = useState({})
  const handleEdit = (field, value) => {
    setEditedFields((prev) => ({ ...prev, [field]: value }))
  }
  const handleSaveAll = () => {
    const modifiedFields = Object.entries(editedFields)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([field, editedValue]) => ({ field, editedValue }))

    if (modifiedFields.length > 0) {
      mutation.mutate(modifiedFields)
    }

    setEditing(false)
    setEditedFields({})
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
                  editing={editing}
                  onEdit={handleEdit}
                />
                <Row
                  title={t("Last name")}
                  value={user.lastName}
                  field="lastName"
                  editing={editing}
                  onEdit={handleEdit}
                />
                <Row
                  title={t("Phone number")}
                  value={user.phone}
                  field="phone"
                  editing={editing}
                  onEdit={handleEdit}
                />
                <Row
                  title={t("Street")}
                  value={userAddress?.street ?? "-"}
                  field="street"
                  editing={editing}
                  onEdit={handleEdit}
                />
                <Row
                  title={t("City")}
                  value={userAddress?.city ?? "-"}
                  field="city"
                  editing={editing}
                  onEdit={handleEdit}
                />
                <Row
                  title={t("State")}
                  value={userAddress?.state ?? "-"}
                  field="state"
                  editing={editing}
                  onEdit={handleEdit}
                />
                <Row
                  title={t("Zip")}
                  value={userAddress?.zip ?? "-"}
                  field="zip"
                  editing={editing}
                  onEdit={handleEdit}
                />
                <Row
                  title={t("Country")}
                  value={userAddress?.country ?? "-"}
                  field="country"
                  editing={editing}
                  onEdit={handleEdit}
                />
                <Row
                  title={t("Complement")}
                  value={userAddress?.complement ?? "-"}
                  field="complement"
                  editing={editing}
                  onEdit={handleEdit}
                />
                <Row
                  title={t("Name")}
                  value={userAddress?.name ?? "-"}
                  field="name"
                  editing={editing}
                  onEdit={handleEdit}
                />
                <Row
                  title={t("Is default")}
                  value={
                    userAddress?.isDefault === true ? t("True") : t("False")
                  }
                  field="isDefault"
                  editing={editing}
                  onEdit={handleEdit}
                />
              </tbody>
            </table>
          </div>
          {!editing ? (
            <div className="mt-4">
              <Button onClick={() => setEditing(true)}>{t("Modify")}</Button>
            </div>
          ) : (
            <div className="flex gap-4 mt-4">
              <Button
                onClick={handleSaveAll}
                className="bg-green-600 hover:bg-green-500 text-white"
              >
                {t("Save")}
              </Button>
              <Button
                onClick={() => {
                  setEditing(false)
                  setEditedFields({})
                }}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                {t("Cancel")}
              </Button>
            </div>
          )}
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
const Row = ({ title, value, field, editing, onEdit }) => {
  const isPhoneField = field === "phone"
  const [inputValue, setInputValue] = useState(value === "-" ? "" : value)

  useEffect(() => {
    setInputValue(value === "-" ? "" : value)
  }, [value])

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <th className="py-2 px-4 text-left text-sm font-bold text-gray-700 w-48">
        {title}
      </th>
      <td className="py-2 px-4 text-left text-sm text-gray-900 w-96">
        {editing && field !== "email" ? (
          isPhoneField ? (
            <PhoneInput
              value={inputValue}
              onChange={(val) => {
                setInputValue(val)
                onEdit(field, val)
              }}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                onEdit(field, e.target.value)
              }}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          )
        ) : (
          <span className="inline-block py-1">{value}</span>
        )}
      </td>
    </tr>
  )
}

export default Profile
