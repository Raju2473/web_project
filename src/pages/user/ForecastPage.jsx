import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts'
import UserLayout from '../../layout/UserLayout'
import { PageShell, Panel, StatCard, LoadingBlock, EmptyState } from '../../components/UI'
import { powerpulseApi } from '../../api/powerpulseApi'
import { useAuth } from '../../context/AuthContext'
import { formatUnits } from '../../utils/formatters'

function normalizeForecastData(raw) {
  const summary = raw?.predictionSummary || {}
  const graphData = Array.isArray(raw?.graphData) ? raw.graphData : []
  const weeklyUsage = Array.isArray(raw?.weeklyUsage) ? raw.weeklyUsage : []

  return {
    total: Number(summary.nextMonthUsageUnits ?? 0),
    average: Number(summary.averageDailyUnits ?? 0),
    peak: graphData.length ? Math.max(...graphData.map((item) => Number(item.usage ?? 0))) : 0,
    points: graphData.map((item) => ({
      day: item.label || `Day ${item.day}`,
      usage: Number(item.usage ?? 0)
    })),
    weeklyBars: weeklyUsage.map((item) => ({
      week: item.week,
      usage: Number(item.units ?? item.kwh ?? 0)
    }))
  }
}

export default function UserForecastPage() {
  const { auth } = useAuth()
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadForecast() {
      setLoading(true)
      setError('')

      try {
        const res = await powerpulseApi.getPredictionFromDb(auth.consumerNo)
        setForecast(res || null)
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load forecast')
      } finally {
        setLoading(false)
      }
    }

    if (auth?.consumerNo) {
      loadForecast()
    }
  }, [auth.consumerNo])

  const normalized = useMemo(() => normalizeForecastData(forecast), [forecast])

  return (
    <UserLayout>
      <PageShell
        title="Monthly Forecast"
        subtitle="Prediction results powered by your existing backend."
      >
        {loading ? (
          <LoadingBlock label="Loading forecast..." />
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : (
          <>
            <div className="stats-grid">
              <StatCard
                label="Predicted next 30 days"
                value={formatUnits(normalized.total)}
              />
              <StatCard
                label="Average daily predicted usage"
                value={formatUnits(normalized.average)}
              />
              <StatCard
                label="Peak predicted day"
                value={formatUnits(normalized.peak)}
              />
              <StatCard
                label="Forecast points"
                value={`${normalized.points.length}`}
              />
            </div>

            <div className="grid-2">
              <Panel
                title="Prediction trend"
                subtitle="Day-wise forecast graph"
              >
                {normalized.points.length ? (
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height={320}>
                      <LineChart data={normalized.points}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" hide={normalized.points.length > 12} />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="usage"
                          strokeWidth={3}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState
                    title="No forecast graph data"
                    description="The backend returned no daily prediction points."
                  />
                )}
              </Panel>

              <Panel
                title="Weekly prediction bars"
                subtitle="Week-wise predicted units"
              >
                {normalized.weeklyBars.length ? (
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={normalized.weeklyBars}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="usage" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState
                    title="No weekly bar graph data"
                    description="Prediction values are not available from backend."
                  />
                )}
              </Panel>
            </div>

            <Panel
              title="Forecast summary"
              subtitle="Prediction values from backend response"
            >
              <div className="detail-list">
                <div>
                  <span>Consumer number</span>
                  <strong>{auth.consumerNo || '-'}</strong>
                </div>
                <div>
                  <span>Total predicted units</span>
                  <strong>{formatUnits(normalized.total)}</strong>
                </div>
                <div>
                  <span>Average daily units</span>
                  <strong>{formatUnits(normalized.average)}</strong>
                </div>
                <div>
                  <span>Peak daily units</span>
                  <strong>{formatUnits(normalized.peak)}</strong>
                </div>
              </div>
            </Panel>
          </>
        )}
      </PageShell>
    </UserLayout>
  )
}