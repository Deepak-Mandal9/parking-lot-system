type SpotType = "CAR" | "BIKE" | "TRUCK";
type VehicleType = "Car" | "Bike" | "Truck";

abstract class Vehicle {
    constructor(
        public readonly licensePlate: string,
        public readonly type: VehicleType,
    ){}
}

class Bike extends Vehicle {
    constructor(licensePlate: string) {
        super(licensePlate, "Bike");
    }
    
}
// new Bike('KA-01-1234').type        → 'Bike'
// new Bike('KA-01-1234').licensePlate → 'KA-01-1234'

class Car extends Vehicle{
    constructor(licensePlate: string) {
        super(licensePlate, "Bike");
    }

}

class Truck extends Vehicle{
    constructor(licensePlate: string) {
        super(licensePlate, "Bike");
    }
}

class ParkingSpot {
  private isOccupied: boolean = false;

  constructor(
    public readonly spotId: string,
    public readonly floor:  number,
    public readonly type:   SpotType,
  ) {}

  occupy(): void  { this.isOccupied = true;  }
  release(): void { this.isOccupied = false; }
  getIsOccupied(): boolean { return this.isOccupied; }
}

class ParkingFloor {
    private spots: ParkingSpot[] = [];
    constructor(public readonly floorNumber: number){

    }

    addSpot(spot: ParkingSpot): void{
        this.spots.push(spot);
    }

    getAvailableSpot(type: SpotType):ParkingSpot|null {
        return this.spots.find(
            s => s.type === type && !s.getIsOccupied()
        ) ?? null;
    }

    getAvailableCount(type: SpotType): number {
    return this.spots.filter(
      s => s.type === type && !s.getIsOccupied()
    ).length;
  }
}



/**
 * ParkingLot
  └── has many ParkingFloor
        └── has many ParkingSpot (type: BIKE | CAR | TRUCK)

Vehicle (abstract)
  ├── Bike  → parks in BIKE spot
  ├── Car   → parks in CAR spot
  └── Truck → parks in TRUCK spot
 */

// ── Quick sanity check ────────────────────────────────────
const floor11 = new ParkingFloor(1);
floor11.addSpot(new ParkingSpot('F1-B1', 1, 'BIKE'));
floor11.addSpot(new ParkingSpot('F1-C1', 1, 'CAR'));
floor11.addSpot(new ParkingSpot('F1-C2', 1, 'CAR'));

const spot = floor11.getAvailableSpot('CAR');
console.log(spot?.spotId); // 'F1-C1'
spot?.occupy();
console.log(floor11.getAvailableCount('CAR')); // 1 (C2 still free)


// ── ParkingTicket ─────────────────────────────────────────
class ParkingTicket {
  constructor(
    public readonly ticketId:  string,
    public readonly vehicle:   Vehicle,      // ← fixed: Vehicle not VehicleType
    public readonly spot:      ParkingSpot,
    public readonly entryTime: Date,
  ) {}
}

// ── PricingStrategy — Strategy pattern ───────────────────
interface PricingStrategy {
  calculateFee(entryTime: Date, exitTime: Date): number;
}

// ── HourlyPricing ─────────────────────────────────────────
class HourlyPricing implements PricingStrategy {
  private readonly RATE_PER_HOUR = 20;  // ₹20/hr

  calculateFee(entryTime: Date, exitTime: Date): number {
    const ms            = exitTime.getTime() - entryTime.getTime();
    const hours         = Math.ceil(ms / (1000 * 60 * 60)); // round up
    const billableHours = Math.max(1, hours);                 // min 1hr
    return billableHours * this.RATE_PER_HOUR;
  }
}

// ── FlatRatePricing ───────────────────────────────────────
class FlatRatePricing implements PricingStrategy {
  private readonly FLAT_FEE = 50;  // ₹50 always

  calculateFee(entryTime: Date, exitTime: Date): number {
    return this.FLAT_FEE;  // time is irrelevant ✅
  }
}

// ── Receipt ───────────────────────────────────────────────
class Receipt {
  constructor(
    public readonly ticket:   ParkingTicket,
    public readonly exitTime: Date,
    public readonly fee:      number,         // ← fixed: number not PricingStrategy
  ) {}

