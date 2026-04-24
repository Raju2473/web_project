# PowerPulse Web Frontend

This is a responsive React + Vite web frontend created from your Android app structure and connected to the **same existing Flask backend**.

## What is included

### User side
- Login
- Register
- Dashboard
- Usage tracking
- Monthly forecast
- Recharge plans + order flow
- AI assistant
- Profile update

### Admin side
- Login
- Register
- Dashboard overview
- Consumer management
- Consumer details + messaging
- Mandal analysis
- Reports

## Backend integration
This frontend uses your **existing backend endpoints** such as:
- `/auth/user/login`
- `/auth/user/register`
- `/auth/user-profile`
- `/user/daily-usage`
- `/user/dashboard-summary`
- `/user/weekly-usage`
- `/predict-next-30-from-db`
- `/api/recharge-plans`
- `/user/recharge-order/create`
- `/user/recharge-order/update-status`
- `/auth/admin/login`
- `/auth/admin/register`
- `/admin/dashboard-overview`
- `/admin/consumers-management`
- `/admin/consumer-details/{consumerNo}`
- `/admin/consumer/{consumerNo}`
- `/admin/mandal-analysis`
- `/chat/history/{consumerNo}`
- `/admin/send-message`

## Configure backend URL
Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```

Replace it with your real Flask backend URL if needed.

## Run locally
```bash
npm install
npm run dev
```

## Build production
```bash
npm run build
```

## Main source folders
- `src/api` → backend API functions
- `src/pages/user` → user screens
- `src/pages/admin` → admin screens
- `src/layout` → responsive app layout
- `src/styles` → global responsive styling

## Notes
- No new backend was created.
- The frontend is designed to reuse your current Flask routes.
- Payment is implemented as a backend-connected demo success flow using existing recharge-order endpoints.
- If you want, next step can be to make this UI match your Android app design even more closely screen-by-screen.
