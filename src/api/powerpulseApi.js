import { api } from './client'

export const powerpulseApi = {
  health: () => api.get('/health'),

  registerUser: (payload) => api.post('/auth/user/register', payload),
  loginUser: (payload) => api.post('/auth/user/login', payload),
  getUserProfile: (email) => api.get(`/auth/user-profile?email=${encodeURIComponent(email)}`),
  updateUserProfile: (payload) => api.post('/auth/user-profile/update', payload),
  saveDailyUsage: (payload) => api.post('/user/daily-usage', payload),
  getDailyUsageHistory: (consumerNo) => api.get(`/user/daily-usage-history?consumerNo=${encodeURIComponent(consumerNo)}`),
  getDashboardSummary: (consumerNo) => api.get(`/user/dashboard-summary?consumerNo=${encodeURIComponent(consumerNo)}`),
  getLatestDailyUsage: (consumerNo) => api.get(`/user/latest-daily-usage?consumerNo=${encodeURIComponent(consumerNo)}`),
  getWeeklyUsage: (consumerNo) => api.get(`/user/weekly-usage?consumerNo=${encodeURIComponent(consumerNo)}`),
  getCurrentMonthDailyTrend: (consumerNo) => api.get(`/user/current-month-daily-trend?consumerNo=${encodeURIComponent(consumerNo)}`),
  getCurrentMonthWeeklyTrend: (consumerNo) => api.get(`/user/current-month-weekly-trend?consumerNo=${encodeURIComponent(consumerNo)}`),
  getPredictionFromDb: (consumerNo) => api.get(`/predict-next-30-from-db?consumerNo=${encodeURIComponent(consumerNo)}`),
  getRechargePlans: () => api.get('/api/recharge-plans'),
  getUsagePredictPlans: () => api.get('/api/usage-predict-plans'),
  getActivePlanSummary: (consumerNo) => api.get(`/user/active-plan-summary?consumerNo=${encodeURIComponent(consumerNo)}`),
  getAlerts: (consumerNo) => api.get(`/user/alerts?consumerNo=${encodeURIComponent(consumerNo)}`),
  createRechargeOrder: (payload) => api.post('/user/recharge-order/create', payload),
  updateRechargeOrderStatus: (payload) => api.post('/user/recharge-order/update-status', payload),
  getRechargeOrder: (orderId) => api.get(`/user/recharge-order/${orderId}`),
  chatWithAI: (payload) => api.post('/api/ai-chat', payload),

  registerAdmin: (payload) => api.post('/auth/admin/register', payload),
  loginAdmin: (payload) => api.post('/auth/admin/login', payload),
  getAdminProfile: (email) => api.get(`/auth/admin/profile?email=${encodeURIComponent(email)}`),
  getAdminOverview: () => api.get('/admin/dashboard-overview'),
  getMandalAnalysis: () => api.get('/admin/mandal-analysis'),
  getConsumerManagement: () => api.get('/admin/consumers-management'),
  getConsumerDetails: (consumerNo) => api.get(`/admin/consumer-details/${encodeURIComponent(consumerNo)}`),
  deleteConsumer: (consumerNo) => api.delete(`/admin/consumer/${encodeURIComponent(consumerNo)}`),
  getChatHistory: (consumerNo) => api.get(`/chat/history/${encodeURIComponent(consumerNo)}`),
  sendAdminMessage: (payload) => api.post('/admin/send-message', payload),
  getAdminRechargePlans: () => api.get('/admin/recharge-plans')
}
