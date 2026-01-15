# Lunch Order Management System - Documentation

## Overview

A clickable prototype for an office lunch order management system. The system helps office managers coordinate daily lunch orders by creating polls for employees, collecting responses, and exporting orders to restaurants.

## Tech Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **Database:** JSON files (mock data)

## Project Structure

```
src/
├── components/
│   └── layout/
│       ├── Layout.jsx        # Main layout wrapper with sidebar
│       └── Sidebar.jsx       # Navigation sidebar
├── data/
│   ├── employees.json        # 64 employees with avatars
│   ├── orders.json           # Historical orders
│   ├── plans.json            # Lunch plan templates
│   ├── todayOrder.json       # Current day's order state
│   └── vendors.json          # Restaurant vendors with menus
├── pages/
│   ├── CreatePoll.jsx        # Quick one-time poll creation
│   ├── Dashboard.jsx         # Today's order view (main page)
│   ├── LunchPlans.jsx        # Plan templates (master-detail layout)
│   ├── Orders.jsx            # Order history
│   ├── Settings.jsx          # App settings
│   └── Vendors.jsx           # Vendor management
├── App.jsx                   # Router setup
├── index.css                 # Tailwind imports & custom styles
└── main.jsx                  # App entry point
```

## Design System

### Colors

Primary accent color is **Coral**:

```javascript
coral: {
  50: '#fff5f5',
  100: '#ffe0df',
  200: '#ffc7c5',
  300: '#ffa09d',
  400: '#ff6b66',
  500: '#f25c54',  // Primary
  600: '#e04840',
  700: '#bc3730',
  800: '#9c312b',
  900: '#832d29',
}
```

### Icons (Veg/Non-Veg)

Indian food categorization with visual indicators:

- **Veg:** Green square border with green dot inside
- **Non-Veg:** Red square border with red triangle inside

```jsx
// Veg Icon
<span className="w-4 h-4 border-2 border-green-600 rounded-sm flex items-center justify-center">
  <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
</span>

// Non-Veg Icon
<span className="w-4 h-4 border-2 border-red-600 rounded-sm flex items-center justify-center">
  <span className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-red-600"></span>
</span>
```

### Common Component Classes

```css
.card {
  @apply bg-white rounded-xl p-6 border border-gray-100;
}

.input {
  @apply w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent;
}

.btn-primary {
  @apply bg-coral-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-coral-600 transition-colors;
}
```

## Navigation Structure

| Route | Page | Icon | Description |
|-------|------|------|-------------|
| `/` | Dashboard | Home | Today's order status & management |
| `/orders` | Orders | ShoppingCart | Historical orders list |
| `/plans` | LunchPlans | FileText | Recurring lunch plan templates |
| `/vendors` | Vendors | Users | Restaurant vendor management |
| `/create` | CreatePoll | Plus | Quick one-time poll creation |
| `/settings` | Settings | Settings | App settings |

## Data Models

### Employee
```json
{
  "id": "emp1",
  "name": "Aarav Sharma",
  "email": "aarav.sharma@company.com",
  "avatar": "https://i.pravatar.cc/150?u=emp1"
}
```

### Vendor
```json
{
  "id": "v1",
  "name": "Zaitoon",
  "cuisine": "Arabian",
  "isActive": true,
  "menuItems": [
    {
      "id": "z1",
      "name": "Chicken Shawarma",
      "price": 180,
      "isVeg": false
    }
  ]
}
```

### Plan
```json
{
  "id": "p1",
  "name": "Weekday Lunch",
  "description": "Regular weekday lunch rotation",
  "isActive": true,
  "hasVeg": true,
  "hasNonVeg": true,
  "vendors": ["v1", "v2", "v3"],
  "menuItems": {
    "v1": ["z1", "z2", "z3"]
  },
  "rotationType": "Round robin",
  "schedule": {
    "days": ["monday", "tuesday", "wednesday", "thursday", "friday"]
  },
  "pollSettings": {
    "postTime": "10:00",
    "closeTime": "12:00"
  },
  "audience": "Everyone",
  "notifications": [
    { "value": 10, "unit": "Minutes" }
  ],
  "stats": {
    "pollsCreated": 45,
    "responseRate": 87,
    "vegItems": 12,
    "nonVegItems": 8
  },
  "nextUpVendors": ["v2", "v3"]
}
```

