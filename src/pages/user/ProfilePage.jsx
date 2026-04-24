import { useEffect, useState } from 'react'
import UserLayout from '../../layout/UserLayout'
import { PageShell, Panel, LoadingBlock } from '../../components/UI'
import { powerpulseApi } from '../../api/powerpulseApi'
import { useAuth } from '../../context/AuthContext'

export default function ProfilePage() {
  const { auth, login } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ fullName: '', mandal: '' })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await powerpulseApi.getUserProfile(auth.email)
        setProfile(res.user)
        setForm({ fullName: res.user?.fullName || '', mandal: res.user?.mandal || '' })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [auth.email])

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      const res = await powerpulseApi.updateUserProfile({ email: auth.email, ...form })
      setMessage(res.message || 'Profile updated')
      login({ ...auth, fullName: form.fullName || auth.fullName })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <UserLayout>
      <PageShell title="Profile" subtitle="Connected to GET and POST user profile endpoints.">
        {loading ? <LoadingBlock label="Loading profile..." /> : (
          <div className="grid-2">
            <Panel title="Current profile">
              <div className="detail-list">
                <div><span>Full name</span><strong>{profile?.fullName || '-'}</strong></div>
                <div><span>Email</span><strong>{profile?.email || '-'}</strong></div>
                <div><span>Consumer No</span><strong>{profile?.consumerNo || '-'}</strong></div>
                <div><span>Mandal</span><strong>{profile?.mandal || '-'}</strong></div>
              </div>
            </Panel>
            <Panel title="Update profile">
              <form className="form-grid" onSubmit={handleSubmit}>
                <label><span>Full name</span><input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></label>
                <label><span>Mandal</span><input value={form.mandal} onChange={(e) => setForm({ ...form, mandal: e.target.value })} /></label>
                <button className="primary-button" type="submit">Save changes</button>
              </form>
              {message ? <div className="success-box">{message}</div> : null}
              {error ? <div className="error-box">{error}</div> : null}
            </Panel>
          </div>
        )}
      </PageShell>
    </UserLayout>
  )
}
