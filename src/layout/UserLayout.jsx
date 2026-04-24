import { NavLink, useNavigate } from 'react-router-dom'
import { Bot, Gauge, LogOut, Receipt, User, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/user/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/user/usage', label: 'Usage', icon: Zap },
  { to: '/user/forecast', label: 'Forecast', icon: Receipt },
  { to: '/user/plans', label: 'Plans', icon: Receipt },
  { to: '/user/ai', label: 'AI', icon: Bot },
  { to: '/user/profile', label: 'Profile', icon: User }
]

export default function UserLayout({ children }) {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-badge">⚡</div>
          <div>
            <h2>PowerPulse</h2>
            <p>User Portal</p>
          </div>
        </div>
        <nav className="nav-list">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <small>{auth?.fullName}</small>
          <button className="ghost-button" onClick={() => { logout(); navigate('/user/login') }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      <main className="content-area">
        {children}
      </main>
    </div>
  )
}