### Today's Order
```json
{
  "id": "order1",
  "planId": "p1",
  "planName": "Weekday Lunch",
  "vendorId": "v1",
  "vendorName": "Zaitoon",
  "date": "2024-01-15",
  "status": "live",
  "pollSettings": {
    "postTime": "10:00 am",
    "closeTime": "12:00 pm"
  },
  "totalResponses": 49,
  "totalEmployees": 64,
  "budget": {
    "perHead": 250,
    "estimated": 12250
  },
  "responses": [...],
  "pendingResponses": [...],
  "optedOut": [...],
  "tomorrowOrder": {...}
}
```

## Page Features

### Dashboard (`/`)

**States:**
1. `not-scheduled` - No order scheduled for today
2. `not-started` - Poll scheduled but not started
3. `live` - Poll is active, collecting responses
4. `closed` - Poll closed, ready to export
5. `exported` - Order sent to vendor

**Components:**
- Header bar with plan info, response count, status badge, countdown timer
- Action buttons (Close Poll, Export Order)
- Order Summary (Veg/Non-veg grouped)
- Budget Card
- Order Timeline
- Pending Responses list
- Tomorrow's Order preview

### Lunch Plans (`/plans`)

**Layout:** Master-detail split view
- Left panel (320px): Plan cards list
- Right panel: Selected plan details

**Features:**
- Create/Edit plan modal
- Add restaurant nested modal
- Toggle plans active/inactive
- At least one plan must be active (tooltip on hover)
- Plan statistics sidebar

**PlanModal Fields:**
1. Name (text input with placeholder)
2. Restaurants (tags + Add restaurant button)
3. Restaurant rotation (dropdown: Rotate, Random, Manual)
4. Days (circular S M T W T F S buttons)
5. Post timing (time input)
6. Cut-off timing (time input)
7. Audience (dropdown: Everyone, Specific groups)
8. Notifications (number + unit dropdown + Add button)

**AddRestaurantModal:**
- Split view: restaurant list (left), menu items (right)
- Checkboxes for restaurant selection
- Menu items grouped by Veg/Non-veg
- Cancel and Add buttons

### Orders (`/orders`)

- Stats cards (Total Orders, Total Spent, Meals Ordered)
- Search by vendor or date
- Expandable order cards with details
- Item-wise breakdown table
- Individual orders list
- Re-export button

### Vendors (`/vendors`)

- Grid layout of vendor cards
- Add new vendor button
- Toggle vendor active/inactive
- View/Edit vendor details
- Menu items list per vendor

### Create Poll (`/create`)

- Vendor selection grid
- Menu item selection (Veg/Non-veg grouped)
- Poll settings (cut-off time)
- Summary and create button
- Success state with redirect

## Key Implementation Details

### Toggle Switch with Tooltip

For ensuring at least one plan stays active:

```jsx
function PlanCard({ plan, isSelected, onSelect, onToggle, isOnlyActive }) {
  const [showTooltip, setShowTooltip] = useState(false)

  const handleToggle = (e) => {
    e.stopPropagation()
    if (plan.isActive && isOnlyActive) return
    onToggle(plan.id)
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => plan.isActive && isOnlyActive && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg">
          At least one plan must be active
        </div>
      )}
      <label className={plan.isActive && isOnlyActive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}>
        {/* Toggle switch */}
      </label>
    </div>
  )
}
```

### Time Formatting

```javascript
// Format 24h time to 12h
new Date(`2024-01-01T${time}`).toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true
})
```

### Currency Formatting (Indian Rupees)

```javascript
amount.toLocaleString('en-IN') // Outputs: 12,250
// Display: ₹{amount.toLocaleString('en-IN')}
```

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Development server runs at: `http://localhost:5173/`

## File Dependencies

```
App.jsx
├── Layout.jsx
│   └── Sidebar.jsx
├── Dashboard.jsx
│   ├── todayOrder.json
│   ├── employees.json
│   └── vendors.json
├── Orders.jsx
│   └── orders.json
├── LunchPlans.jsx
│   ├── plans.json
│   └── vendors.json
├── Vendors.jsx
│   └── vendors.json
├── CreatePoll.jsx
│   └── vendors.json
└── Settings.jsx
```
