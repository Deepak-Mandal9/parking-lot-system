# Phase 3 — The Main ParkingLot + DisplayBoard

Now we wire everything together. This is the most interesting phase — it uses:

- Singleton (one lot per system)
- Factory (creating vehicles)
- Observer (display board reacts to spot changes)
- Strategy (pricing)

## Your tasks

1. Write `ParkingLot` as a Singleton — holds multiple `ParkingFloor`s and the active `PricingStrategy`
2. Write `enter(vehicle: Vehicle): ParkingTicket` — searches floors lowest-first for an available spot, occupies it, returns a ticket
3. Write `exit(ticket: ParkingTicket): Receipt` — releases the spot, calculates fee, returns receipt
4. Write `DisplayBoard` as an Observer — subscribes to the lot and prints available spot counts per floor whenever a vehicle enters or exits

## Hint on patterns to use

- `ParkingLot` → Singleton (only one lot instance)
- `DisplayBoard` → Observer (reacts to spot changes)
- `PricingStrategy` → Strategy (injected into the lot, swappable)

## Every pattern you learned — applied in one system

| Pattern | Where it appears | Why |
|---|---|---|
| Singleton | `ParkingLot` | One lot per system |
| Observer | `DisplayBoard` | Reacts to spot changes |
| Strategy | `PricingStrategy` | Swap hourly ↔ flat rate |
| Factory | `VehicleFactory` | Create vehicle by type |

## SOLID principles embedded

- SRP → `ParkingLot` handles entry/exit only, `DisplayBoard` handles display only, `Receipt` handles billing data only
- OCP → New pricing? Add a class, touch nothing
- LSP → `Bike` / `Car` / `Truck` all substitutable for `Vehicle`
- ISP → `ParkingLotObserver` has only one method
- DIP → `ParkingLot` depends on `PricingStrategy` interface
