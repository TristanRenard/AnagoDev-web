import umami from "@umami/node"
import { default as NextLink } from "next/link"

const Link = ({ onClick, children, ...props }) => {
  const handleLink = (e) => {
    if (onClick) {
      onClick(e)
    }

    const url = new URL(e.target.href)
    const path = url.pathname
    umami.identify({
      "type": "link",
      "from": e.target.baseURI,
      "to": path,
      "title": e.target.innerText,
      "url": e.target.href,
      "text": e.target.innerText,
    })
    umami.track("navigate", {
      from: e.target.baseURI,
      to: path,
    })
  }

  return (
    <NextLink
      {...props}
      onClick={handleLink}
    >
      {children}
    </NextLink>
  )
}

export default Link