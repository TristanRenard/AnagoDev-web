import { jwtVerify } from "jose"
import { NextResponse } from "next/server"

const middleware = async (req) => {
  const token = req.cookies.get("token")?.value

  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))

      return NextResponse.next()
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

export default middleware
