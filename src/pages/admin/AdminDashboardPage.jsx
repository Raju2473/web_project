import { useEffect, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import AdminLayout from '../../layout/AdminLayout'
import { PageShell, Panel, StatCard, LoadingBlock } from '../../components/UI'
import { powerpulseApi } from '../../api/powerpulseApi'
import { formatUnits } from '../../utils/formatters'

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState(null)
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [overviewRes, plansRes] = await Promise.all([
          powerpulseApi.getAdminOverview(),
          powerpulseApi.getAdminRechargePlans().catch(() => ({ plans: [] }))
        ])
        setOverview(overviewRes)
        setPlans(plansRes.plans || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <AdminLayout>
      <PageShell title="Admin dashboard" subtitle="Overview metrics coming from GET /admin/dashboard-overview">
        {loading ? <LoadingBlock label="Loading admin dashboard..." /> : error ? <div className="error-box">{error}</div> : (
          <>
            <div className="stats-grid">
              <StatCard label="Current month total demand" value={formatUnits(overview?.currentMonthTotalDemand)} />
              <StatCard label="Total consumers" value={String(overview?.totalConsumers || 0)} />
              <StatCard label="Avg units per user" value={formatUnits(overview?.avgUnitsPerUser)} />
              <StatCard label="Predicted next month" value={formatUnits(overview?.predictedNextMonthDemand)} hint={`${overview?.percentageChange || 0}% change`} />
            </div>

            <div className="grid-2">
              <Panel title="Demand comparison">
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[
                      { name: 'Current', value: Number(overview?.currentMonthTotalDemand || 0) },
                      { name: 'Predicted', value: Number(overview?.predictedNextMonthDemand || 0) }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="Recharge plan distribution">
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={plans.slice(0, 5).map((plan) => ({ name: plan.planName, value: Number(plan.units || 0) }))} dataKey="value" nameKey="name" outerRadius={90} label>
                        {plans.slice(0, 5).map((_, index) => <Cell key={index} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>
          </>
        )}
      </PageShell>
    </AdminLayout>
  )
}
