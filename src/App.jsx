import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import LunchPlans from './pages/LunchPlans'
import Vendors from './pages/Vendors'
import CreatePoll from './pages/CreatePoll'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="plans" element={<LunchPlans />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="create-poll" element={<CreatePoll />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
