import BackofficeLayout from "@/components/layouts/BackofficeLayout"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/locales"
import authProps from "@/serverSideProps/authProps"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import clsx from "clsx"
import { X, Check } from "lucide-react"
import { useState } from "react"

// eslint-disable-next-line max-lines-per-function
const Users = () => {
  const t = useI18n()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => axios("/api/backoffice/users?backoffice=1"),
    refetchInterval: 1000 * 20,
  })
  const handleDelete = async (id, title) => {
    try {
      await axios.delete(`/api/products?id=${id}`)
      await queryClient.invalidateQueries("products")
      toast({
        title: t("Product deleted"),
        description: t(`Product ${title} deleted`),
        variant: "default",
      })
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Error deleting product"),
        variant: "destructive",
      })
    }
  }

  return (
    <BackofficeLayout>
      <div className="flex-1 flex flex-col h-full relative">
        <div className="flex flex-col items-start gap-5 m-4 py-8 px-4">
          <h1 className="text-3xl font-black">{t("Users")}</h1>
        </div>
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        )}
        {users && users.data && (
          <div className="flex-1 p-8">
            <div className="flex w-full justify-end pb-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Search..."
                  className="w-96"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full h-full p-4 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="h-fit">
                    <TableHead className="font-bold capitalize">
                      {t("ID")}
                    </TableHead>
                    <TableHead className="font-bold capitalize">
                      {t("Prénom")}
                    </TableHead>
                    <TableHead className="font-bold capitalize">
                      {t("Nom")}
                    </TableHead>
                    <TableHead className="font-bold capitalize">
                      {t("Email")}
                    </TableHead>
                    <TableHead className="font-bold capitalize">
                      {t("Téléphone")}
                    </TableHead>
                    <TableHead className="font-bold capitalize">
                      {t("Rôle")}
                    </TableHead>
                    <TableHead className="font-bold capitalize">
                      {t("Vérifié")}
                    </TableHead>
                    <TableHead className="font-bold">
                      {t("Créé le")}
                    </TableHead>
                    <TableHead className="font-bold capitalize">
                      {t("Actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="w-full overflow-y-scroll">
                  {users.data
                    .filter((user) => {
                      if (
                        search &&
                        !user.email.toLowerCase().includes(search.toLowerCase())
                      ) {
                        return false
                      }

                      return true
                    })
                    .map((user, i) => (
                      <TableRow
                        key={user.id}
                        className={clsx(i % 2 && "bg-gray-50 hover:bg-white")}
                      >
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.firstName}</TableCell>
                        <TableCell>{user.lastName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <select
                            value={user.role}
                            onChange={async (e) => {
                              const newRole = e.target.value

                              try {
                                await axios.patch("/api/backoffice/users?backoffice=1", {
                                  id: user.id,
                                  role: newRole,
                                })
                                await queryClient.invalidateQueries(["users"])
                                toast({
                                  title: t("Role updated"),
                                  description: t(`Role for ${user.email} is now ${newRole}`),
                                })
                              } catch (err) {
                                toast({
                                  title: t("Error"),
                                  description: t("Failed to update user role"),
                                  variant: "destructive",
                                })
                              }
                            }}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          {user.isVerified ? (
                            <Check className="text-green-500" />
                          ) : (
                            <X className="text-red-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString(
                            "fr-FR",
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {/* <button
                              className="text-blue-500 underline"
                              onClick={() => handleEdit(user.id)}
                            >
                              {t("Modifier")}
                            </button> */}
                            <button
                              className="text-red-500 underline"
                              onClick={() => handleDelete(user.id)}
                            >
                              {t("Supprimer")}
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </BackofficeLayout>
  )
}

export default Users

export const getServerSideProps = async (context) => {
  const { user } = await authProps(context)

  if (!user || user.role !== "admin") {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user,
    },
  }
}
