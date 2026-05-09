# LLD Problem 1 — Parking Lot System

This is exactly how it is given in a real interview. Requirements come in phases — you design as you go. No peeking ahead.

## Phase 1 — Understand the Domain (5 mins in a real interview)

Read this carefully. A senior engineer would ask clarifying questions before writing a single line.

The system must support:

- a parking lot with multiple floors, each floor has multiple spots
- three spot types: `BIKE`, `CAR`, `TRUCK` — a vehicle can only park in its matching spot type
- three vehicle types: `Bike`, `Car`, `Truck` — each carries a license plate
- when a vehicle enters → find the nearest available spot on the lowest floor → assign it → mark spot occupied
- when a vehicle exits → free the spot → calculate fee based on hours parked
- two pricing strategies: `FlatRatePricing` (fixed fee regardless of time) and `HourlyPricing` (fee per hour)
- a display board that updates whenever spot availability changes on any floor

## Your Task — Phase 1: Core Entities

Before writing any service or logic, model the nouns of the system. These become your core classes.

In TypeScript, define:

1. `SpotType` and `VehicleType` as union types
2. `Vehicle` — base class with `licensePlate` and `type`
3. `Bike`, `Car`, `Truck` — extending `Vehicle`
4. `ParkingSpot` — with `spotId`, `floor`, `type`, `isOccupied`, and methods `occupy()` / `release()`
5. `ParkingFloor` — holds an array of `ParkingSpot`, has `getAvailableSpot(type: SpotType)` method

Don't build the lot, pricing, or ticketing yet. Just these five.

> Interview tip: In a real interview, always start with entities before services. It shows you think in domain models, not just functions.

Draw the class relationships mentally first:

- `Vehicle` has-a `type`
- `ParkingSpot` has-a `SpotType`
- `ParkingFloor` has-many `ParkingSpot`s

## Phase 1 — Entity Relationship

Before Phase 2, lock this in mentally:

- `ParkingLot`
  - has many `ParkingFloor`
    - has many `ParkingSpot` (type: `BIKE` | `CAR` | `TRUCK`)

- `Vehicle` (abstract)
  - `Bike` → parks in `BIKE` spot
  - `Car` → parks in `CAR` spot
  - `Truck` → parks in `TRUCK` spot
