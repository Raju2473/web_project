import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../layout/AdminLayout'
import { PageShell, Panel, LoadingBlock } from '../../components/UI'
import { powerpulseApi } from '../../api/powerpulseApi'
import { formatUnits } from '../../utils/formatters'

export default function ConsumersPage() {
  const [consumers, setConsumers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await powerpulseApi.getConsumerManagement()
      setConsumers(res.consumers || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => consumers.filter((item) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return [item.consumerNo, item.fullName, item.mandal, item.status].some((v) => String(v || '').toLowerCase().includes(q))
  }), [consumers, query])

  async function handleDelete(consumerNo) {
    const ok = window.confirm(`Delete consumer ${consumerNo}?`)
    if (!ok) return
    try {
      await powerpulseApi.deleteConsumer(consumerNo)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AdminLayout>
      <PageShell title="Consumers management" subtitle="Responsive table for your admin consumer list." actions={<input className="search-input" placeholder="Search by name, consumer no, mandal" value={query} onChange={(e) => setQuery(e.target.value)} />}>
        {loading ? <LoadingBlock label="Loading consumers..." /> : error ? <div className="error-box">{error}</div> : (
          <Panel title="Consumers" subtitle={`Showing ${filtered.length} of ${consumers.length}`}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Consumer No</th>
                    <th>Name</th>
                    <th>Mandal</th>
                    <th>Avg 30D</th>
                    <th>Predicted next month</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.consumerNo}>
                      <td>{item.consumerNo}</td>
                      <td>{item.fullName}</td>
                      <td>{item.mandal}</td>
                      <td>{formatUnits(item.avgUnits30D)}</td>
                      <td>{formatUnits(item.predictedNextMonth)}</td>
                      <td>{item.status}</td>
                      <td className="table-actions">
                        <Link className="link-button" to={`/admin/consumers/${item.consumerNo}`}>View</Link>
                        <button className="danger-button" onClick={() => handleDelete(item.consumerNo)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}
      </PageShell>
    </AdminLayout>
  )
}
