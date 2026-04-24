import { BarChart3, Building2, LayoutDashboard, LogOut, Users } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/consumers', label: 'Consumers', icon: Users },
  { to: '/admin/mandals', label: 'Mandals', icon: Building2 },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 }
]

export default function AdminLayout({ children }) {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-layout admin-layout">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-badge admin">⚙️</div>
          <div>
            <h2>PowerPulse</h2>
            <p>Admin Portal</p>
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
          <button className="ghost-button" onClick={() => { logout(); navigate('/admin/login') }}>
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
