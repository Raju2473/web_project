import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../../components/AuthForm'
import { powerpulseApi } from '../../api/powerpulseApi'
import { useAuth } from '../../context/AuthContext'

export default function UserLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await powerpulseApi.loginUser(form)
      login({
        role: 'user',
        accessToken: res.accessToken,
        email: res.email,
        fullName: res.fullName,
        consumerNo: res.consumerNo
      })
      navigate('/user/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthForm
      title="User login"
      subtitle="Sign in with the same credentials used in the Android app."
      submitLabel={loading ? 'Signing in...' : 'Login'}
      onSubmit={handleSubmit}
      fields={(
        <>
          <label><span>Email</span><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required /></label>
          <label><span>Password</span><input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" required /></label>
          {error ? <div className="error-box">{error}</div> : null}
        </>
      )}
      footer={<p>New user? <Link to="/user/register">Create account</Link></p>}
    />
  )
}
