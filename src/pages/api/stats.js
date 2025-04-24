/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
import { getClient } from "@umami/api-client"

const handler = async (req, res) => {
  const { method } = req

  if (method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    // Extraction des paramètres de requête
    const { start, end, period = "30d" } = req.query
    // Configuration du client Umami
    const client = getClient({
      userId: process.env.UMAMI_API_CLIENT_USER_ID,
      secret: process.env.UMAMI_APP_SECRET,
      hostUrl: process.env.UMAMI_API_CLIENT_ENDPOINT,
    })
    const websiteId = "d74ff8e6-58d0-4204-ab6d-ef0c24631791"

    // Calcul des dates
    // eslint-disable-next-line init-declarations
    let startDate; let endDate

    if (start && end) {
      startDate = new Date(start)
      endDate = new Date(end)
    } else {
      endDate = new Date()
      startDate = new Date()

      // Gestion des périodes
      const periodMap = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
      }
      const days = periodMap[period] || 30
      startDate.setDate(startDate.getDate() - days)
    }

    // Ajout d'un jour à la date de fin pour inclure le jour complet
    endDate.setDate(endDate.getDate() + 1)

    const startTimestamp = startDate.getTime()
    const endTimestamp = endDate.getTime()
    // Paramètres pour les requêtes de séries temporelles
    const timeSeriesParams = {
      startAt: startTimestamp,
      endAt: endTimestamp,
      unit: determineTimeUnit(startTimestamp, endTimestamp),
      timezone: "UTC",
    }
    // Collecte des statistiques en parallèle
    const [
      urlMetrics,          // Statistiques par URL
      statsData,           // Résumé des statistiques
      deviceMetrics,       // Métriques par appareil
      browserMetrics,      // Métriques par navigateur
      osMetrics,           // Métriques par système d'exploitation
      countryMetrics,      // Métriques par pays
      referrerMetrics,     // Métriques par référent
      pageViewsTimeSeries, // Séries temporelles des pages vues
      events,
    ] = await Promise.all([
      client.getWebsiteMetrics(websiteId, {
        startAt: startTimestamp,
        endAt: endTimestamp,
        type: "url",
      }),

      client.getWebsiteStats(websiteId, {
        startAt: startTimestamp,
        endAt: endTimestamp,
      }),

      client.getWebsiteMetrics(websiteId, {
        startAt: startTimestamp,
        endAt: endTimestamp,
        type: "device",
      }),

      client.getWebsiteMetrics(websiteId, {
        startAt: startTimestamp,
        endAt: endTimestamp,
        type: "browser",
      }),

      client.getWebsiteMetrics(websiteId, {
        startAt: startTimestamp,
        endAt: endTimestamp,
        type: "os",
      }),

      client.getWebsiteMetrics(websiteId, {
        startAt: startTimestamp,
        endAt: endTimestamp,
        type: "country",
      }),

      client.getWebsiteMetrics(websiteId, {
        startAt: startTimestamp,
        endAt: endTimestamp,
        type: "referrer",
      }),

      client.getWebsitePageviews(websiteId, timeSeriesParams),
      client.getWebsiteEvents(websiteId, {
        startAt: startTimestamp,
        endAt: endTimestamp,
      }),
    ])
    // Préparer les données pour ECharts
    const echartsData = prepareDataForECharts({
      urlMetrics,
      deviceMetrics,
      browserMetrics,
      osMetrics,
      countryMetrics,
      referrerMetrics,
      pageViewsTimeSeries
    })

    // Retourner toutes les statistiques collectées
    return res.status(200).json({
      period: {
        start: startDate,
        end: new Date(endDate.getTime() - 86400000),
        days: Math.floor((endTimestamp - startTimestamp) / 86400000),
      },
      events: events.data.data.filter(item => item.eventName === "navigate"),
      metrics: {
        urls: urlMetrics.ok ? urlMetrics.data : [],
        devices: deviceMetrics.ok ? deviceMetrics.data : [],
        browsers: browserMetrics.ok ? browserMetrics.data : [],
        os: osMetrics.ok ? osMetrics.data : [],
        countries: countryMetrics.ok ? countryMetrics.data : [],
        referrers: referrerMetrics.ok ? referrerMetrics.data : [],
      },
      stats: statsData.ok ? {
        pageviews: statsData.data.pageviews,
        visitors: statsData.data.visitors,
        visits: statsData.data.visits,
        bounces: statsData.data.bounces,
        totaltime: statsData.data.totaltime,
        // Calculs dérivés
        bounceRate: statsData.data.visits && statsData.data.visits.value > 0
          ? `${((statsData.data.bounces.value / statsData.data.visits.value) * 100).toFixed(2)}%`
          : "0%",
        avgTimeOnSite: statsData.data.totaltime && statsData.data.visits && statsData.data.visits.value > 0
          ? Math.round(statsData.data.totaltime.value / statsData.data.visits.value)
          : 0,
        pagesPerVisit: statsData.data.pageviews && statsData.data.visits && statsData.data.visits.value > 0
          ? (statsData.data.pageviews.value / statsData.data.visits.value).toFixed(2)
          : "0",
      } : {},
      timeseries: {
        pageviews: pageViewsTimeSeries.ok ? pageViewsTimeSeries.data : {},
      },
      echarts: echartsData,
    })
  } catch (error) {
    console.error("Error fetching analytics data:", error)


    return res.status(500).json({
      message: "Failed to fetch analytics data",
      error: error.message
    })
  }
}
/**
 * Détermine l'unité temporelle appropriée en fonction de la durée
 */
