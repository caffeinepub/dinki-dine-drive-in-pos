# Dinki Dine Drive-In POS

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- QR code entry flow: customers land on a vehicle details form after scanning QR
- Vehicle & customer details form: mobile number, car model, car colour
- Menu ordering page with categories (starters, mains, beverages, desserts) and sample Mangalore veg items
- Add/remove/increment/decrement item quantities; running cart visible at all times
- Order consolidation: all cart additions merged into single order
- Checkout & bill page: itemised bill with subtotal, taxes, total; vehicle info prominently shown; confirm/place order action
- Kitchen/Staff dashboard (admin): live view of incoming orders with vehicle details, status pipeline (Received → Preparing → Ready → Delivered), staff can update status
- Menu Management panel (admin): CRUD for menu items and categories; availability toggle per item
- Role-based access: customer flow (public) vs admin panel (requires login)

### Modify
- N/A

### Remove
- N/A

## Implementation Plan

### Backend (Motoko)
- Data models: MenuItem (id, name, description, price, category, available), Order (id, mobileNumber, carModel, carColour, items: [{menuItemId, name, price, qty}], status, createdAt, total)
- Public APIs: getMenuItems, placeOrder
- Admin APIs (authenticated): getOrders, updateOrderStatus, addMenuItem, updateMenuItem, deleteMenuItem, addCategory, getCategories
- Seed sample Mangalore veg menu on init

### Frontend
- Customer flow:
  1. Landing/vehicle-details page (form: mobile, car model, car colour)
  2. Menu page with category tabs, item cards with +/- controls, sticky cart summary
  3. Checkout/bill page: order summary, vehicle info, confirm order button
  4. Order confirmation screen
- Admin flow:
  - Login page
  - Dashboard: live orders list, each card shows vehicle info, items, total, status; status update buttons
  - Menu management: item list with edit/delete, add new item form
- Mobile-first responsive design, large tap targets
