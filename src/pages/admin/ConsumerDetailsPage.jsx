import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import AdminLayout from '../../layout/AdminLayout'
import { PageShell, Panel, LoadingBlock } from '../../components/UI'
import { powerpulseApi } from '../../api/powerpulseApi'
import { formatDate, formatDateTime, formatUnits } from '../../utils/formatters'

export default function ConsumerDetailsPage() {
  const { consumerNo } = useParams()
  const [consumer, setConsumer] = useState(null)
  const [history, setHistory] = useState([])
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [detailsRes, chatRes] = await Promise.all([
          powerpulseApi.getConsumerDetails(consumerNo),
          powerpulseApi.getChatHistory(consumerNo).catch(() => ({ history: [] }))
        ])
        setConsumer(detailsRes.consumer)
        setHistory(detailsRes.consumer?.dailyUsage || [])
        setChat(chatRes.history || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [consumerNo])

  async function sendMessage(e) {
    e.preventDefault()
    if (!message.trim()) return
    try {
      await powerpulseApi.sendAdminMessage({ consumerNo, message: message.trim() })
      const chatRes = await powerpulseApi.getChatHistory(consumerNo)
      setChat(chatRes.history || [])
      setMessage('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <AdminLayout>
      <PageShell title={`Consumer ${consumerNo}`} subtitle="Detail view using GET /admin/consumer-details/{consumerNo}">
        {loading ? <LoadingBlock label="Loading consumer details..." /> : error ? <div className="error-box">{error}</div> : (
          <>
            <div className="grid-2">
              <Panel title="Consumer profile">
                <div className="detail-list">
                  <div><span>Name</span><strong>{consumer?.fullName}</strong></div>
                  <div><span>Mandal</span><strong>{consumer?.mandal}</strong></div>
                  <div><span>Remaining days</span><strong>{consumer?.remainingDays ?? 0}</strong></div>
                  <div><span>Last graph point</span><strong>{history.length ? `${formatDate(history.at(-1).date)} • ${formatUnits(history.at(-1).usage)}` : 'No usage data'}</strong></div>
                </div>
              </Panel>
              <Panel title="Daily usage graph">
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => formatDate(value)} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="usage" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>
            <div className="grid-2">
              <Panel title="Send message">
                <form className="chat-form" onSubmit={sendMessage}>
                  <textarea rows="4" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Send admin message to this consumer" />
                  <button type="submit" className="primary-button">Send</button>
                </form>
              </Panel>
              <Panel title="Chat history">
                <div className="chat-thread compact">
                  {chat.map((item) => (
                    <div key={item.id} className={`chat-bubble ${item.senderRole === 'ADMIN' ? 'assistant' : 'user'}`}>
                      <strong>{item.senderRole}</strong>
                      <p>{item.message}</p>
                      <small>{formatDateTime(item.createdAt)}</small>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </>
        )}
      </PageShell>
    </AdminLayout>
  )
}
