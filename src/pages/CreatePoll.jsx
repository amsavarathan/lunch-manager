import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Building2,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react'
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

export default function CreatePoll() {
  const navigate = useNavigate()
  const [selectedVendor, setSelectedVendor] = useState('')
  const [selectedItems, setSelectedItems] = useState([])
  const [closeTime, setCloseTime] = useState('11:00')
  const [isCreated, setIsCreated] = useState(false)

  const activeVendors = vendors.filter(v => v.isActive)
  const vendor = vendors.find(v => v.id === selectedVendor)

  const vegItems = vendor?.menuItems?.filter(i => i.isVeg) || []
  const nonVegItems = vendor?.menuItems?.filter(i => !i.isVeg) || []

  const toggleItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const selectAllItems = () => {
    if (vendor) {
      setSelectedItems(vendor.menuItems.map(item => item.id))
    }
  }

  const handleCreate = () => {
    setIsCreated(true)
    setTimeout(() => {
      navigate('/')
    }, 2000)
  }

  if (isCreated) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="card max-w-md text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Poll Created!</h2>
          <p className="text-gray-500">
            Your poll has been created and will be sent to all employees.
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Create a poll</h1>
        <p className="text-sm text-gray-500 mt-1">Create a one-time poll for today's lunch</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Vendor Selection */}
        <div className="card">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Building2 className="w-4 h-4" />
            Select Restaurant
          </div>

          <div className="grid grid-cols-2 gap-3">
            {activeVendors.map(v => {
              const hasVeg = v.menuItems?.some(i => i.isVeg)
              const hasNonVeg = v.menuItems?.some(i => !i.isVeg)

              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVendor(v.id)
                    setSelectedItems([])
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedVendor === v.id
                      ? 'border-coral-300 bg-coral-50'
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <p className="font-medium text-gray-900">{v.name}</p>
                  <p className="text-sm text-gray-500 mb-2">{v.cuisine}</p>
                  <div className="flex items-center gap-2">
                    {hasVeg && <VegIcon />}
                    {hasNonVeg && <NonVegIcon />}
                  </div>
                </button>
              )
            })}
          </div>

          {activeVendors.length === 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">No Active Vendors</p>
                <p className="text-sm text-yellow-700">
                  Please add and activate at least one vendor before creating a poll.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        {vendor && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Select Menu Items</h2>
              <button
                onClick={selectAllItems}
                className="text-sm text-coral-500 font-medium hover:text-coral-600"
              >
                Select All
              </button>
            </div>

            {/* Veg Items */}
            {vegItems.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <VegIcon />
                  <span className="text-sm font-medium text-green-700">Veg</span>
                </div>
                <div className="space-y-2">
                  {vegItems.map(item => (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedItems.includes(item.id)
                          ? 'border-coral-300 bg-coral-50'
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItem(item.id)}
                          className="w-4 h-4 text-coral-500 rounded"
                        />
                        <span className="text-gray-900">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-600">₹{item.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Non-Veg Items */}
            {nonVegItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <NonVegIcon />
                  <span className="text-sm font-medium text-red-700">Non veg</span>
                </div>
                <div className="space-y-2">
                  {nonVegItems.map(item => (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedItems.includes(item.id)
                          ? 'border-coral-300 bg-coral-50'
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItem(item.id)}
                          className="w-4 h-4 text-coral-500 rounded"
                        />
                        <span className="text-gray-900">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-600">₹{item.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {selectedItems.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>
        )}

        {/* Poll Settings */}
        {vendor && selectedItems.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Clock className="w-4 h-4" />
              Poll Settings
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poll Cut-off Time
              </label>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="input max-w-xs"
              />
              <p className="text-sm text-gray-500 mt-2">
                Employees can submit their orders until this time
              </p>
            </div>
          </div>
        )}

        {/* Summary & Create */}
        {vendor && selectedItems.length > 0 && (
          <div className="card bg-coral-50 border border-coral-100">
            <h2 className="font-semibold text-gray-900 mb-4">Poll Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Restaurant</span>
                <span className="font-medium text-gray-900">{vendor.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Menu Items</span>
                <span className="font-medium text-gray-900">{selectedItems.length} items</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cut-off Time</span>
                <span className="font-medium text-gray-900">
                  {new Date(`2024-01-01T${closeTime}`).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
            </div>

            <button
              onClick={handleCreate}
              className="w-full py-3 bg-coral-500 text-white rounded-lg font-medium hover:bg-coral-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create & Send Poll
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
