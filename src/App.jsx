import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import UserLoginPage from './pages/user/UserLoginPage'
import UserRegisterPage from './pages/user/UserRegisterPage'
import UserDashboardPage from './pages/user/UserDashboardPage'
import UsagePage from './pages/user/UsagePage'
import ForecastPage from './pages/user/ForecastPage'
import PlansPage from './pages/user/PlansPage'
import ProfilePage from './pages/user/ProfilePage'
import AIAssistantPage from './pages/user/AIAssistantPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminRegisterPage from './pages/admin/AdminRegisterPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import ConsumersPage from './pages/admin/ConsumersPage'
import ConsumerDetailsPage from './pages/admin/ConsumerDetailsPage'
import MandalAnalysisPage from './pages/admin/MandalAnalysisPage'
import ReportsPage from './pages/admin/ReportsPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/user/login" element={<UserLoginPage />} />
      <Route path="/user/register" element={<UserRegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/register" element={<AdminRegisterPage />} />

      <Route path="/user" element={<ProtectedRoute role="user" />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboardPage />} />
        <Route path="usage" element={<UsagePage />} />
        <Route path="forecast" element={<ForecastPage />} />
        <Route path="plans" element={<PlansPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="ai" element={<AIAssistantPage />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute role="admin" />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="consumers" element={<ConsumersPage />} />
        <Route path="consumers/:consumerNo" element={<ConsumerDetailsPage />} />
        <Route path="mandals" element={<MandalAnalysisPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
