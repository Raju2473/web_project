import { useState } from 'react'
import UserLayout from '../../layout/UserLayout'
import { PageShell, Panel } from '../../components/UI'
import { powerpulseApi } from '../../api/powerpulseApi'
import { useAuth } from '../../context/AuthContext'

export default function AIAssistantPage() {
  const { auth } = useAuth()
  const [prompt, setPrompt] = useState('Show me my electricity usage insight for this month.')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function askAI(e) {
    e.preventDefault()
    if (!prompt.trim()) return
    const currentPrompt = prompt.trim()
    setLoading(true)
    setError('')
    setMessages((prev) => [...prev, { role: 'USER', text: currentPrompt }])
    setPrompt('')
    try {
      const res = await powerpulseApi.chatWithAI({ consumerNo: auth.consumerNo, message: currentPrompt })
      setMessages((prev) => [...prev, { role: 'AI', text: res.reply || res.message || 'No response' }])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserLayout>
      <PageShell title="AI assistant" subtitle="Connected to POST /api/ai-chat using your existing backend.">
        <Panel title="Ask about usage, plans, or forecast">
          <form className="chat-form" onSubmit={askAI}>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows="4" placeholder="Type your question" />
            <button className="primary-button" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
          </form>
          {error ? <div className="error-box">{error}</div> : null}
          <div className="chat-thread">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role === 'AI' ? 'assistant' : 'user'}`}>
                <strong>{message.role === 'AI' ? 'PowerPulse AI' : 'You'}</strong>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
        </Panel>
      </PageShell>
    </UserLayout>
  )
}
