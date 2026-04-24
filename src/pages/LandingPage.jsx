import { Link } from 'react-router-dom'
import { BatteryCharging, ShieldCheck, Smartphone, TrendingUp } from 'lucide-react'
import { api } from '../api/client'

const features = [
  { icon: BatteryCharging, title: 'Daily usage tracking', text: 'Connect the web app to the same backend endpoints already used by your Android app.' },
  { icon: TrendingUp, title: 'Prediction dashboards', text: 'View current usage, weekly trends, monthly forecast and recharge insights in a responsive layout.' },
  { icon: ShieldCheck, title: 'Admin controls', text: 'Monitor consumers, mandal analytics, recharge plans and messaging from the browser.' },
  { icon: Smartphone, title: 'Mobile-friendly UI', text: 'The layout adapts to desktop, tablet and phone sizes without changing backend logic.' }
]

export default function LandingPage() {
  return (
    <div className="landing-shell">
      <header className="landing-header">
        <div>
          <span className="pill">Backend URL: {api.baseUrl}</span>
          <h1>PowerPulse responsive web frontend</h1>
          <p>Same Flask backend. New responsive website. No new backend required.</p>
          <div className="landing-actions">
            <Link to="/user/login" className="primary-button">User Login</Link>
            <Link to="/admin/login" className="secondary-button">Admin Login</Link>
          </div>
        </div>
        <div className="hero-card">
          <h3>Included screens</h3>
          <ul>
            <li>User login / register</li>
            <li>User dashboard, usage, plans, forecast, AI, profile</li>
            <li>Admin login / register</li>
            <li>Admin overview, consumers, mandal analysis, reports</li>
          </ul>
        </div>
      </header>

      <section className="feature-grid">
        {features.map(({ icon: Icon, title, text }) => (
          <article key={title} className="feature-card">
            <Icon size={24} />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
