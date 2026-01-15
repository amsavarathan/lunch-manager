import { useState, useEffect } from 'react'
import {
  X,
  Bell,
  Upload,
  Phone,
  Clock,
  ChevronDown,
  Edit2,
  BellRing,
  Ban,
  Users
} from 'lucide-react'
import initialTodayOrder from '../data/todayOrder.json'
import employees from '../data/employees.json'
import vendors from '../data/vendors.json'

function VegIcon() {
  return (
    <span className="w-4 h-4 border-2 border-green-600 rounded-sm flex items-center justify-center flex-shrink-0">
      <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
    </span>
  )
}

function NonVegIcon() {
  return (
    <span className="w-4 h-4 border-2 border-red-600 rounded-sm flex items-center justify-center flex-shrink-0">
      <span className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-red-600"></span>
    </span>
  )
}

function StatusBadge({ status }) {
  const statusConfig = {
    live: { label: 'Live', dotColor: 'bg-green-500', textColor: 'text-green-700' },
    closed: { label: 'Closed', dotColor: 'bg-gray-400', textColor: 'text-gray-600' },
    exported: { label: 'Exported', dotColor: 'bg-blue-500', textColor: 'text-blue-700' }
  }
  const config = statusConfig[status] || statusConfig.live

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`}></span>
      <span className={`font-medium ${config.textColor}`}>{config.label}</span>
    </div>
  )
}

function TimeRemaining({ endTime }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 45 })

  useEffect(() => {
    // Simulated countdown - in real app, calculate from endTime
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59 }
        }
        return prev
      })
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
      <Clock className="w-4 h-4 text-gray-500" />
      <span className="font-mono font-semibold text-gray-900">
        {String(timeLeft.hours).padStart(2, '0')} : {String(timeLeft.minutes).padStart(2, '0')}
      </span>
      <span className="text-gray-500 text-sm">left</span>
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </div>
  )
}

function OrderSummary({ responses, optedOutCount, onExport }) {
  const vegItems = responses.filter(r => r.isVeg)
  const nonVegItems = responses.filter(r => !r.isVeg)

  const groupByItem = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.itemId]) {
        acc[item.itemId] = {
          ...item,
          count: 0,
          notes: []
        }
      }
      acc[item.itemId].count++
      if (item.note) {
        acc[item.itemId].notes.push(item.note)
      }
      return acc
    }, {})
  }

  const vegGrouped = Object.values(groupByItem(vegItems))
  const nonVegGrouped = Object.values(groupByItem(nonVegItems))

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-900">Order summary ({responses.length})</h3>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 text-coral-500 border border-coral-200 rounded-lg hover:bg-coral-50 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Veg Section */}
      {vegGrouped.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <VegIcon />
            <span className="text-sm font-medium text-green-700">Veg</span>
          </div>
          <div className="space-y-3">
            {vegGrouped.map(item => (
              <div key={item.itemId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-700">{item.itemName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                    {item.count}
                  </span>
                  {item.notes.length > 0 && (
                    <span className="text-coral-500 text-sm">
                      ({item.notes.length} note{item.notes.length > 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Non-Veg Section */}
      {nonVegGrouped.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <NonVegIcon />
            <span className="text-sm font-medium text-red-700">Non veg</span>
          </div>
          <div className="space-y-3">
            {nonVegGrouped.map(item => (
              <div key={item.itemId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-700">{item.itemName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                    {item.count}
                  </span>
                  {item.notes.length > 0 && (
                    <span className="text-coral-500 text-sm">
                      ({item.notes.length} note{item.notes.length > 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opted Out */}
      {optedOutCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-100">
          <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
            <span className="text-xs">i</span>
          </span>
          {optedOutCount} people were opted out
        </div>
      )}
    </div>
  )
}

function BudgetCard({ responses }) {
  const totalAmount = responses.reduce((sum, r) => sum + r.price, 0)
  const avgPerPerson = responses.length > 0 ? totalAmount / responses.length : 0

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-4">Budget</h3>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Total amount</p>
          <p className="text-2xl font-bold text-gray-900">
            <span className="text-lg">₹</span> {totalAmount.toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Avg / person</p>
          <p className="text-2xl font-bold text-gray-900">
            <span className="text-lg">₹</span> {Math.round(avgPerPerson)}
            <span className="text-sm font-normal text-gray-500 ml-1">
              ({responses.length} orders)
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

function OrderTimeline({ status }) {
  const steps = [
    { id: 'created', label: 'Poll created', completed: true },
    { id: 'collecting', label: 'Collecting responses', active: status === 'live' },
    { id: 'closed', label: 'Poll closed', completed: status === 'closed' || status === 'exported' },
    { id: 'export', label: 'Export order', completed: status === 'exported' },
    { id: 'placed', label: 'Order placed', completed: false },
    { id: 'delivered', label: 'Delivered', completed: false }
  ]

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 mb-5">Order details</h3>
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-3 pb-6 last:pb-0">
            <div className="relative flex flex-col items-center">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                step.completed ? 'bg-green-500' :
                step.active ? 'bg-green-500' : 'bg-gray-300'
              }`}></span>
              {index < steps.length - 1 && (
                <span className={`w-0.5 h-full absolute top-3 ${
                  step.completed ? 'bg-green-500' : 'bg-gray-200'
                }`}></span>
              )}
            </div>
            <span className={`text-sm ${
              step.completed || step.active ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PendingResponses({ pendingIds, onNudgeAll }) {
  const pendingEmployees = pendingIds.map(id =>
    employees.find(e => e.id === id)
  ).filter(Boolean)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-900">
          Pending responses ({pendingEmployees.length})
        </h3>
        <button
          onClick={onNudgeAll}
          className="flex items-center gap-2 text-coral-500 text-sm font-medium hover:text-coral-600"
        >
          <Bell className="w-4 h-4" />
          Nudge all
        </button>
      </div>

      <div className="space-y-3">
        {pendingEmployees.map(employee => (
          <div key={employee.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{employee.name}</p>
                <p className="text-sm text-gray-500">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <BellRing className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Ban className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TomorrowOrderCard({ tomorrowOrder, vendor }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Tomorrow's order</h3>
        <button className="flex items-center gap-1 text-coral-500 text-sm font-medium hover:text-coral-600">
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Plan</p>
          <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
            {tomorrowOrder.planName}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Restaurant</p>
          <div className="px-3 py-2 bg-gray-50 rounded-lg flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{tomorrowOrder.vendorName}</span>
            <VegIcon />
            <NonVegIcon />
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Post timing</p>
          <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
            {tomorrowOrder.postTime}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Cut-off timing</p>
          <p className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
            {tomorrowOrder.cutOffTime}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [todayOrder, setTodayOrder] = useState(initialTodayOrder)
  const vendor = vendors.find(v => v.id === todayOrder.vendorId)

  const responseCount = todayOrder.responses.length
  const totalEmployees = todayOrder.totalEmployees
  const responsePercentage = Math.round((responseCount / totalEmployees) * 100)

  const handleClosePoll = () => {
    setTodayOrder(prev => ({ ...prev, status: 'closed' }))
  }

  const handleExport = () => {
    setTodayOrder(prev => ({ ...prev, status: 'exported' }))
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Today's order</h1>

      {/* Header Bar */}
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Plan Name */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Plan Name</p>
              <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                {todayOrder.planName}
              </span>
            </div>

            {/* Restaurant */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Restaurant</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                  {todayOrder.vendorName}
                </span>
                <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  <Phone className="w-4 h-4" />
                  Contact
                </button>
              </div>
            </div>

            {/* Response */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Response</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">{responseCount}</span>
                <span className="text-gray-400">/ {totalEmployees}</span>
                <span className="text-green-600 font-medium">{responsePercentage}%</span>
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
              <StatusBadge status={todayOrder.status} />
            </div>

            {/* Time Remaining */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Time Remaining</p>
              <TimeRemaining endTime={todayOrder.pollSettings.closeTime} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleClosePoll}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Close poll
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-coral-500 text-white rounded-lg font-medium hover:bg-coral-600 transition-colors">
              <Bell className="w-4 h-4" />
              Send reminder
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Order Summary */}
        <div className="col-span-4">
          <OrderSummary
            responses={todayOrder.responses}
            optedOutCount={todayOrder.optedOut.length}
            onExport={handleExport}
          />
        </div>

        {/* Middle Column - Budget & Timeline */}
        <div className="col-span-4 space-y-6">
          <BudgetCard responses={todayOrder.responses} />
          <OrderTimeline status={todayOrder.status} />
        </div>

        {/* Right Column - Pending & Tomorrow */}
        <div className="col-span-4 space-y-6">
          <PendingResponses
            pendingIds={todayOrder.pendingResponses}
            onNudgeAll={() => console.log('Nudge all')}
          />
          <TomorrowOrderCard
            tomorrowOrder={todayOrder.tomorrowOrder}
            vendor={vendors.find(v => v.id === todayOrder.tomorrowOrder?.vendorId)}
          />
        </div>
      </div>
    </div>
  )
}
