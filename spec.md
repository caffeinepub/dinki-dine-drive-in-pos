# Dinki Dine Drive-In POS

## Current State
Each checkout creates a new Order record. Repeat orders from the same session are not consolidated.

## Requested Changes (Diff)

### Add
- Backend: appendToOrder(orderId, newItems) — merges items into existing order, recalculates totals
- Frontend AppContext: sessionOrderId state
- useAppendToOrder mutation hook

### Modify
- CheckoutPage: use appendToOrder on subsequent checkouts in same session
- AppContext: add sessionOrderId, setSessionOrderId, clear in clearSession

### Remove
- Nothing

## Implementation Plan
1. Add appendToOrder to main.mo
2. Add sessionOrderId to AppContext
3. Add useAppendToOrder hook in useQueries.ts
4. Update CheckoutPage to call appendToOrder when sessionOrderId exists
