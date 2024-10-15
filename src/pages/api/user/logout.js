const handler = (req, res) => {
  res.setHeader("Set-Cookie", "token=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT")
  res.status(200).json({ message: "Cookie supprimé" })
}

export default handler