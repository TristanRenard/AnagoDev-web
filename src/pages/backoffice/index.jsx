/* eslint-disable max-lines-per-function */
import BackofficeLayout from "@/components/layouts/BackofficeLayout"
import authProps from "@/serverSideProps/authProps"
import * as echarts from "echarts"
import { useEffect, useRef, useState } from "react"

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
  const trafficChartRef = useRef(null)
  const devicesChartRef = useRef(null)
  const browsersChartRef = useRef(null)
  const countriesChartRef = useRef(null)
  const topPagesChartRef = useRef(null)

  useEffect(() => {
    // Fetch data from API
    fetchStatsData()
  }, [])

  useEffect(() => {
    // Initialize charts when stats data is available
    if (stats && !loading) {
      initializeCharts()
    }

    // Cleanup on component unmount
    return () => {
      disposeCharts()
    }
  }, [stats, loading])

  const fetchStatsData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/stats")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setStats(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching stats data:", err)
      setError("Failed to load statistics. Please try again later.")
    } finally {
      setLoading(false)
    }
  }
  const initializeCharts = () => {
    if (!stats) { return }

    if (trafficChartRef.current) {
      const trafficChart = echarts.init(trafficChartRef.current)
      // Format dates for x-axis
      const formatDates = stats.echarts.line.traffic.dates.map(date => {
        const d = new Date(date)


        return `${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`
      })
      const trafficOption = {
        title: {
          text: "Traffic Overview",
          left: "center"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["Pageviews", "Sessions"],
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
            name: "Pageviews",
            type: "line",
            data: stats.echarts.line.traffic.pageviews,
            smooth: true,
            lineStyle: {
              width: 3,
              color: "#5470c6"
            },
            itemStyle: {
              color: "#5470c6"
            }
          },
          {
            name: "Sessions",
            type: "line",
            data: stats.echarts.line.traffic.sessions,
            smooth: true,
            lineStyle: {
              width: 3,
              color: "#91cc75"
            },
            itemStyle: {
              color: "#91cc75"
            }
          }
        ]
      }

      trafficChart.setOption(trafficOption)

      // Handle window resize
      window.addEventListener("resize", () => {
        trafficChart.resize()
      })
    }

    if (devicesChartRef.current && stats) {
      const devicesChart = echarts.init(devicesChartRef.current)
      const devicesOption = {
        title: {
          text: "Devices",
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
            name: "Devices",
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
            },
            labelLine: {
              show: true
            },
            label: {
              formatter: "{b}: {d}%"
            }
          }
        ]
      }

      devicesChart.setOption(devicesOption)

      window.addEventListener("resize", () => {
        devicesChart.resize()
      })
    }

    if (browsersChartRef.current && stats) {
      const browsersChart = echarts.init(browsersChartRef.current)
      const browsersOption = {
        title: {
          text: "Browsers",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: stats.echarts.pie.browsers.map(item => item.name)
        },
        series: [
          {
            name: "Browsers",
            type: "pie",
            radius: "60%",
            center: ["50%", "60%"],
            data: stats.echarts.pie.browsers,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
            labelLine: {
              show: true
            },
            label: {
              formatter: "{b}: {d}%"
            }
          }
        ]
      }

      browsersChart.setOption(browsersOption)

      window.addEventListener("resize", () => {
        browsersChart.resize()
      })
    }

    if (countriesChartRef.current && stats) {
      const countriesChart = echarts.init(countriesChartRef.current)
      const countriesOption = {
        title: {
          text: "Countries",
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
            name: "Countries",
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
            },
            labelLine: {
              show: true
            },
            label: {
              formatter: "{b}: {d}%"
            }
          }
        ]
      }

      countriesChart.setOption(countriesOption)

      window.addEventListener("resize", () => {
        countriesChart.resize()
      })
    }

    if (topPagesChartRef.current && stats) {
      const topPagesChart = echarts.init(topPagesChartRef.current)
      const topPagesOption = {
        title: {
          text: "Top Pages",
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
            name: "Pageviews",
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
      }

      topPagesChart.setOption(topPagesOption)

      window.addEventListener("resize", () => {
        topPagesChart.resize()
      })
    }
  }
  const disposeCharts = () => {
    if (trafficChartRef.current) {
      echarts.getInstanceByDom(trafficChartRef.current)?.dispose()
    }

    if (devicesChartRef.current) {
      echarts.getInstanceByDom(devicesChartRef.current)?.dispose()
    }

    if (browsersChartRef.current) {
      echarts.getInstanceByDom(browsersChartRef.current)?.dispose()
    }

    if (countriesChartRef.current) {
      echarts.getInstanceByDom(countriesChartRef.current)?.dispose()
    }

    if (topPagesChartRef.current) {
      echarts.getInstanceByDom(topPagesChartRef.current)?.dispose()
    }
  }

  return (
    <BackofficeLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

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
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard title="Pages Vues" value={stats.stats.pageviews.value} />
              <StatsCard title="Visiteurs" value={stats.stats.visitors.value} />
              <StatsCard title="Sessions" value={stats.stats.visits.value} />
              <StatsCard title="Taux de Rebond" value={stats.stats.bounceRate} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Traffic Chart */}
              <div className="bg-white rounded-lg shadow p-4">
                <div ref={trafficChartRef} style={{ height: "400px" }}></div>
              </div>

              {/* Top Pages */}
              <div className="bg-white rounded-lg shadow p-4">
                <div ref={topPagesChartRef} style={{ height: "400px" }}></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Devices Chart */}
              <div className="bg-white rounded-lg shadow p-4">
                <div ref={devicesChartRef} style={{ height: "300px" }}></div>
              </div>

              {/* Browsers Chart */}
              <div className="bg-white rounded-lg shadow p-4">
                <div ref={browsersChartRef} style={{ height: "300px" }}></div>
              </div>

              {/* Countries Chart */}
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
