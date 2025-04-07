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
      const userId = userToken.id
      const user = await fetch(`http://localhost:3000/api/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.API_KEY}`
        }
      }).then((res) => res.json())
      const response = NextResponse.next()

      if (pathname.includes("/api")) {
        response.headers.set("x-user-data", JSON.stringify(user.user))
      } else {
        response.headers.set("x-user-data", user.user.id)
      }

      return response
    } catch (error) {
      console.error("Token verification failed:", error)

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
