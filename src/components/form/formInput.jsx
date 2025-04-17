/* eslint-disable max-lines */
import { Input } from "@/components/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Select } from "@radix-ui/react-select"
import { clsx } from "clsx"

const FormInput = ({
  form,
  name,
  label,
  validators,
  setValue,
  value,
  error,
  setIsValid,
  hideLabel,
  className,
  showError = true,
  ...props
}) => (
  <form.Field
    name={name}
    validators={validators}
    /* eslint-disable-next-line react/no-children-prop */
    children={(field) => {
      const hasError =
        (field.state.meta.isTouched && field.state.meta.errors.length > 0) ||
        error
      const handleChange = (e) => {
        const newValue = e.target.value
        field.handleChange(newValue)

        if (setValue) {
          setValue(newValue)
        }

        if (setIsValid) {
          setIsValid(!hasError)
        }
      }

      return (
        <div className={clsx("flex flex-col gap-2", className)}>
          {!hideLabel && <Label htmlFor={name}>{label}</Label>}
          <Input
            id={name}
            name={name}
            type="text"
            value={field.state.value || (value && `+${value}`)}
            placeholder={label}
            onChange={handleChange}
            className={"input"}
            {...props}
          />
          {hasError && showError ? (
            <span className="text-red-500">
              {error} {error && field.state.meta.errors.length ? ", " : ""}{" "}
              {field.state.meta.errors.join(", ")}
            </span>
          ) : null}
        </div>
      )
    }}
  />
)
const FormSelect = ({
  form,
  name,
  label,
  options,
  validators,
  setValue,
  error,
  hideLabel,
  setIsValid,
  className,
  alphabetical,
  ...props
}) => {
  const firstLetters = options
    .map((option) => option.country[0])
    .filter((value, index, self) => self.indexOf(value) === index)

  return (
    <form.Field
      name={name}
      validators={validators}
      /* eslint-disable-next-line react/no-children-prop */
      children={(field) => {
        const hasError =
          (field.state.meta.isTouched && field.state.meta.errors.length > 0) ||
          error
        const handleChange = (val) => {
          field.handleChange(val)

          if (setValue) {
            setValue(val)
          }

          if (setIsValid) {
            setIsValid(!hasError)
          }
        }

        return (
          <div className={clsx("flex flex-col gap-2", className)}>
            {!hideLabel && <Label htmlFor={name}>{label}</Label>}
            <Select
              id={name}
              name={name}
              value={field.state.value}
              className="input"
              onValueChange={handleChange}
            >
              <SelectTrigger
                {...props}
                aria-labelledby={`${label}-select-label`}
              >
                <SelectValue
                  placeholder={`Select ${label}`}
                  aria-labelledby={`${label}-select-label`}
                />
              </SelectTrigger>
              <SelectContent>
                {!alphabetical ? (
                  <SelectGroup aria-label={`${label} list`}>
                    {options.map((option, index) => (
                      <SelectItem
                        key={index}
                        value={option.value}
                        aria-label={`${label}: ${option.label}`}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ) : (
                  <>
                    {firstLetters.map((letter) => (
                      <SelectGroup key={letter} aria-label={`${label} list`}>
                        <SelectLabel id={`${label}-select-label`}>
                          {letter}
                        </SelectLabel>
                        {options
                          .filter((option) => option.country[0] === letter)
                          .map((option, subIndex) => (
                            <SelectItem
                              key={subIndex}
                              value={option.value}
                              aria-label={`${label}: ${option.label}`}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
            {hasError ? (
              <span className="text-red-500">
                {error} {error && field.state.meta.errors.length ? ", " : ""}{" "}
                {field.state.meta.errors.join(", ")}
              </span>
            ) : null}
          </div>
        )
      }}
    />
  )
}
const FormOTP = ({
  form,
  name,
  label,
  validators,
  setValue,
  error,
  setIsValid,
  hideLabel,
  className,
  ...props
}) => (
  <form.Field
    name={name}
    validators={validators}
    /* eslint-disable-next-line react/no-children-prop */
    children={(field) => {
      const hasError =
        (field.state.meta.isTouched && field.state.meta.errors.length > 0) ||
        error
      const handleChange = (value) => {
        field.handleChange(value)

        if (setValue) {
          setValue(value)
        }

        if (setIsValid) {
          setIsValid(!hasError)
        }
      }

      return (
        <div className={clsx("flex flex-col gap-2", className)}>
          {!hideLabel && <Label htmlFor={name}>{label}</Label>}
          <InputOTP
            name={name}
            id={name}
            maxLength={6}
            value={field.state.value}
            onChange={handleChange}
            {...props}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {hasError ? (
            <span className="text-red-500">
              {error} {error && field.state.meta.errors.length ? ", " : ""}{" "}
              {field.state.meta.errors.join(", ")}
            </span>
          ) : null}
        </div>
      )
    }}
  />
)
const FormSwitch = ({
  form,
  name,
  label,
  validators,
  setValue,
  error,
  setIsValid,
  hideLabel,
  className,
  ...props
}) => (
  <form.Field
    name={name}
    validators={validators}
    /* eslint-disable-next-line react/no-children-prop */
    children={(field) => {
      const hasError =
        (field.state.meta.isTouched && field.state.meta.errors.length > 0) ||
        error
      const handleChange = (value) => {
        field.handleChange(value)

        if (setValue) {
          setValue(value)
        }

        if (setIsValid) {
          setIsValid(!hasError)
        }
      }

      return (
        <div className={clsx("flex gap-4 items-center", className)}>
          <Switch
            id={name}
            name={name}
            checked={field.state.value}
            onCheckedChange={handleChange}
            {...props}
          />
          {!hideLabel && <Label htmlFor={name}>{label}</Label>}
          {hasError ? (
            <span className="text-red-500">
              {error} {error && field.state.meta.errors.length ? ", " : ""}{" "}
              {field.state.meta.errors.join(", ")}
            </span>
          ) : null}
        </div>
      )
    }}
  />
)

export { FormInput, FormOTP, FormSelect, FormSwitch }
