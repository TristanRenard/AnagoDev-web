import { FormInput, FormOTP } from "@/components/form/formInput"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
// Iimport { useToast } from "@/hooks/use-toast"
import { useForm } from "@tanstack/react-form"
import { yupValidator } from "@tanstack/yup-form-adapter"
import axios from "axios"
import { useRouter } from "next/router"
// Iimport { useRouter } from "next/router"
import { useEffect, useState } from "react"
import * as yup from "yup"

// eslint-disable-next-line max-lines-per-function
const Login = () => {
  const [waiting, setWaiting] = useState(false)
  const [otp, setOTP] = useState("")
  const [displayOTP, setDisplayOTP] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [OTPerror, setOTPError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailIsValid, setEmailIsValid] = useState(false)
  const [passwordIsValid, setPasswordIsValid] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const handleSubmit = async ({ value }) => {
    try {
      const res = await axios.post("/api/user/login", value)

      if (res.status === 200) {
        umami.track("loginSuccess", {
          ...value,
          // eslint-disable-next-line no-undefined
          password: Boolean(value.password),
        })
        toast({
          title: "Success",
          description: res.data.message,
          status: "success",
        })
        router.push("/").then(() => {
          router.reload()
        })
      }
    } catch (err) {
      umami.track("registerError", {
        ...value,
        // eslint-disable-next-line no-undefined
        password: Boolean(value.password),
        // eslint-disable-next-line no-undefined
        confirmPassword: Boolean(value.confirmPassword),
      })
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response.data.message,
        status: "error",
      })
    }
  }
  const form = useForm({
    validatorAdapter: yupValidator(),
    defaultValues: {
      email: "",
      password: "",
      otp: "",
    },
    onSubmit: (values) => handleSubmit(values),
  })
  const sendOTP = async () => {
    umami.track("sendOTP", {
      email,
    })
    setWaiting(true)

    if (email) {
      const res = await axios.post("/api/user/sendOTP", {
        email,
      })

      if (res.status === 200) {
        setDisplayOTP(true)
        setRemainingTime(60)
        await document.getElementById("otp").focus()
        const interval = setInterval(() => {
          setRemainingTime((prev) => {
            if (prev === 0) {
              clearInterval(interval)
              setDisplayOTP(false)
            }

            return prev - 1
          })
        }, 1000)
      }
    }

    setWaiting(false)
  }
  useEffect(() => {
    if (otp.length === 6) {
      setOTPError("")
      form.handleSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp])

  return (
    <div className="flex-1 flex justify-center items-center flex-col gap-24 p-5">
      <h1 className="font-bold text-4xl">Login</h1>
      <form
        method="post"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()

          form.handleSubmit()
        }}
        className="flex flex-col gap-4 border p-9 rounded-lg w-11/12 sm:w-3/5 lg:h-2/5 xl:w-1/3"
      >
        <div className="flex flex-col gap-8">
          <FormInput
            form={form}
            name="email"
            label="Email"
            type="email"
            value={email}
            setValue={setEmail}
            validators={{
              onChange: yup.string().required().email(),
            }}
            setIsValid={setEmailIsValid}
          />
          <FormInput
            validators={{
              onChange: yup.string().required(),
            }}
            value={password}
            form={form}
            name="password"
            label="Password"
            type="password"
            setValue={setPassword}
            setIsValid={setPasswordIsValid}
          />
        </div>
        <Separator className="mt-8 w-11/12 self-center" />
        <div className="flex justify-between pt-1">
          {/* eslint-disable-next-line curly*/}
          <Dialog aria-describedby="sms-verification">
            <DialogTrigger asChild>
              <Button
                type="submit"
                disabled={
                  !passwordIsValid || !emailIsValid || remainingTime > 0
                }
                onClick={() => {
                  sendOTP()
                }}
              >
                Login
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="underline">
                  2FA Authentification
                </DialogTitle>
              </DialogHeader>
              <div className="flex justify-center py-7">
                <FormOTP
                  form={form}
                  name="otp"
                  label="OTP"
                  setValue={setOTP}
                  validators={{
                    onChange: yup
                      .string()
                      .required()
                      .matches(/^[0-9]{6}$/u, "OTP must be 6 digits"),
                  }}
                  error={OTPerror}
                />
              </div>
              <DialogFooter className="flex justify-between">
                <div className="w-full flex justify-between">
                  <DialogClose asChild>
                    <Button variant="secondary">Edit phone number</Button>
                  </DialogClose>
                  <Button
                    onClick={sendOTP}
                    disabled={remainingTime > 0 && false}
                  >
                    {waiting && "Sending OTP..."}
                    {!waiting && displayOTP && `${remainingTime}s`}
                    {!waiting && !displayOTP && "Resend OTP"}
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </div>
  )
}

export default Login
