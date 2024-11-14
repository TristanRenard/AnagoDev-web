const handler = (req, res) => {
  const { method } = req

  if (method === "GET") {
    const { "x-user-data": userData } = req.headers

    if (userData) {
      return res.status(200).json({ message: "User is logged in", loggedIn: true })
    }

    return res.status(200).json({ message: "User is not logged in", loggedIn: false })
  }

  return res.status(405).json({ message: "Method Not Allowed" })
}

export default handler