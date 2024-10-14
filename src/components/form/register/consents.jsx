import { FormSwitch } from "@/components/form/formInput"
import { useEffect, useState } from "react"


const ConsentsEmailAndSms = ({ form, setDisableNext }) => {
  const [consentMail, setConsentMail] = useState(false)
  const [consentConditions, setConsentConditions] = useState(false)

  useEffect(() => {
    if (setDisableNext) {
      setDisableNext(!(consentMail && consentConditions))
    }
  },
    [consentMail, consentConditions, setDisableNext]
  )

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-center font-bold text-xl">About you</h2>
      <FormSwitch
        form={form}
        name="consentMail"
        label="I agree to receive email communications by email and SMS"
        value={consentMail}
        setValue={setConsentMail}
      />
      <FormSwitch
        form={form}
        name="consentConditions"
        label="I agree to the terms and conditions"
        value={consentConditions}
        setValue={setConsentConditions}
      />
    </div>
  )
}

export default ConsentsEmailAndSms