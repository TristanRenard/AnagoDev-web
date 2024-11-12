import { jwtVerify } from "jose"
import { NextResponse } from "next/server"

const middleware = async (req) => {
  const token = req.cookies.get("token")?.value

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

      if (req.url.includes("/api")) {
        response.headers.set("x-user-data", JSON.stringify(user.user))
      } else {
        response.headers.set("x-user-data", user.user.id)
      }

      return response
    } catch (error) {
      return NextResponse.redirect(new URL("/auth/login", req.url), {
        headers: {
          "Set-Cookie": "token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict",
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!static|.*\\..*|_next|favicon.ico|robots.txt).*)"]
}

export default middleware
