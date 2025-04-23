import ConsentsEmailAndSms from "@/components/form/register/consents"
import EmailAndPassWord from "@/components/form/register/emailAndPassWord"
import FirstNameLastName from "@/components/form/register/firstNameLastName"
import PhoneRegister from "@/components/form/register/phone"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "@tanstack/react-form"
import { yupValidator } from "@tanstack/yup-form-adapter"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

// eslint-disable-next-line max-lines-per-function
const Register = () => {
  const [step, setStep] = useState(1)
  const [disableNext, setDisableNext] = useState(false)
  const [disablePrev] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const handleSubmit = async ({ value }) => {
    try {
      const res = await axios.post("/api/user/register", value)

      if (res.status === 201) {
        umami.track("registerSuccess", {
          ...value,
          // eslint-disable-next-line no-undefined
          password: Boolean(value.password),
          // eslint-disable-next-line no-undefined
          confirmPassword: Boolean(value.confirmPassword),
        })
        toast({
          title: "Success",
          description: "Account created check your email to verify",
          status: "success",
        })
        umami.track("navigate", {
          from: router.asPath,
          to: "/",
        })
        router.push("/")
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
      setError(err.response.data.message ?? "An error occured")
    }
  }
  const form = useForm({
    validatorAdapter: yupValidator(),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      otp: "",
      consentMail: false,
      consentConditions: false,
    },
    onSubmit: (values) => handleSubmit(values),
  })

  useEffect(() => {
    if (step === 5) {
      form.handleSubmit()
    }
  }, [step])

  return (
    <div className="flex-1 flex justify-center items-center flex-col gap-24 p-5">
      <h1 className="font-bold text-4xl">Register</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        className="flex flex-col gap-4 border p-9 rounded-lg w-11/12 sm:w-3/5 lg:h-2/5 xl:w-1/3"
      >
        {step === 1 && (
          <FirstNameLastName form={form} setDisableNext={setDisableNext} />
        )}
        {step === 2 && (
          <EmailAndPassWord form={form} setDisableNext={setDisableNext} />
        )}
        {step === 3 && (
          <PhoneRegister
            form={form}
            setDisableNext={setDisableNext}
            step={step}
            setStep={setStep}
          />
        )}
        {step === 4 && (
          <ConsentsEmailAndSms form={form} setDisableNext={setDisableNext} />
        )}
        {step === 5 && (
          <div>
            <p>{error || "Your account has been created."}</p>
          </div>
        )}
        <Separator className="mt-8 w-11/12 self-center" />
        <div className="flex justify-between pt-1">
          <Button
            type="submit"
            variant="secondary"
            disabled={step <= 1 || disablePrev}
            onClick={() => {
              setStep(step - 1)
            }}
          >
            Précédent
          </Button>
          <Button
            type={step === 4 ? "submit" : "button"}
            disabled={step >= 5 || disableNext}
            onClick={() => {
              if (step <= 4) {
                setStep((prev) => prev + 1)
              }
            }}
          >
            {step === 4 ? "Submit" : "Suivant"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Register
