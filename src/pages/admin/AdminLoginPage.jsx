import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../../components/AuthForm'
import { powerpulseApi } from '../../api/powerpulseApi'
import { useAuth } from '../../context/AuthContext'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ orgName: '', boardId: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await powerpulseApi.loginAdmin(form)
      login({
        role: 'admin',
        accessToken: res.accessToken,
        email: res.admin?.email || form.email,
        fullName: res.admin?.fullName || 'Admin',
        boardId: res.admin?.boardId || form.boardId,
        orgName: res.admin?.orgName || form.orgName
      })
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      title="Admin login"
      subtitle="Use existing org name, board ID, email and password from your backend."
      submitLabel={loading ? 'Signing in...' : 'Login'}
      onSubmit={handleSubmit}
      fields={(
        <>
          <label><span>Organization name</span><input value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} required /></label>
          <label><span>Board ID</span><input value={form.boardId} onChange={(e) => setForm({ ...form, boardId: e.target.value })} required /></label>
          <label><span>Email</span><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label><span>Password</span><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          {error ? <div className="error-box">{error}</div> : null}
        </>
      )}
      footer={<p>Need an admin account? <Link to="/admin/register">Create admin account</Link></p>}
    />
  )
}
