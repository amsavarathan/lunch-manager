import { useState } from 'react'
import {
  Plus,
  Building2,
  RefreshCw,
  Calendar,
  Clock,
  Users,
  Bell,
  ChevronRight,
  Edit2,
  MoreHorizontal,
  X,
  Pencil,
  ChevronDown,
  Info
} from 'lucide-react'
import initialPlans from '../data/plans.json'
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

// Add Restaurant Modal - Split view with restaurant list and menu items
function AddRestaurantModal({ isOpen, onClose, onAdd, selectedVendors, selectedMenuItems }) {
  const [localSelectedVendors, setLocalSelectedVendors] = useState(selectedVendors || [])
  const [localSelectedMenuItems, setLocalSelectedMenuItems] = useState(selectedMenuItems || {})
  const [activeVendorId, setActiveVendorId] = useState(null)

  // Reset state when modal opens
  useState(() => {
    if (isOpen) {
      setLocalSelectedVendors(selectedVendors || [])
      setLocalSelectedMenuItems(selectedMenuItems || {})
      setActiveVendorId(selectedVendors?.[0] || null)
    }
  }, [isOpen, selectedVendors, selectedMenuItems])

  if (!isOpen) return null

  const toggleVendor = (vendorId) => {
    if (localSelectedVendors.includes(vendorId)) {
      setLocalSelectedVendors(localSelectedVendors.filter(id => id !== vendorId))
      const newMenuItems = { ...localSelectedMenuItems }
      delete newMenuItems[vendorId]
      setLocalSelectedMenuItems(newMenuItems)
      if (activeVendorId === vendorId) {
        // Set to another selected vendor or null
        const remaining = localSelectedVendors.filter(id => id !== vendorId)
        setActiveVendorId(remaining[0] || null)
      }
    } else {
      setLocalSelectedVendors([...localSelectedVendors, vendorId])
      // Auto-select all menu items for this vendor
      const vendor = vendors.find(v => v.id === vendorId)
      if (vendor?.menuItems) {
        setLocalSelectedMenuItems({
          ...localSelectedMenuItems,
          [vendorId]: vendor.menuItems.map(item => item.id)
        })
      }
      setActiveVendorId(vendorId)
    }
  }

  const selectVendorForMenu = (vendorId) => {
    if (localSelectedVendors.includes(vendorId)) {
      setActiveVendorId(vendorId)
    }
  }

  const toggleMenuItem = (vendorId, itemId) => {
    const vendorItems = localSelectedMenuItems[vendorId] || []
    if (vendorItems.includes(itemId)) {
      setLocalSelectedMenuItems({
        ...localSelectedMenuItems,
        [vendorId]: vendorItems.filter(id => id !== itemId)
      })
    } else {
      setLocalSelectedMenuItems({
        ...localSelectedMenuItems,
        [vendorId]: [...vendorItems, itemId]
      })
    }
  }

  const activeVendor = vendors.find(v => v.id === activeVendorId)
  const vegItems = activeVendor?.menuItems?.filter(i => i.isVeg) || []
  const nonVegItems = activeVendor?.menuItems?.filter(i => !i.isVeg) || []

  const handleAdd = () => {
    onAdd(localSelectedVendors, localSelectedMenuItems)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add a restaurant</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex h-[400px]">
          {/* Restaurant List */}
          <div className="w-1/2 border-r border-gray-100 p-4 overflow-y-auto">
            <p className="text-sm text-gray-500 mb-3">Restaurants</p>
            <div className="space-y-1">
              {vendors.filter(v => v.isActive).map(vendor => {
                const isSelected = localSelectedVendors.includes(vendor.id)
                const isViewing = activeVendorId === vendor.id
                return (
                  <div
                    key={vendor.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      isViewing ? 'bg-gray-100' : isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => selectVendorForMenu(vendor.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation()
                        toggleVendor(vendor.id)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 rounded border-gray-300 text-gray-900 cursor-pointer"
                    />
                    <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                      {vendor.name}
                    </span>
                    {isSelected && (
                      <span className="ml-auto text-gray-900">✓</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Menu Items */}
          <div className="w-1/2 p-4 overflow-y-auto">
            {activeVendor && localSelectedVendors.includes(activeVendorId) ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500">Menu items</p>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>

                {vegItems.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <VegIcon />
                      <span className="text-xs font-medium text-green-700">Veg</span>
                    </div>
                    <div className="space-y-1">
                      {vegItems.map(item => (
                        <label
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={(localSelectedMenuItems[activeVendorId] || []).includes(item.id)}
                            onChange={() => toggleMenuItem(activeVendorId, item.id)}
                            className="w-5 h-5 rounded border-gray-300 text-gray-900"
                          />
                          <span className="text-gray-900">{item.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {nonVegItems.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <NonVegIcon />
                      <span className="text-xs font-medium text-red-700">Non veg</span>
                    </div>
                    <div className="space-y-1">
                      {nonVegItems.map(item => (
                        <label
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={(localSelectedMenuItems[activeVendorId] || []).includes(item.id)}
                            onChange={() => toggleMenuItem(activeVendorId, item.id)}
                            className="w-5 h-5 rounded border-gray-300 text-gray-900"
                          />
                          <span className="text-gray-900">{item.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                {localSelectedVendors.length === 0
                  ? 'Select a restaurant to view menu items'
                  : 'Click on a selected restaurant to view its menu'}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={localSelectedVendors.length === 0}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

// Create/Edit Plan Modal
function PlanModal({ isOpen, onClose, onSave, plan }) {
  const [formData, setFormData] = useState(plan || {
    name: '',
    description: '',
    vendors: [],
    menuItems: {},
    rotationType: 'Round robin',
    schedule: { days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
    pollSettings: { postTime: '10:00', closeTime: '12:00' },
    audience: 'Everyone',
    notifications: [{ value: 10, unit: 'Minutes' }]
  })
  const [showRestaurantModal, setShowRestaurantModal] = useState(false)

  // Reset form when modal opens with new plan
  useState(() => {
    if (isOpen) {
      setFormData(plan || {
        name: '',
        description: '',
        vendors: [],
        menuItems: {},
        rotationType: 'Round robin',
        schedule: { days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] },
        pollSettings: { postTime: '10:00', closeTime: '12:00' },
        audience: 'Everyone',
        notifications: [{ value: 10, unit: 'Minutes' }]
      })
    }
  }, [isOpen, plan])

  if (!isOpen) return null

  const allDays = [
    { key: 'sunday', label: 'S' },
    { key: 'monday', label: 'M' },
    { key: 'tuesday', label: 'T' },
    { key: 'wednesday', label: 'W' },
    { key: 'thursday', label: 'T' },
    { key: 'friday', label: 'F' },
    { key: 'saturday', label: 'S' }
  ]

  const toggleDay = (day) => {
    const days = formData.schedule.days.includes(day)
      ? formData.schedule.days.filter(d => d !== day)
      : [...formData.schedule.days, day]
    setFormData({ ...formData, schedule: { ...formData.schedule, days } })
  }

  const addNotification = () => {
    setFormData({
      ...formData,
      notifications: [...formData.notifications, { value: 10, unit: 'Minutes' }]
    })
  }

  const updateNotification = (index, field, value) => {
    const newNotifications = [...formData.notifications]
    newNotifications[index] = { ...newNotifications[index], [field]: value }
    setFormData({ ...formData, notifications: newNotifications })
  }

  const removeNotification = (index) => {
    setFormData({
      ...formData,
      notifications: formData.notifications.filter((_, i) => i !== index)
    })
  }

  const handleRestaurantAdd = (selectedVendors, selectedMenuItems) => {
    setFormData({
      ...formData,
      vendors: selectedVendors,
      menuItems: selectedMenuItems
    })
  }

  const removeVendor = (vendorId) => {
    const newMenuItems = { ...formData.menuItems }
    delete newMenuItems[vendorId]
    setFormData({
      ...formData,
      vendors: formData.vendors.filter(id => id !== vendorId),
      menuItems: newMenuItems
    })
  }

  const selectedVendorObjects = formData.vendors.map(vId => vendors.find(v => v.id === vId)).filter(Boolean)

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
        <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {plan ? 'Edit lunch plan' : 'Create a lunch plan'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Name */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Pencil className="w-4 h-4" />
                Name
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="December plan"
                className="input"
              />
              <p className="text-xs text-gray-400 mt-1">Ex: Everyday meal, Weekend special</p>
            </div>

            {/* Restaurants */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Building2 className="w-4 h-4" />
                Restaurants
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {selectedVendorObjects.map(vendor => (
                  <span
                    key={vendor.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700"
                  >
                    {vendor.name}
                    <button
                      onClick={() => removeVendor(vendor.id)}
                      className="hover:text-gray-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setShowRestaurantModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4" />
                  Add restaurant
                </button>
              </div>
            </div>

            {/* Restaurant rotation */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <RefreshCw className="w-4 h-4" />
                Restaurant rotation
              </div>
              <div className="relative">
                <select
                  value={formData.rotationType}
                  onChange={(e) => setFormData({ ...formData, rotationType: e.target.value })}
                  className="input appearance-none pr-10"
                >
                  <option value="Round robin">Rotate</option>
                  <option value="Random">Random</option>
                  <option value="Manual">Manual</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Days */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Calendar className="w-4 h-4" />
                Days
              </div>
              <div className="flex gap-2">
                {allDays.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggleDay(key)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      formData.schedule.days.includes(key)
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timings */}
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Clock className="w-4 h-4" />
                    Post timing
                  </div>
                  <div className="relative">
                    <input
                      type="time"
                      value={formData.pollSettings.postTime}
                      onChange={(e) => setFormData({
                        ...formData,
                        pollSettings: { ...formData.pollSettings, postTime: e.target.value }
                      })}
                      className="input"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Clock className="w-4 h-4 opacity-0" />
                    Cut-off timing
                  </div>
                  <div className="relative">
                    <input
                      type="time"
                      value={formData.pollSettings.closeTime}
                      onChange={(e) => setFormData({
                        ...formData,
                        pollSettings: { ...formData.pollSettings, closeTime: e.target.value }
                      })}
                      className="input"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Info className="w-4 h-4" />
                Poll will be posted automatically
              </div>
            </div>

            {/* Audience */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Users className="w-4 h-4" />
                Audience
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <select
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  className="input pl-11 appearance-none pr-10"
                >
                  <option value="Everyone">Everyone</option>
                  <option value="Specific groups">Specific groups</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Notifications */}
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Bell className="w-4 h-4" />
                Notification
              </div>
              <div className="space-y-3">
                {formData.notifications.map((notif, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="number"
                      value={notif.value}
                      onChange={(e) => updateNotification(idx, 'value', parseInt(e.target.value) || 0)}
                      className="input w-20 text-center"
                      min="1"
                    />
                    <div className="relative flex-1 max-w-[120px]">
                      <select
                        value={notif.unit}
                        onChange={(e) => updateNotification(idx, 'unit', e.target.value)}
                        className="input appearance-none pr-8"
                      >
                        <option value="Minutes">Minutes</option>
                        <option value="Hour">Hour</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <span className="text-sm text-gray-500">Before</span>
                    {formData.notifications.length > 1 && (
                      <button
                        onClick={() => removeNotification(idx)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addNotification}
                className="flex items-center gap-1.5 mt-3 text-sm text-gray-600 hover:text-gray-900"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name.trim() || formData.vendors.length === 0}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {plan ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </div>

      <AddRestaurantModal
        isOpen={showRestaurantModal}
        onClose={() => setShowRestaurantModal(false)}
        onAdd={handleRestaurantAdd}
        selectedVendors={formData.vendors}
        selectedMenuItems={formData.menuItems}
      />
    </>
  )
}

function PlanCard({ plan, isSelected, onSelect, onToggle, isOnlyActive }) {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleToggle = (e) => {
    e.stopPropagation()
    if (plan.isActive && isOnlyActive) {
      return // Can't turn off the only active plan
    }
    onToggle(plan.id)
  }

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl cursor-pointer transition-all ${
        isSelected
          ? 'bg-white border-2 border-coral-200 shadow-sm'
          : 'bg-white border border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
        </div>
        <div
          className="relative"
          onMouseEnter={() => plan.isActive && isOnlyActive && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
              At least one plan must be active
              <div className="absolute top-full right-3 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-900"></div>
            </div>
          )}
          <label
            className={`relative inline-flex items-center ${plan.isActive && isOnlyActive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            onClick={handleToggle}
          >
            <input
              type="checkbox"
              checked={plan.isActive}
              onChange={() => {}}
              className="sr-only peer"
            />
            <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
              plan.isActive ? 'bg-green-500' : 'bg-gray-200'
            }`}></div>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        {plan.hasVeg && (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-md border border-green-100">
            <VegIcon />
            <span className="text-xs font-medium text-green-700">Veg</span>
          </span>
        )}
        {plan.hasNonVeg && (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-red-50 rounded-md border border-red-100">
            <NonVegIcon />
            <span className="text-xs font-medium text-red-700">Non veg</span>
          </span>
        )}
      </div>
    </div>
  )
}

function PlanDetail({ plan, onEdit, onToggle, isOnlyActive }) {
  const [showTooltip, setShowTooltip] = useState(false)
  const planVendors = plan.vendors.map(vId => vendors.find(v => v.id === vId)).filter(Boolean)
  const nextUpVendors = plan.nextUpVendors?.map(vId => vendors.find(v => v.id === vId)).filter(Boolean) || []

  const dayLabels = {
    sunday: 'S',
    monday: 'M',
    tuesday: 'T',
    wednesday: 'W',
    thursday: 'T',
    friday: 'F',
    saturday: 'S'
  }

  const allDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  const handleToggle = () => {
    if (plan.isActive && isOnlyActive) {
      return
    }
    onToggle(plan.id)
  }

  return (
    <div className="flex gap-6">
      {/* Main Details */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="relative"
              onMouseEnter={() => plan.isActive && isOnlyActive && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {showTooltip && (
                <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                  At least one plan must be active
                  <div className="absolute top-full right-3 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-900"></div>
                </div>
              )}
              <label
                className={`relative inline-flex items-center ${plan.isActive && isOnlyActive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                onClick={handleToggle}
              >
                <input
                  type="checkbox"
                  checked={plan.isActive}
                  onChange={() => {}}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  plan.isActive ? 'bg-green-500' : 'bg-gray-200'
                }`}></div>
              </label>
            </div>
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Restaurants */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Building2 className="w-4 h-4" />
            Restaurants
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {planVendors.map(vendor => (
              <span key={vendor.id} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                {vendor.name}
              </span>
            ))}
          </div>
          <button className="text-sm text-coral-500 font-medium flex items-center gap-1 hover:text-coral-600">
            View menu items <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Restaurant rotation type */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <RefreshCw className="w-4 h-4" />
            Restaurant rotation type
          </div>
          <span className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 inline-block">
            {plan.rotationType}
          </span>
        </div>

        {/* Days */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Calendar className="w-4 h-4" />
            Days
          </div>
          <div className="flex gap-2">
            {allDays.map((day) => (
              <span
                key={day}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  plan.schedule.days.includes(day)
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {dayLabels[day]}
              </span>
            ))}
          </div>
        </div>

        {/* Post timing & Cut off */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Clock className="w-4 h-4" />
            <span>Post timing</span>
            <span className="mx-4"></span>
            <span>Cut off</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
              {plan.pollSettings.postTime.includes(':') ?
                new Date(`2024-01-01T${plan.pollSettings.postTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase() :
                plan.pollSettings.postTime
              }
            </span>
            <span className="text-gray-400">→</span>
            <span className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
              {plan.pollSettings.closeTime.includes(':') ?
                new Date(`2024-01-01T${plan.pollSettings.closeTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase() :
                plan.pollSettings.closeTime
              }
            </span>
          </div>
        </div>

        {/* Audience */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Users className="w-4 h-4" />
            Audience
          </div>
          <span className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 inline-flex items-center gap-2">
            <Users className="w-4 h-4 text-coral-400" />
            {plan.audience}
          </span>
        </div>

        {/* Notifications */}
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Bell className="w-4 h-4" />
            Notifications
          </div>
          <div className="space-y-2">
            {plan.notifications.map((notif, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 w-12 text-center">
                  {notif.value}
                </span>
                <span className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
                  {notif.unit}
                </span>
                <span className="text-sm text-gray-500">Before</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Sidebar */}
      <div className="w-72 space-y-6">
        {/* Type */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-3">Type</p>
          <div className="flex items-center gap-2">
            {plan.hasVeg && (
              <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 rounded-md border border-green-100">
                <VegIcon />
                <span className="text-xs font-medium text-green-700">Veg</span>
              </span>
            )}
            {plan.hasNonVeg && (
              <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 rounded-md border border-red-100">
                <NonVegIcon />
                <span className="text-xs font-medium text-red-700">Non veg</span>
              </span>
            )}
          </div>
        </div>

        {/* Polls created */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-2">Polls created</p>
          <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
            {plan.stats.pollsCreated}
          </span>
        </div>

        {/* Response rate */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-2">Response rate</p>
          <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
            {plan.stats.responseRate} %
          </span>
        </div>

        {/* Total menu items */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-3">Total menu items</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-50 rounded-md border border-green-100">
              <VegIcon />
              <span className="text-sm font-medium text-green-700">{plan.stats.vegItems}</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 rounded-md border border-red-100">
              <NonVegIcon />
              <span className="text-sm font-medium text-red-700">{plan.stats.nonVegItems}</span>
            </span>
          </div>
        </div>

        {/* Next up for poll */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-3">Next up for poll</p>
          <div className="flex flex-wrap gap-2">
            {nextUpVendors.map(vendor => (
              <span key={vendor.id} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                {vendor.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LunchPlans() {
  const [plans, setPlans] = useState(initialPlans)
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)

  const selectedPlan = plans.find(p => p.id === selectedPlanId)
  const activePlansCount = plans.filter(p => p.isActive).length

  const handleTogglePlan = (planId) => {
    setPlans(plans.map(p =>
      p.id === planId ? { ...p, isActive: !p.isActive } : p
    ))
  }

  const handleSavePlan = (planData) => {
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? { ...planData, id: editingPlan.id, stats: editingPlan.stats, isActive: editingPlan.isActive } : p))
      setEditingPlan(null)
    } else {
      const newPlan = {
        ...planData,
        id: `p${Date.now()}`,
        isActive: true,
        hasVeg: true,
        hasNonVeg: true,
        stats: { pollsCreated: 0, responseRate: 0, vegItems: 0, nonVegItems: 0 },
        nextUpVendors: planData.vendors.slice(0, 4),
        createdAt: new Date().toISOString()
      }
      setPlans([...plans, newPlan])
      setSelectedPlanId(newPlan.id)
    }
    setShowCreateModal(false)
  }

  const handleEditPlan = () => {
    setEditingPlan(selectedPlan)
    setShowCreateModal(true)
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Left Panel - Plan List */}
        <div className="w-80 bg-gray-50 border-r border-gray-100 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Lunch plans</h1>
            <button
              onClick={() => { setEditingPlan(null); setShowCreateModal(true); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-coral-500 text-white rounded-lg text-sm font-medium hover:bg-coral-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create a plan
            </button>
          </div>

          <div className="space-y-3">
            {plans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlanId === plan.id}
                onSelect={() => setSelectedPlanId(plan.id)}
                onToggle={handleTogglePlan}
                isOnlyActive={plan.isActive && activePlansCount === 1}
              />
            ))}
          </div>
        </div>

        {/* Right Panel - Plan Details */}
        <div className="flex-1 p-6 overflow-y-auto">
          {selectedPlan ? (
            <PlanDetail
              plan={selectedPlan}
              onEdit={handleEditPlan}
              onToggle={handleTogglePlan}
              isOnlyActive={selectedPlan.isActive && activePlansCount === 1}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a plan to view details
            </div>
          )}
        </div>
      </div>

      <PlanModal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); setEditingPlan(null); }}
        onSave={handleSavePlan}
        plan={editingPlan}
      />
    </>
  )
}
