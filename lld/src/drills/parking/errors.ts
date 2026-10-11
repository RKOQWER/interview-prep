// Build a ParkingLot class with these rules (the invariants are the exercise):
// 1. Lot has fixed capacity per section: motorcycles 10, cars 20, trucks 5.
// 2. park(vehicle) throws LotFullError if that section is full, InvalidVehicleError if plate is blank. Same plate twice -> throw (no duplicates).
// 3. leave(plate) throws NotFoundError if plate isn't parked.
// 4. No public mutable state - counts only via getters (availableSpots(type)).
// 5. A Money-free Ticket record: when parked, store entry time; leave returns duration in minutes.

import { constrainedMemory } from "node:process";

export class LotFullError extends Error{
    constructor(){
        super("Lot full");
    }
}

export class InvalidVehicleError extends Error{
    constructor(){
        super("Invalid vehicle number");
    }
}

export class NotFoundError extends Error{
    constructor(){
        super("not found");
    }
}
export class DuplicateError extends Error {
    constructor(){
        super("Duplicate");
    }
}