# The Full Picture

## Architecture

- `ParkingLot` (Singleton)
  - holds `ParkingFloor[]`
    - holds `ParkingSpot[]`
  - holds `PricingStrategy` (Strategy — swappable)
  - holds `ParkingLotObserver[]` (Observer)
    - `DisplayBoard` reacts on every `enter` / `exit`
  - `enter(vehicle)` → `ParkingTicket`
  - `exit(ticket)` → `Receipt`

## What to study before your next interview

Three things to be able to explain out loud without code:

1. Why Singleton for `ParkingLot`?
   - Because there is physically one lot. Two instances would give inconsistent spot availability data.
2. Why Observer for `DisplayBoard`?
   - Because the lot should not know or care who displays its data. Tomorrow you add an app notification — just subscribe a new observer. The lot never changes.
3. Why Strategy for pricing?
   - Because pricing rules change per business decision — weekday vs weekend, flat vs hourly, VIP vs standard. Each rule is isolated, testable, swappable without touching the lot.