  print(): void {
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PARKING RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Ticket     : ${this.ticket.ticketId}
  Vehicle    : ${this.ticket.vehicle.licensePlate}
  Spot       : ${this.ticket.spot.spotId}
  Entry      : ${this.ticket.entryTime.toLocaleTimeString()}
  Exit       : ${this.exitTime.toLocaleTimeString()}
  Fee        : ₹${this.fee}
━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  }
}

// ── Fee calculation preview ───────────────────────────────
const entry = new Date('2025-01-01T10:00:00');
const exit  = new Date('2025-01-01T12:30:00'); // 2.5 hrs

console.log(new HourlyPricing().calculateFee(entry, exit)); // 60  (3hrs × ₹20)
console.log(new FlatRatePricing().calculateFee(entry, exit)); // 50  (always)
    
//Math.ceil() vs Math.floor() is a real business decision. Most parking systems charge for the full hour even if you stay 10 minutes into the next hour — that's ceil. Some use floor for a more customer-friendly approach. In an interview always mention this trade-off — it shows you think about real-world implications.



// ── Observer interface ────────────────────────────────────
interface ParkingLotObserver {
  onSpotchanged(floors: ParkingFloor[]):void;
}

// ── DisplayBoard — reacts whenever a spot is taken/freed ──

class DisplayBoard implements ParkingLotObserver {
  onSpotchanged(floors: ParkingFloor[]): void {
    console.log('┌─────────────────────────────────┐');
    console.log('│        AVAILABLE SPOTS          │');
    console.log('├─────────────────────────────────┤');

    floors.forEach(floor => {
      const bikes = floor.getAvailableCount('BIKE');
      const cars  = floor.getAvailableCount('CAR');
      const trucks = floor.getAvailableCount('TRUCK');

      console.log(
        `│  Floor ${floor.floorNumber}` +
        `  🚲 ${bikes}  🚗 ${cars}  🚚 ${trucks}          │`
      );
    });
    console.log('└─────────────────────────────────┘')
  }
}

class ParkingLot {
  // ── Singleton setup ───────────────────────────────────
  private static instance: ParkingLot | null = null;

  private readonly floors:    ParkingFloor[] = [];
  private readonly observers: ParkingLotObserver[] = [];
  private          pricing:   PricingStrategy;
  private          ticketSeq: number = 0;
  
  private constructor(pricing: PricingStrategy) {
    this.pricing = pricing;
  }


  static getInstance(pricing?: PricingStrategy): ParkingLot {
    if(!ParkingLot.instance) {
      if(!pricing) throw new Error('Pricing required on first init');
      ParkingLot.instance = new ParkingLot(pricing);
    }
    return ParkingLot.instance;
  }


  // ── Floor management ──────────────────────────────────
  addFloor(floor: ParkingFloor): void {
    this.floors.push(floor);
  }

  // ── Observer management ───────────────────────────────
  subscribe(observer: ParkingLotObserver): void{
    this.observers.push(observer);
  }

  private notifyObservers(): void {
    this.observers.forEach(o => o.onSpotchanged(this.floors));
  }


  // ── Strategy swap ─────────────────────────────────────
  setPricing(pricing: PricingStrategy): void{
    this.pricing = pricing;
    console.log(`[Lot] Pricing switched to: ${pricing.constructor.name}`);
  }

  // ── Entry ─────────────────────────────────────────────
  enter(vehicle: Vehicle): ParkingTicket {
    // Map vehicle type to spot type
    const spotTypeMap: Record<VehicleType, SpotType> = {
      Bike:  'BIKE',
      Car:   'CAR',
      Truck: 'TRUCK',
    };
    const spotType = spotTypeMap[vehicle.type];

    // Search floors lowest-first for available spot
    let assignedSpot: ParkingSpot | null = null;
    for (const floor of this.floors) {
      assignedSpot = floor.getAvailableSpot(spotType);
      if (assignedSpot) break;
    }

    if (!assignedSpot) {
      throw new Error(`No ${spotType} spots available`);
    }

    assignedSpot.occupy();

    const ticket = new ParkingTicket(
      `TKT-${++this.ticketSeq}`,
      vehicle,
      assignedSpot,
      new Date(),
    );

    console.log(
      `[Entry] ${vehicle.licensePlate} (${vehicle.type})` +
      ` → spot ${assignedSpot.spotId} | ticket ${ticket.ticketId}`
    );

    this.notifyObservers(); // display board updates ✅
    return ticket;
  }

