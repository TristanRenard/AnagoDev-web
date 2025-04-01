const handler = (req, res) => {
  const { "x-user-data": userData } = req.headers

  if (!userData) {
    return res.status(401).json({ message: "Unauthorized. You must log in." })
  }

  const user = JSON.parse(userData)

  return res.status(200).json({ user })
}

export default handler