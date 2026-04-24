import { useEffect, useMemo, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import AdminLayout from '../../layout/AdminLayout'
import { PageShell, Panel, LoadingBlock, StatCard } from '../../components/UI'
import { powerpulseApi } from '../../api/powerpulseApi'
import { formatUnits } from '../../utils/formatters'

export default function MandalAnalysisPage() {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await powerpulseApi.getMandalAnalysis()
        setAnalysis(res)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const mandals = useMemo(() => (analysis?.mandals || []).filter((m) => m.mandalName.toLowerCase().includes(query.toLowerCase())), [analysis, query])

  return (
    <AdminLayout>
      <PageShell title="Mandal analysis" subtitle="Shows monthly usage and status for each mandal." actions={<input className="search-input" placeholder="Search mandal" value={query} onChange={(e) => setQuery(e.target.value)} />}>
        {loading ? <LoadingBlock label="Loading mandal data..." /> : error ? <div className="error-box">{error}</div> : (
          <>
            <div className="stats-grid">
              <StatCard label="Total monthly consumption" value={formatUnits(analysis?.totalMonthlyConsumption)} />
              <StatCard label="Mandal count" value={String(analysis?.mandals?.length || 0)} />
            </div>
            <div className="grid-2">
              <Panel title="Monthly usage by mandal">
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mandals}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mandalName" hide />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="monthlyUsage" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="Mandal table">
                <div className="table-wrap small-table">
                  <table>
                    <thead>
                      <tr><th>Mandal</th><th>Monthly usage</th><th>Load %</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {mandals.map((item) => (
                        <tr key={item.mandalName}>
                          <td>{item.mandalName}</td>
                          <td>{formatUnits(item.monthlyUsage)}</td>
                          <td>{item.currentLoadPercent}%</td>
                          <td>{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </div>
          </>
        )}
      </PageShell>
    </AdminLayout>
  )
}
