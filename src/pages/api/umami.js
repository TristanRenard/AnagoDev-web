const handler = (req, res) => {
  const umamiScript = process.env.NEXT_PUBLIC_UMAMI_SCRIPT
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID

  return res.status(200).json({
    umamiScript,
    umamiWebsiteId,
  })
}

export default handler
