/* eslint-disable max-lines-per-function */
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import User from "@/db/models/User"
import knexInstance from "@/lib/db"
import { useI18n } from "@/locales"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useRef, useState } from "react"

const Traductions = () => {
  const [texts, setTexts] = useState([])
  const [key, setKey] = useState("")
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: ["translations"], queryFn: () => axios(`/api/temp/translations`) })
  const valueRef = useRef()
  const t = useI18n()
  const deleteTraduction = async (dkey) => {
    await axios.delete(`/api/temp/translations?key=${dkey}`)
    await queryClient.invalidateQueries("translations")
  }
  const usage = useQuery({ queryKey: ["usage"], queryFn: () => axios.options("/api/temp/translations") })
  const mutation = useMutation({
    mutationFn: async () => {
      const postData = {
        texts
      }

      if (valueRef.current.value) {
        postData.texts.push(valueRef.current.value)
      }

      if (key) {
        postData.key = key
      }

      await axios.post("/api/temp/translations", postData)

      await setTexts([])
      await setKey("")
      await valueRef.current.focus()
    },
    onSuccess: () => {
      queryClient.invalidateQueries("translations")
      queryClient.invalidateQueries("usage")
    },
  })

  return (
    <div className="flex-1 flex flex-col max-h-screen">
      <h1 className="p-8 font-black text-2xl py-8">{t("Traductions")}</h1>

      {/* <!-- Form with one input for the key and one input for a text and a button to add the text to the list of texts --> */}
      <form className="flex flex-col gap-2 px-8 max-w-96" onSubmit={(e) => {
        e.preventDefault()

        if (e.target.text.value) {
          setTexts([...texts, e.target.text.value])
        }

        e.target.text.value = ""
      }
      }>
        <Label htmlFor="key">{t("Key")}</Label>
        <Input type="text" name="key" value={key} onChange={(e) => setKey(e.target.value)} />
        <Label htmlFor="text">{t("Text")}</Label>
        <Input ref={valueRef} type="text" name="text" />
        <Button type="submit">{t("Add text")}</Button>
        {/* <!-- List of texts --> */}
        {texts.length >= 1 && <ul className="list-disc px-8">
          {texts.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>}
        {texts.length >= 1 && <Separator />}

        {/* <!-- Button to send the texts to the server --> */}
        <Button onClick={() => mutation.mutate()}>{t("Send texts")}</Button>
        {usage.isSuccess && (
          <HoverCard>
            <HoverCardTrigger>
              <p>{t("Usage")}: {usage.data.data.count} / {usage.data.data.limit}</p>
              <Progress value={(usage.data.data.count / usage.data.data.limit) * 100} />
            </HoverCardTrigger>
            <HoverCardContent className="w-full mx-8">
              <h5 className="font-black">
                {t("Use deepL API to translate texts")}
              </h5>
              <p>
                {t("The usage is calculated by the number of characters translated. The usage is reset every month.")}
              </p>
              <p>
                <b>{t("Limit")} :</b> {usage.data.data.limit}
              </p>
              <p>
                <b>{t("Used")} :</b> {usage.data.data.count}
              </p>
              <p>
                <b>{t("Remaining")} :</b> {usage.data.data.limit - usage.data.data.count}
              </p>
            </HoverCardContent>

          </HoverCard>
        )}
      </form>


      {/* <--! List of translations --> */}
      <section className="p-8 m-8 border rounded-md h-fit overflow-scroll">
        {query.isLoading && <p>Loading...</p>}
        {query.isError && <p>Error: {query.error.message}</p>}
        {query.isSuccess && query.data.data[0]?.value && (
          <Table className="h-fit overflow-scroll">
            <TableHeader>
              <TableRow className="sticky top-0 bg-white font-bold">
                <TableHead>{t("Key")}</TableHead>
                <>
                  {Object.keys(query.data.data[0].value).map((lang, index) => (
                    <TableHead key={index}>{lang}</TableHead>
                  ))}
                </>
                <TableHead>{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.data.data.map(({ key: k, value }) => (
                <TableRow key={k}>
                  <TableCell>{k}</TableCell>
                  <>
                    {Object.values(value).map((v, index) => (
                      <TableCell key={index}>{v}</TableCell>
                    ))}
                  </>
                  <TableCell>
                    <Button onClick={() => deleteTraduction(k)}>{t("Delete")}</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  )
}

export default Traductions

export const getServerSideProps = async (context) => {
  const userData = context.req.headers["x-user-data"]

  if (!userData) {
    return {
      notFound: true,
    }
  }

  const user = await User.query(knexInstance).findOne({
    id: userData
  })

  if (!user || !user.isAdmin) {
    return {
      notFound: true,
    }
  }

  return {
    props: {},
  }
}
