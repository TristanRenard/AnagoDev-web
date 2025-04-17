import { CheckCircle, Circle } from "lucide-react"

const requirements = [
  { label: "At least 8 characters", test: (password) => password.length >= 8 },
  {
    label: "At least one uppercase letter",
    test: (password) => /[A-Z]/u.test(password),
  },
  {
    label: "At least one lowercase letter",
    test: (password) => /[a-z]/u.test(password),
  },
  { label: "At least one number", test: (password) => /[0-9]/u.test(password) },
  {
    label: "At least one special character",
    test: (password) => /[!@#$%^&*(),.?":{}|<>]/u.test(password),
  },
]
const CheckPassword = ({ password }) => (
  <ul className="text-sm space-y-1 mt-2" style={{ "margin-top": "-20px" }}>
    {requirements.map((req, idx) => {
      const valid = req.test(password)

      return (
        <li key={idx} className="flex items-center gap-2">
          {valid ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <Circle className="w-4 h-4 text-gray-400" />
          )}
          <span className={valid ? "text-emerald-600" : "text-gray-400"}>
            {req.label}
          </span>
        </li>
      )
    })}
  </ul>
)

export default CheckPassword
