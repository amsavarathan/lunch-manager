import { useState } from 'react'
import {
  Bell,
  Clock,
  Users,
  Building2,
  Globe,
  Moon,
  Shield
} from 'lucide-react'

export default function Settings() {
  const [notifications, setNotifications] = useState({
    pollReminders: true,
    orderUpdates: true,
    dailySummary: false
  })

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Settings</h1>

      <div className="max-w-2xl space-y-6">
        {/* Notifications */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-coral-50 rounded-lg">
              <Bell className="w-5 h-5 text-coral-500" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">Manage how you receive notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Poll reminders</p>
                <p className="text-sm text-gray-500">Get notified when a poll is about to close</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.pollReminders}
                onChange={(e) => setNotifications({ ...notifications, pollReminders: e.target.checked })}
                className="w-5 h-5 text-coral-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Order updates</p>
                <p className="text-sm text-gray-500">Get notified when order status changes</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.orderUpdates}
                onChange={(e) => setNotifications({ ...notifications, orderUpdates: e.target.checked })}
                className="w-5 h-5 text-coral-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Daily summary</p>
                <p className="text-sm text-gray-500">Receive a daily email summary of orders</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.dailySummary}
                onChange={(e) => setNotifications({ ...notifications, dailySummary: e.target.checked })}
                className="w-5 h-5 text-coral-500 rounded"
              />
            </label>
          </div>
        </div>

        {/* Default Poll Settings */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Default Poll Settings</h2>
              <p className="text-sm text-gray-500">Configure default settings for new polls</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default post time</label>
              <input type="time" defaultValue="09:00" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default cut-off time</label>
              <input type="time" defaultValue="11:00" className="input" />
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-50 rounded-lg">
              <Building2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Organization</h2>
              <p className="text-sm text-gray-500">Manage your organization settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization name</label>
              <input type="text" defaultValue="Thoughtbridge Inc." className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select className="input">
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-6 py-2.5 bg-coral-500 text-white rounded-lg font-medium hover:bg-coral-600 transition-colors">
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}
