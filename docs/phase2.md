# Phase 2 — Ticketing + Entry/Exit

Now the system needs to handle a vehicle arriving and leaving.

## Entry

- Search floors from lowest to highest for an available spot matching the vehicle type
- Assign the spot → create a `ParkingTicket` with `ticketId`, `vehicle`, `spot`, `entryTime`
- Mark the spot as occupied

## Exit

- Receive the ticket
- Release the spot
- Calculate fee using the current `PricingStrategy`
- Return a `Receipt` with `ticket`, `exitTime`, `fee`

## Your tasks in TypeScript

1. Write `ParkingTicket` class — `ticketId`, `vehicle`, `spot`, `entryTime`
2. Write `PricingStrategy` interface — `calculateFee(entryTime: Date, exitTime: Date): number`
3. Write `HourlyPricing` — charges ₹20 per hour, minimum 1 hour
4. Write `FlatRatePricing` — fixed ₹50 regardless of duration
5. Write `Receipt` class — `ticket`, `exitTime`, `fee`

Don't build the main `ParkingLot` class yet — just these five.
 The lot comes in Phase 3.