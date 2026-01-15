import { useState } from 'react'
import {
  Plus,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react'
import initialVendors from '../data/vendors.json'

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

function VendorCard({ vendor, isExpanded, onToggle, onEdit, onDelete }) {
  const vegItems = vendor.menuItems?.filter(i => i.isVeg) || []
  const nonVegItems = vendor.menuItems?.filter(i => !i.isVeg) || []

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
            vendor.isActive ? 'bg-coral-50 text-coral-500' : 'bg-gray-100 text-gray-400'
          }`}>
            {vendor.name.charAt(0)}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                {vendor.cuisine}
              </span>
              {!vendor.isActive && (
                <span className="px-2 py-0.5 bg-red-50 rounded text-xs font-medium text-red-600">
                  Inactive
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {vendor.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {vendor.email}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-sm text-gray-600">
                <VegIcon />
                <span>{vegItems.length} items</span>
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-600">
                <NonVegIcon />
                <span>{nonVegItems.length} items</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={vendor.isActive}
              onChange={() => {}}
              className="sr-only peer"
            />
            <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
              vendor.isActive ? 'bg-green-500' : 'bg-gray-200'
            }`}></div>
          </label>

          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-4">Menu Items</h4>

          <div className="grid grid-cols-2 gap-6">
            {/* Veg Items */}
            {vegItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <VegIcon />
                  <span className="text-sm font-medium text-green-700">Veg</span>
                </div>
                <div className="space-y-2">
                  {vegItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <span className="text-sm font-medium text-gray-900">₹{item.price}</span>
                    </div>
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
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <span className="text-sm font-medium text-gray-900">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
            <MapPin className="w-4 h-4" />
            {vendor.address}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Vendors() {
  const [vendors, setVendors] = useState(initialVendors)
  const [expandedId, setExpandedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeVendors = filteredVendors.filter(v => v.isActive)
  const inactiveVendors = filteredVendors.filter(v => !v.isActive)

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Vendors</h1>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-coral-500 text-white rounded-lg text-sm font-medium hover:bg-coral-600 transition-colors">
          <Plus className="w-4 h-4" />
          Add vendor
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Active Vendors */}
      {activeVendors.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Active ({activeVendors.length})
          </p>
          <div className="space-y-4">
            {activeVendors.map(vendor => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                isExpanded={expandedId === vendor.id}
                onToggle={() => setExpandedId(expandedId === vendor.id ? null : vendor.id)}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Vendors */}
      {inactiveVendors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Inactive ({inactiveVendors.length})
          </p>
          <div className="space-y-4">
            {inactiveVendors.map(vendor => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                isExpanded={expandedId === vendor.id}
                onToggle={() => setExpandedId(expandedId === vendor.id ? null : vendor.id)}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {filteredVendors.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">No vendors found matching your search.</p>
        </div>
      )}
    </div>
  )
}
