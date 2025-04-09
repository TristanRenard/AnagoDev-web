import { useState } from "react"

const useNavBar = () => {
  const [isNavBarOpen, setIsNavBarOpen] = useState(false)
  const toggleNavBar = () => {
    setIsNavBarOpen(!isNavBarOpen)
    umami.track("testtoggleNavBar", "click")
  }

  return { isNavBarOpen, toggleNavBar }
}

export default useNavBar