  // ── Exit ──────────────────────────────────────────────
  exit(ticket: ParkingTicket): Receipt {
    ticket.spot.release();

    const exitTime = new Date();
    const fee      = this.pricing.calculateFee(ticket.entryTime, exitTime);
    const receipt  = new Receipt(ticket, exitTime, fee);

    console.log(
      `[Exit]  ${ticket.vehicle.licensePlate} freed ${ticket.spot.spotId} | fee ₹${fee}`
    );

    this.notifyObservers(); // display board updates ✅
    return receipt;
  }

  // ── Test helper ───────────────────────────────────────
  static _reset(): void { ParkingLot.instance = null; }


}





// ── 1. Build the lot (Singleton, created once) ───────────
const lot = ParkingLot.getInstance(new HourlyPricing());

// ── 2. Add floors and spots ───────────────────────────────
const floor1 = new ParkingFloor(1);
floor1.addSpot(new ParkingSpot('F1-B1', 1, 'BIKE'));
floor1.addSpot(new ParkingSpot('F1-B2', 1, 'BIKE'));
floor1.addSpot(new ParkingSpot('F1-C1', 1, 'CAR'));
floor1.addSpot(new ParkingSpot('F1-C2', 1, 'CAR'));
floor1.addSpot(new ParkingSpot('F1-T1', 1, 'TRUCK'));

const floor2 = new ParkingFloor(2);
floor2.addSpot(new ParkingSpot('F2-C1', 2, 'CAR'));
floor2.addSpot(new ParkingSpot('F2-C2', 2, 'CAR'));
floor2.addSpot(new ParkingSpot('F2-B1', 2, 'BIKE'));

lot.addFloor(floor1);
lot.addFloor(floor2);

// ── 3. Subscribe display board (Observer) ─────────────────
lot.subscribe(new DisplayBoard());

// ── 4. Vehicles enter ─────────────────────────────────────
const t1 = lot.enter(new Car('KA-01-1234'));
// [Entry] KA-01-1234 (Car) → spot F1-C1 | ticket TKT-1
// ┌─────────────────────────────────┐
// │        AVAILABLE SPOTS          │
// │  Floor 1  🚲 2  🚗 1  🚚 1    │
// │  Floor 2  🚲 1  🚗 2  🚚 0    │
// └─────────────────────────────────┘

const t2 = lot.enter(new Bike('MH-02-5678'));
// [Entry] MH-02-5678 (Bike) → spot F1-B1 | ticket TKT-2

const t3 = lot.enter(new Truck('DL-03-9999'));
// [Entry] DL-03-9999 (Truck) → spot F1-T1 | ticket TKT-3

// ── 5. Car exits ──────────────────────────────────────────
const receipt = lot.exit(t1);
// [Exit]  KA-01-1234 freed F1-C1 | fee ₹20 (min 1hr)
// Display board updates again ✅

receipt.print();
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   PARKING RECEIPT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━
//   Ticket     : TKT-1
//   Vehicle    : KA-01-1234
//   Spot       : F1-C1
//   Entry      : 10:00:00 AM
//   Exit       : 10:02:00 AM
//   Fee        : ₹20
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── 6. Switch to flat rate pricing (Strategy swap) ────────
lot.setPricing(new FlatRatePricing());
// [Lot] Pricing switched to: FlatRatePricing

const receipt2 = lot.exit(t2);
// [Exit]  MH-02-5678 freed F1-B1 | fee ₹50 (flat rate)

// ── 7. No spots available ─────────────────────────────────
try {
  lot.enter(new Truck('UP-04-1111')); // only 1 truck spot, taken
} catch (e) {
  console.log((e as Error).message); // No TRUCK spots available
}

// ── What you built — patterns checklist ──────────────────
// ✅ Singleton  → ParkingLot.getInstance()
// ✅ Observer   → DisplayBoard updates on every enter/exit
// ✅ Strategy   → switched from Hourly to FlatRate at runtime
// ✅ SRP        → each class has one job
// ✅ DIP        → ParkingLot depends on PricingStrategy interface
// ✅ OCP        → add new pricing? one new class, nothing changes
    
