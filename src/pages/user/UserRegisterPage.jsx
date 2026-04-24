import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../../components/AuthForm'
import { powerpulseApi } from '../../api/powerpulseApi'

export default function UserRegisterPage() {
  const [form, setForm] = useState({ fullName: '', mandal: '', email: '', password: '', confirmPassword: '' })
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
      const res = await powerpulseApi.registerUser(form)
      setMessage(res.message || 'Registration successful')
      setTimeout(() => navigate('/user/login'), 800)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      title="Create user account"
      subtitle="This uses POST /auth/user/register from your current backend."
      submitLabel={loading ? 'Creating account...' : 'Register'}
      onSubmit={handleSubmit}
      fields={(
        <>
          <label><span>Full name</span><input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></label>
          <label><span>Mandal</span><input value={form.mandal} onChange={(e) => setForm({ ...form, mandal: e.target.value })} /></label>
          <label><span>Email</span><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label><span>Password</span><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
          <label><span>Confirm password</span><input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required /></label>
          {error ? <div className="error-box">{error}</div> : null}
          {message ? <div className="success-box">{message}</div> : null}
        </>
      )}
      footer={<p>Already have an account? <Link to="/user/login">Login</Link></p>}
    />
  )
}
