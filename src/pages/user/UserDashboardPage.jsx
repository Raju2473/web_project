import { useEffect, useState } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import UserLayout from '../../layout/UserLayout'
import { PageShell, Panel, StatCard, LoadingBlock, EmptyState } from '../../components/UI'
import { powerpulseApi } from '../../api/powerpulseApi'
import { useAuth } from '../../context/AuthContext'
import { formatUnits, formatDate } from '../../utils/formatters'

export default function UserDashboardPage() {
  const { auth } = useAuth()
  const [summary, setSummary] = useState(null)
  const [latest, setLatest] = useState(null)
  const [weekly, setWeekly] = useState([])
  const [activePlan, setActivePlan] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [summaryRes, latestRes, weeklyRes, planRes, alertsRes, predictionRes] = await Promise.all([
          powerpulseApi.getDashboardSummary(auth.consumerNo),
          powerpulseApi.getLatestDailyUsage(auth.consumerNo),
          powerpulseApi.getWeeklyUsage(auth.consumerNo),
          powerpulseApi.getActivePlanSummary(auth.consumerNo).catch(() => null),
          powerpulseApi.getAlerts(auth.consumerNo).catch(() => ({ alerts: [] })),
          powerpulseApi.getPredictionFromDb(auth.consumerNo).catch(() => null)
        ])

        setSummary(summaryRes || null)
        setLatest(latestRes || null)
        setWeekly(weeklyRes?.weeklyUsage || [])
        setActivePlan(planRes?.active ? planRes.plan : null)
        setAlerts(alertsRes?.alerts || [])
        setPrediction(predictionRes || null)
      } catch (err) {
        setError(err.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    if (auth?.consumerNo) {
      load()
    }
  }, [auth.consumerNo])

  return (
    <UserLayout>
      <PageShell
        title={`Welcome, ${auth.fullName || 'User'}`}
        subtitle="Responsive dashboard powered by your current backend endpoints."
      >
        {loading ? (
          <LoadingBlock label="Loading dashboard..." />
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : (
          <>
            <div className="stats-grid">
              <StatCard
                label="Current month usage"
                value={formatUnits(summary?.thisMonthTotalKwh ?? 0)}
              />

              <StatCard
                label="Remaining days"
                value={`${summary?.remainingDays ?? 0} days`}
              />

              <StatCard
                label="Predicted next month"
                value={formatUnits(
                  prediction?.predictedNext30DaysTotal ??
                  prediction?.predictedTotalKwh ??
                  prediction?.nextMonthPrediction ??
                  0
                )}
              />

              <StatCard
                label="Latest entry"
                value={latest?.usageKwh != null ? formatUnits(latest.usageKwh) : 'No data'}
                hint={formatDate(latest?.usageDate)}
              />
            </div>

            <div className="grid-2">
              <Panel title="Last 7 days usage" subtitle="Pulled from GET /user/weekly-usage">
                {weekly.length ? (
                  <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={weekly}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="usage" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState title="No usage data" description="Add daily usage records to see the graph." />
                )}
              </Panel>

              <Panel title="Active recharge summary" subtitle="Pulled from GET /user/active-plan-summary">
                {activePlan ? (
                  <div className="detail-list">
                    <div><span>Plan name</span><strong>{activePlan.planName || '-'}</strong></div>
                    <div><span>Total units</span><strong>{formatUnits(activePlan.totalUnits ?? 0)}</strong></div>
                    <div><span>Used units</span><strong>{formatUnits(activePlan.usedUnits ?? 0)}</strong></div>
                    <div><span>Remaining units</span><strong>{formatUnits(activePlan.remainingUnits ?? 0)}</strong></div>
                    <div><span>Status</span><strong>{activePlan.status || '-'}</strong></div>
                    <div><span>Expiry date</span><strong>{formatDate(activePlan.expiryDate)}</strong></div>
                  </div>
                ) : (
                  <EmptyState title="No active plan" description="Recharge a plan to view remaining days and units here." />
                )}
              </Panel>
            </div>

            <Panel title="Alerts" subtitle="Latest system notifications from GET /user/alerts">
              {alerts.length ? (
                <div className="alert-list">
                  {alerts.slice(0, 5).map((alert, index) => (
                    <div key={index} className="alert-item">
                      <strong>{alert.title || alert.type || 'Alert'}</strong>
                      <p>{alert.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="No alerts" description="You have no unread balance or exhaustion alerts." />
              )}
            </Panel>
          </>
        )}
      </PageShell>
    </UserLayout>
  )
}