import { useEffect, useState } from 'react'
import AdminLayout from '../../layout/AdminLayout'
import { PageShell, Panel, LoadingBlock } from '../../components/UI'
import { powerpulseApi } from '../../api/powerpulseApi'
import { formatCurrency, formatUnits } from '../../utils/formatters'

export default function ReportsPage() {
  const [plans, setPlans] = useState([])
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [plansRes, overviewRes] = await Promise.all([
          powerpulseApi.getAdminRechargePlans(),
          powerpulseApi.getAdminOverview()
        ])
        setPlans(plansRes.plans || [])
        setOverview(overviewRes)
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
      <PageShell title="Reports" subtitle="Simple responsive reporting view using existing admin endpoints.">
        {loading ? <LoadingBlock label="Loading reports..." /> : error ? <div className="error-box">{error}</div> : (
          <div className="grid-2">
            <Panel title="Demand summary">
              <div className="detail-list">
                <div><span>Current month demand</span><strong>{formatUnits(overview?.currentMonthTotalDemand)}</strong></div>
                <div><span>Predicted next month demand</span><strong>{formatUnits(overview?.predictedNextMonthDemand)}</strong></div>
                <div><span>Average units per user</span><strong>{formatUnits(overview?.avgUnitsPerUser)}</strong></div>
                <div><span>Total consumers</span><strong>{overview?.totalConsumers || 0}</strong></div>
              </div>
            </Panel>
            <Panel title="Recharge plan catalog">
              <div className="table-wrap small-table">
                <table>
                  <thead><tr><th>Plan</th><th>Amount</th><th>Units</th><th>Validity</th><th>Status</th></tr></thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr key={plan.id}>
                        <td>{plan.planName}</td>
                        <td>{formatCurrency(plan.amount)}</td>
                        <td>{formatUnits(plan.units)}</td>
                        <td>{plan.validityDays} days</td>
                        <td>{plan.isActive ? 'Active' : 'Inactive'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}
      </PageShell>
    </AdminLayout>
  )
}
