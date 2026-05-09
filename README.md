# Parking Lot System

This repository contains a system-design implementation of a parking lot in TypeScript.

## Overview

The project models a multi-floor parking lot with the following capabilities:

- vehicle entry and exit
- nearest available spot assignment per vehicle type (`BIKE`, `CAR`, `TRUCK`)
- parking ticket generation
- fee calculation using swappable pricing strategies
- display board updates via observer notifications
- singleton parking lot instance

## Project structure

- `docs/` — design notes and requirement breakdowns for each phase
  - `1-problem.md`
  - `date-arithmetic.md`
  - `phase1.md`
  - `phase2.md`
  - `phase3.md`
  - `xfull-picture.md`
- `src/index.ts` — implementation of the parking lot model and runtime example
- `.gitignore` — ignored patterns for Node, TypeScript, VS Code, and OS files

## What is implemented

The source contains:

- domain entities: `Vehicle`, `Bike`, `Car`, `Truck`, `ParkingSpot`, `ParkingFloor`
- `ParkingTicket`, `Receipt`
- `PricingStrategy` interface
- `HourlyPricing` and `FlatRatePricing`
- `DisplayBoard` observer
- `ParkingLot` singleton with `enter()` and `exit()` flow

The example in `src/index.ts` also demonstrates:

- building floors and spots
- subscribing a display board
- entering and exiting vehicles
- switching pricing strategies at runtime
- handling unavailable spots

## Running the code

If you have TypeScript installed, you can run the example with:

```bash
npx ts-node src/index.ts
```

Or compile and run with `tsc` + `node`:

```bash
tsc src/index.ts --outDir dist
node dist/index.js
```

> If there is no local TypeScript or `ts-node` setup yet, install them globally or add them with `npm install -D typescript ts-node`.

## Notes

- `docs/` contains the design rationale and phased interview-style requirements.
- `src/index.ts` contains the working implementation and a usage example.
- This project is primarily a system-design / TypeScript modeling exercise, not a production-ready application.
