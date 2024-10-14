
import { FormInput } from "@/components/form/formInput"
import { useEffect, useState } from "react"
import * as yup from "yup"

const FirstNameValidator = yup.string().required().min(2).max(50)
const LastNameValidator = yup.string().required().min(2).max(50)
const FirstNameLastName = ({ form, setDisableNext }) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [firstNameIsValid, setFirstNameIsValid] = useState(false)
  const [lastNameIsValid, setLastNameIsValid] = useState(false)

  useEffect(() => {
    if (setDisableNext) {
      setDisableNext(!(firstNameIsValid && lastNameIsValid))
    }
  }, [firstNameIsValid, lastNameIsValid, setDisableNext])

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-center font-bold text-xl">About you</h2>
      <FormInput
        form={form}
        name="firstName"
        label="First Name"
        value={firstName}
        setValue={setFirstName}
        validators={{
          onChange: FirstNameValidator
        }}
        setIsValid={setFirstNameIsValid}
      />
      <FormInput
        form={form}
        name="lastName"
        label="Last Name"
        value={lastName}
        setValue={setLastName}
        validators={{
          onChange: LastNameValidator,
        }}
        setIsValid={setLastNameIsValid}
      />
    </div>
  )
}

export default FirstNameLastName