import { FormInput } from "@/components/form/formInput"
import { useEffect, useState } from "react"
import * as yup from "yup"

const formValidator = yup.object().shape({
  email: yup.string().email().required(),
  passwordValidator: yup
    .string()
    .required()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/u,
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character",
    ),
  confirmPasswordValidator: yup
    .string()
    .required("Confirm password is required"),
})
const EmailAndPassWord = ({ form, setDisableNext }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [emailIsValid, setEmailIsValid] = useState(false)
  const [passwordIsValid, setPasswordIsValid] = useState(false)
  const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState(false)

  useEffect(() => {
    if (setDisableNext) {
      setDisableNext(
        !(emailIsValid && passwordIsValid && confirmPasswordIsValid),
      )
    }
  }, [setDisableNext, emailIsValid, passwordIsValid, confirmPasswordIsValid])

  useEffect(() => {
    if (password !== confirmPassword) {
      setError("Passwords must match")
    } else {
      setError("")
      setConfirmPasswordIsValid(true)
    }
  }, [password, confirmPassword])

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-center font-bold text-xl">About you</h2>
      <FormInput
        validators={{
          onChange: formValidator.fields.email,
        }}
        value={email}
        setValue={setEmail}
        form={form}
        name="email"
        label="Email"
        type="email"
        setIsValid={setEmailIsValid}
      />
      <FormInput
        validators={{
          onChange: formValidator.fields.passwordValidator,
        }}
        value={password}
        form={form}
        name="password"
        label="Password"
        type="password"
        setValue={setPassword}
        setIsValid={setPasswordIsValid}
      />
      <FormInput
        validators={{
          onChange: formValidator.fields.confirmPasswordValidator,
        }}
        form={form}
        name="confirmPassword"
        label="ConfirmPassword"
        type="password"
        value={confirmPassword}
        setValue={setConfirmPassword}
        error={error}
        setIsValid={setConfirmPasswordIsValid}
      />
    </div>
  )
}

export default EmailAndPassWord
