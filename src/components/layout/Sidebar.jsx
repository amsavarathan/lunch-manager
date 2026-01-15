import { NavLink } from 'react-router-dom'
import {
  Home,
  ShoppingCart,
  FileText,
  User,
  Plus,
  Settings
} from 'lucide-react'

const mainNavItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/plans', icon: FileText, label: 'Lunch plans' },
  { to: '/vendors', icon: User, label: 'Vendors' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      <nav className="flex-1 py-6 px-4">
        {/* Main Navigation */}
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'text-coral-500'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`p-2 rounded-xl ${isActive ? 'bg-coral-50' : ''}`}>
                      <item.icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="my-4 border-t border-gray-100" />

        {/* Create Poll Button */}
        <NavLink
          to="/create-poll"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
              isActive
                ? 'text-coral-500'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`
          }
        >
          <span className="p-2 bg-coral-500 rounded-xl">
            <Plus className="w-5 h-5 text-white" strokeWidth={2} />
          </span>
          <span className="font-medium">Create a poll</span>
        </NavLink>

        {/* Divider */}
        <div className="my-4 border-t border-gray-100" />

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
              isActive
                ? 'text-coral-500'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`p-2 rounded-xl ${isActive ? 'bg-coral-50' : ''}`}>
                <Settings className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
              </span>
              <span className="font-medium">Settings</span>
            </>
          )}
        </NavLink>
      </nav>

      {/* User Avatar */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </div>
    </aside>
  )
}
