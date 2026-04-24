import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../../components/AuthForm'
import { powerpulseApi } from '../../api/powerpulseApi'

export default function AdminRegisterPage() {
  const [form, setForm] = useState({ fullName: '', orgName: '', boardId: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await powerpulseApi.registerAdmin(form)
      setMessage(res.message || 'Admin registration successful')
      setTimeout(() => navigate('/admin/login'), 800)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      title="Create admin account"
      subtitle="This is connected to POST /auth/admin/register."
      submitLabel={loading ? 'Creating account...' : 'Register'}
      onSubmit={handleSubmit}
      fields={(
        <>
          <label><span>Full name</span><input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></label>
          <label><span>Organization name</span><input value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} required /></label>
          <label><span>Board ID</span><input value={form.boardId} onChange={(e) => setForm({ ...form, boardId: e.target.value })} /></label>
          <label><span>Email</span><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label><span>Password</span><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          <label><span>Confirm password</span><input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required /></label>
          {error ? <div className="error-box">{error}</div> : null}
          {message ? <div className="success-box">{message}</div> : null}
        </>
      )}
      footer={<p>Already have an admin account? <Link to="/admin/login">Login</Link></p>}
    />
  )
}
