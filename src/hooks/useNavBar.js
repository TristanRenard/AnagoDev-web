import { useState } from "react"

const useNavBar = () => {
  const [isNavBarOpen, setIsNavBarOpen] = useState(false)
  const toggleNavBar = () => {
    setIsNavBarOpen(!isNavBarOpen)
  }

  return { isNavBarOpen, toggleNavBar }
}

export default useNavBar