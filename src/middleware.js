import { jwtVerify } from "jose"
import { NextResponse } from "next/server"

const middleware = async (req) => {
  const url = req.nextUrl
  const { pathname } = url

  // Exclure certaines routes (par exemple les fichiers statiques, _next, favicon.ico, robots.txt)
  if (pathname.startsWith("/static") || pathname.includes("_next") || pathname.endsWith(".ico") || pathname.endsWith(".txt")) {
    return NextResponse.next()
  }

  console.log(middleware)
  const token = req.cookies.get("token")?.value

  console.log("Token:", token)

  if (token) {
    try {
      const { payload: userToken } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
      console.log("User Token:", userToken)
      const userId = userToken.id
      console.log("User ID:", userId)
      const user = await fetch(`${process.env.HOST_NAME}api/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.API_KEY}`
        }
      }).then((res) => res.json())
      console.log("User Data:", user)
      const response = NextResponse.next()

      console.log("Response:", response.headers)

      if (pathname.includes("/api")) {
        response.headers.set("x-user-data", JSON.stringify(user.user))
        console.log("API Response Headers:", response.headers)
      } else {
        response.headers.set("x-user-data", user.user.id)
        console.log("Page Response Headers:", response.headers)
      }

      return response
    } catch (error) {
      console.error(error)

      return NextResponse.redirect(new URL("/auth/login", req.url), {
        headers: {
          "Set-Cookie": "token=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict",
        },
      })
    }
  }

  return NextResponse.next()
}

export default middleware
