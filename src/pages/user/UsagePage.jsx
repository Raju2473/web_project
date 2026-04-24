import { useEffect, useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts'
import UserLayout from '../../layout/UserLayout'
import { PageShell, Panel, LoadingBlock } from '../../components/UI'
import { powerpulseApi } from '../../api/powerpulseApi'
import { useAuth } from '../../context/AuthContext'
import { formatDate, formatUnits } from '../../utils/formatters'

export default function UsagePage() {
  const { auth } = useAuth()
  const [dailyTrend, setDailyTrend] = useState([])
  const [weeklyTrend, setWeeklyTrend] = useState([])
  const [history, setHistory] = useState([])
  const [form, setForm] = useState({ usageDate: '', usageKwh: '' })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [daily, weekly, historyRes] = await Promise.all([
        powerpulseApi.getCurrentMonthDailyTrend(auth.consumerNo),
        powerpulseApi.getCurrentMonthWeeklyTrend(auth.consumerNo),
        powerpulseApi.getDailyUsageHistory(auth.consumerNo)
      ])
      setDailyTrend(daily.trend || daily.dailyTrend || [])
      setWeeklyTrend(weekly.trend || weekly.weeklyTrend || [])
      setHistory(historyRes.history || historyRes.records || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [auth.consumerNo])

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      const res = await powerpulseApi.saveDailyUsage({
        consumerNo: auth.consumerNo,
        usageDate: form.usageDate,
        usageKwh: Number(form.usageKwh)
      })
      setMessage(res.message || 'Daily usage saved')
      setForm({ usageDate: '', usageKwh: '' })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <UserLayout>
      <PageShell title="Usage tracking" subtitle={`Consumer No: ${auth.consumerNo}`}>
        {loading ? <LoadingBlock label="Loading usage data..." /> : (
          <>
            <div className="grid-2">
              <Panel title="Add daily usage" subtitle="Connected to POST /user/daily-usage">
                <form className="form-grid" onSubmit={handleSubmit}>
                  <label><span>Date</span><input type="date" value={form.usageDate} onChange={(e) => setForm({ ...form, usageDate: e.target.value })} required /></label>
                  <label><span>Usage in kWh</span><input type="number" min="0" step="0.01" value={form.usageKwh} onChange={(e) => setForm({ ...form, usageKwh: e.target.value })} required /></label>
                  <button className="primary-button" type="submit">Save usage</button>
                </form>
                {message ? <div className="success-box">{message}</div> : null}
                {error ? <div className="error-box">{error}</div> : null}
              </Panel>
              <Panel title="Recent history" subtitle="Latest daily records from backend">
                <div className="table-wrap small-table">
                  <table>
                    <thead><tr><th>Date</th><th>Usage</th></tr></thead>
                    <tbody>
                      {history.slice(0, 8).map((item, index) => (
                        <tr key={`${item.usageDate || item.date}-${index}`}>
                          <td>{formatDate(item.usageDate || item.date)}</td>
                          <td>{formatUnits(item.usageKwh || item.usage || item.units)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </div>

            <div className="grid-2">
              <Panel title="Current month daily trend">
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={dailyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" tickFormatter={(_, i) => dailyTrend[i]?.day || dailyTrend[i]?.date?.slice(-2) || ''} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="usage" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="Current month weekly trend">
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={weeklyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="weekLabel" tickFormatter={(_, i) => weeklyTrend[i]?.weekLabel || `W${i+1}`} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="usage" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>
          </>
        )}
      </PageShell>
    </UserLayout>
  )
}
