import { useState } from 'react'
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Search
} from 'lucide-react'
import orders from '../data/orders.json'

function OrderCard({ order, isExpanded, onToggle }) {
  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  const groupedByItem = order.responses.reduce((acc, response) => {
    if (!acc[response.itemName]) {
      acc[response.itemName] = {
        itemName: response.itemName,
        price: response.price,
        count: 0
      }
    }
    acc[response.itemName].count++
    return acc
  }, {})

  return (
    <div className="card">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-xl">
            <Calendar className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{formattedDate}</h3>
            <p className="text-sm text-gray-500">{order.vendorName}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-sm text-gray-500">Responses</p>
            <p className="font-semibold text-gray-900">{order.totalResponses}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
          </div>
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
            {order.status}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Order Details</h4>
            <button className="flex items-center gap-2 px-4 py-2 text-coral-500 border border-coral-200 rounded-lg hover:bg-coral-50 transition-colors text-sm">
              <Download className="w-4 h-4" />
              Re-export
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Item</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Qty</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Unit Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(groupedByItem).map((item) => (
                  <tr key={item.itemName} className="border-b border-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{item.itemName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.count}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">₹{item.price}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      ₹{(item.count * item.price).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                    Total:
                  </td>
                  <td className="py-3 px-4 text-sm font-bold text-gray-900">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Individual Orders</h5>
            <div className="flex flex-wrap gap-2">
              {order.responses.map((response, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg">
                  {response.employeeName}: {response.itemName}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Orders() {
  const [expandedId, setExpandedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrders = orders.filter(order =>
    order.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.date.includes(searchQuery)
  )

  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalMeals = orders.reduce((sum, order) => sum + order.totalResponses, 0)

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Orders</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString('en-IN')}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500 mb-1">Meals Ordered</p>
          <p className="text-2xl font-bold text-gray-900">{totalMeals}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by vendor or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedId === order.id}
              onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
            />
          ))
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500">No orders found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