const determineTimeUnit = (startTimestamp, endTimestamp) => {
  const durationDays = (endTimestamp - startTimestamp) / 86400000

  if (durationDays <= 2) { return "hour" }

  if (durationDays <= 90) { return "day" }

  return "month"
}
/**
 * Prépare les données pour ECharts
 */
const prepareDataForECharts = ({
  urlMetrics,
  deviceMetrics,
  browserMetrics,
  osMetrics,
  countryMetrics,
  referrerMetrics,
  pageViewsTimeSeries
}) => {
  // Données pour graphiques en camembert
  const pieCharts = {
    devices: deviceMetrics.ok
      ? deviceMetrics.data.map(item => ({ value: item.y, name: item.x }))
      : [],
    browsers: browserMetrics.ok
      ? browserMetrics.data.map(item => ({ value: item.y, name: item.x }))
      : [],
    os: osMetrics.ok
      ? osMetrics.data.map(item => ({ value: item.y, name: item.x }))
      : [],
    countries: countryMetrics.ok
      ? countryMetrics.data.map(item => ({ value: item.y, name: item.x }))
      : [],
  }
  // Données pour graphiques en barres
  const barCharts = {
    topPages: urlMetrics.ok
      ? urlMetrics.data
        .slice(0, 10)
        .map(item => ({
          value: item.y,
          name: item.x.length > 30 ? `${item.x.substring(0, 27)}...` : item.x
        }))
      : [],
    topReferrers: referrerMetrics.ok
      ? referrerMetrics.data
        .filter(item => item.x !== "(direct)")
        .slice(0, 10)
        .map(item => ({
          value: item.y,
          name: item.x.length > 30 ? `${item.x.substring(0, 27)}...` : item.x
        }))
      : [],
  }
  // Données pour graphiques linéaires
  const lineCharts = {
    traffic: {
      dates: pageViewsTimeSeries.ok && pageViewsTimeSeries.data.pageviews
        ? pageViewsTimeSeries.data.pageviews.map(item => item.x)
        : [],
      pageviews: pageViewsTimeSeries.ok && pageViewsTimeSeries.data.pageviews
        ? pageViewsTimeSeries.data.pageviews.map(item => item.y)
        : [],
      sessions: pageViewsTimeSeries.ok && pageViewsTimeSeries.data.sessions
        ? pageViewsTimeSeries.data.sessions.map(item => item.y)
        : [],
    }
  }

  return {
    pie: pieCharts,
    bar: barCharts,
    line: lineCharts
  }
}

export default handler