import { default as NextLink } from "next/link"

const Link = ({ onClick, children, ...props }) => {
  const handleLink = (e) => {
    if (onClick) {
      onClick(e)
    }

    const url = new URL(e.target.href)
    const path = url.pathname
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