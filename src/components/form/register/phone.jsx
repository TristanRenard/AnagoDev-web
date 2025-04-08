import { PhoneInput } from "@/components/ui/phone-input"
import { useI18n } from "@/locales"
import { useState, useEffect } from "react"
import * as yup from "yup"

const phoneRegex = /^\+?\d{10,15}$/u
const formValidator = yup.object().shape({
  phone: yup
    .string()
    .matches(phoneRegex, "Numéro de téléphone invalide")
    .required("Le numéro de téléphone est requis"),
})
const PhoneRegister = ({ form, setDisableNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [formErrors, setFormErrors] = useState({})
  const t = useI18n()

  useEffect(() => {
    setDisableNext(!phoneNumber)
    const validatePhoneNumber = async () => {
      try {
        await formValidator.validate(
          { phone: phoneNumber },
          { abortEarly: false },
        )
        setFormErrors({})
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const errors = {}
          error.inner.forEach((err) => {
            errors[err.path] = err.message
          })
          setFormErrors(errors)
        }
      }
    }

    if (phoneNumber) {
      validatePhoneNumber()
    } else {
      setFormErrors({})
    }
  }, [phoneNumber, setDisableNext])

  const handlePhoneChange = (value) => {
    setPhoneNumber(value)
    form.setFieldValue("phone", value)
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-center font-bold text-xl">{t("Phone number")}</h2>
      <div className="grid grid-cols-5 gap-3">
        <PhoneInput
          className="col-start-1 col-end-6"
          label="Numéro de téléphone"
          onChange={handlePhoneChange}
        />
      </div>
      {formErrors.phone && (
        <p className="text-red-500 text-sm">{formErrors.phone}</p>
      )}
    </div>
  )
}

export default PhoneRegister
