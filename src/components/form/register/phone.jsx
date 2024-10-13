import { FormInput, FormOTP } from "@/components/form/formInput"
import { CountryCodeSelect } from "@/components/form/phoneInput"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { track } from "@vercel/analytics"
import axios from "axios"
import { useEffect, useState } from "react"
import * as yup from "yup"

// eslint-disable-next-line max-lines-per-function
const PhoneRegister = ({ form, setStep, step }) => {
  const [code, setCode] = useState("")
  const [phone, setPhone] = useState("")
  const [waiting, setWaiting] = useState(false)
  const [otp, setOTP] = useState("")
  const [displayOTP, setDisplayOTP] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [OTPerror, setOTPError] = useState("")
  const sendOTP = async () => {
    track("sendOTP", {
      phone
    }
    )
    setWaiting(true)

    if (phone) {
      const res = await axios.post("/api/user/sendOTP", {
        phone
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
  const verifyOTP = async () => {
    try {
      const res = await axios.post("/api/user/verifyPhoneNumber", {
        phone,
        otp
      })

      if (res.status === 200) {
        setStep(step + 1)
      }
    }
    catch (err) {
      setOTPError(err?.response?.data?.message)
    }
  }

  useEffect(() => {
    if (otp.length === 6) {
      setOTPError("")
      verifyOTP()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp])

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-center font-bold text-xl">About you</h2>
      <div className="grid grid-cols-5 gap-3">
        <CountryCodeSelect form={form} value={code} setValue={setCode} className="col-start-1 col-end-3" />
        <FormInput
          form={form}
          name="phone"
          label="Phone"
          value={code}
          setValue={setPhone}
          validators={{
            onChange: yup.string().required().matches(/^\+[0-9]{1,3}[0-9]{6,14}$/u, "Phone number must be in international format")
          }}
          className="col-start-3 col-end-5"
          hideLabel
        />
        <Dialog aria-describedby="sms-verification">
          <DialogTrigger asChild>
            <Button type="submit" onClick={sendOTP} disabled={(waiting || remainingTime > 0) && false}>
              {(waiting) && "Sending OTP..."}
              {(!waiting && displayOTP) && `${remainingTime}s`}
              {(!waiting && !displayOTP) && "Send OTP"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="underline">
                SMS Verification
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center py-7">
              <FormOTP
                form={form}
                name="otp"
                label="OTP"
                setValue={setOTP}
                validators={{
                  onChange: yup.string().required().matches(/^[0-9]{6}$/u, "OTP must be 6 digits")
                }}
                error={OTPerror}
              />
            </div>
            <DialogFooter className="flex justify-between">
              <div className="w-full flex justify-between">
                <DialogClose asChild>
                  <Button variant="secondary">
                    Edit phone number
                  </Button>
                </DialogClose>
                <Button onClick={sendOTP} disabled={(remainingTime > 0) && false}>
                  {(waiting) && "Sending OTP..."}
                  {(!waiting && displayOTP) && `${remainingTime}s`}
                  {(!waiting && !displayOTP) && "Resend OTP"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
export default PhoneRegister