import { FormSelect } from "@/components/form/formInput"
import { allCountries } from "country-telephone-data"

const countryCodeToEmoji = (countryCode) => {
  // eslint-disable-next-line no-param-reassign
  countryCode = countryCode.toUpperCase()

  if (countryCode.length !== 2) {
    return "Invalid country code"
  }

  const offset = 127397
  const emoji = String.fromCodePoint(
    ...countryCode.split("").map((c) => c.charCodeAt() + offset)
  )

  return emoji
}
const countries = allCountries.map((country) => ({
  value: country.dialCode,
  country: country.name,
  label: `${countryCodeToEmoji(country.iso2)} +${country.dialCode} (${country.name})`,
}))
  .sort((a, b) => a.country.localeCompare(b.country))
  .filter((value, index, self) => self.findIndex((t) => t.value === value.value) === index)
const CountryCodeSelect = ({ value, setValue, form, className, ...props }) => (
  <FormSelect
    name="countryCode"
    label="Country Code"
    setValue={setValue}
    value={value}
    {...props}
    options={countries.slice(0, 200)}
    form={form}
    hideLabel
    className={className}
    alphabetical
  />
)


export { CountryCodeSelect }

