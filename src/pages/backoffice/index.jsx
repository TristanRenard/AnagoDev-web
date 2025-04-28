/* eslint-disable max-lines-per-function */
import BackofficeLayout from "@/components/layouts/BackofficeLayout"
import authProps from "@/serverSideProps/authProps"
import * as echarts from "echarts"
import { useEffect, useRef, useState } from "react"

// Composant simple pour les cartes de statistiques
const StatsCard = ({ title, value, subtitle }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
    {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
  </div>
)
const BackofficeHome = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Refs pour les graphiques
  const trafficChartRef = useRef(null)
  const devicesChartRef = useRef(null)
  const osChartRef = useRef(null)
  const countriesChartRef = useRef(null)
  const topPagesChartRef = useRef(null)
  const referrersChartRef = useRef(null)

  // Charger les données
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/stats")

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }

        const data = await response.json()
        setStats(data)
        setError(null)
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques:", err)
        setError("Impossible de charger les statistiques. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Initialiser les graphiques quand les données sont chargées
  useEffect(() => {
    if (stats && !loading) {
      initCharts()
    }

    // Nettoyer les instances de graphiques lors du démontage
    return () => {
      if (trafficChartRef.current) {
        echarts.getInstanceByDom(trafficChartRef.current)?.dispose()
      }

      if (devicesChartRef.current) {
        echarts.getInstanceByDom(devicesChartRef.current)?.dispose()
      }

      if (osChartRef.current) {
        echarts.getInstanceByDom(osChartRef.current)?.dispose()
      }

      if (countriesChartRef.current) {
        echarts.getInstanceByDom(countriesChartRef.current)?.dispose()
      }

      if (topPagesChartRef.current) {
        echarts.getInstanceByDom(topPagesChartRef.current)?.dispose()
      }

      if (referrersChartRef.current) {
        echarts.getInstanceByDom(referrersChartRef.current)?.dispose()
      }
    }
  }, [stats, loading])

  // Initialiser les graphiques
  const initCharts = () => {
    // 1. Graphique de trafic
    if (trafficChartRef.current && stats.echarts?.line?.traffic) {
      const chart = echarts.init(trafficChartRef.current)
      // Formater les dates
      const formatDates = stats.echarts.line.traffic.dates.map(date => {
        const d = new Date(date)


        return `${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`
      })

      chart.setOption({
        title: {
          text: "Trafic",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["Pages vues", "Sessions"],
          top: 30
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: formatDates,
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "Pages vues",
            type: "bar",
            data: stats.echarts.line.traffic.pageviews,
            itemStyle: {
              color: "#5470c6"
            }
          },
          {
            name: "Sessions",
            type: "line",
            smooth: true,
            data: stats.echarts.line.traffic.sessions,
            itemStyle: {
              color: "#91cc75"
            }
          }
        ]
      })

      window.addEventListener("resize", () => chart.resize())
    }

    // 2. Graphique des appareils
    if (devicesChartRef.current && stats.echarts?.pie?.devices) {
      const chart = echarts.init(devicesChartRef.current)

      chart.setOption({
        title: {
          text: "Appareils",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: stats.echarts.pie.devices.map(item => item.name)
        },
        series: [
          {
            name: "Appareils",
            type: "pie",
            radius: "60%",
            center: ["50%", "60%"],
            data: stats.echarts.pie.devices,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      })

      window.addEventListener("resize", () => chart.resize())
    }

    // 3. Graphique des OS
    if (osChartRef.current && stats.echarts?.pie?.os) {
      const chart = echarts.init(osChartRef.current)

      chart.setOption({
        title: {
          text: "Systèmes d'exploitation",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: stats.echarts.pie.os.map(item => item.name)
        },
        series: [
          {
            name: "OS",
            type: "pie",
            radius: "60%",
            center: ["50%", "60%"],
            data: stats.echarts.pie.os,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      })

      window.addEventListener("resize", () => chart.resize())
    }

    // 4. Graphique des pays
    if (countriesChartRef.current && stats.echarts?.pie?.countries) {
      const chart = echarts.init(countriesChartRef.current)

      chart.setOption({
        title: {
          text: "Pays",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: stats.echarts.pie.countries.map(item => item.name)
        },
        series: [
          {
            name: "Pays",
            type: "pie",
            radius: "60%",
            center: ["50%", "60%"],
            data: stats.echarts.pie.countries,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      })

      window.addEventListener("resize", () => chart.resize())
    }

    // 5. Graphique des pages populaires
    if (topPagesChartRef.current && stats.echarts?.bar?.topPages) {
      const chart = echarts.init(topPagesChartRef.current)

      chart.setOption({
        title: {
          text: "Pages les plus visitées",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category",
          data: stats.echarts.bar.topPages.map(item => item.name).reverse(),
          axisLabel: {
            formatter(value) {
              return value.length > 15 ? `${value.substring(0, 15)}...` : value
            }
          }
        },
        series: [
          {
            name: "Pages vues",
            type: "bar",
            data: stats.echarts.bar.topPages.map(item => item.value).reverse(),
            itemStyle: {
              color(params) {
                const colorList = [
                  "#5470c6", "#91cc75", "#fac858", "#ee6666",
                  "#73c0de", "#3ba272", "#fc8452", "#9a60b4",
                  "#ea7ccc", "#6e7079"
                ]


                return colorList[params.dataIndex % colorList.length]
              }
            }
          }
        ]
      })

      window.addEventListener("resize", () => chart.resize())
    }

    // 6. Graphique des référents
    if (referrersChartRef.current && stats.echarts?.bar?.topReferrers) {
      const chart = echarts.init(referrersChartRef.current)

      chart.setOption({
        title: {
          text: "Sources de trafic",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: "category",
          data: stats.echarts.bar.topReferrers.map(item => item.name).reverse(),
          axisLabel: {
            formatter(value) {
              return value.length > 15 ? `${value.substring(0, 15)}...` : value
            }
          }
        },
        series: [
          {
            name: "Visites",
            type: "bar",
            data: stats.echarts.bar.topReferrers.map(item => item.value).reverse(),
            itemStyle: {
              color: "#3ba272"
            }
          }
        ]
      })

      window.addEventListener("resize", () => chart.resize())
    }
  }

  return (
    <BackofficeLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Chargement des données...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : stats ? (
          <>
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard
                title="Pages vues"
                value={stats.stats.pageviews.value}
              />
              <StatsCard
                title="Visiteurs"
                value={stats.stats.visitors.value}
              />
              <StatsCard
                title="Sessions"
                value={stats.stats.visits.value}
              />
              <StatsCard
                title="Taux de rebond"
                value={stats.stats.bounceRate}
                subtitle={`Temps moyen: ${stats.stats.avgTimeOnSite}s`}
              />
            </div>

            {/* Graphiques principaux */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div ref={trafficChartRef} style={{ height: "400px" }}></div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div ref={topPagesChartRef} style={{ height: "400px" }}></div>
              </div>
            </div>

            {/* Graphiques secondaires */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div ref={devicesChartRef} style={{ height: "300px" }}></div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div ref={osChartRef} style={{ height: "300px" }}></div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div ref={countriesChartRef} style={{ height: "300px" }}></div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </BackofficeLayout>
  )
}

export default BackofficeHome

export const getServerSideProps = async (context) => {
  const { user } = await authProps(context)

  if (!user || !user.role || user.role !== "admin") {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user,
    },
  }
}