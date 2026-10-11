export type VehicleType= "motorcycle" | "car" | "truck";
import {LotFullError,InvalidVehicleError,NotFoundError,DuplicateError} from "./errors";

interface Vehicle{
    plate: string;
    type:VehicleType;
}

// Build a ParkingLot class with these rules (the invariants are the exercise):
// 1. Lot has fixed capacity per section: motorcycles 10, cars 20, trucks 5.
// 2. park(vehicle) throws LotFullError if that section is full, InvalidVehicleError if plate is blank. Same plate twice -> throw (no duplicates).
// 3. leave(plate) throws NotFoundError if plate isn't parked.
// 4. No public mutable state - counts only via getters (availableSpots(type)).
// 5. A Money-free Ticket record: when parked, store entry time; leave returns duration in minutes.

const motorCycleCapacity=10;
const carsCapacity=20;
const trucksCapacity=5;

interface journalInterface{
    entryTime:number;
    totalDuration:number;
    exitTime:number|null;
};


export class ParkingLot{
    #capacityPerSection={
        motorcycle:motorCycleCapacity,
        car: carsCapacity,
        truck: trucksCapacity
    }
    #currentCapacityPerSection={
        motorcycle:0,
        car:0,
        truck:0
    };
    #journal:Record<string,journalInterface>={};
    #vehicleDetails:Record<string,any>={};
    public park(vehicle:Vehicle):void{
        const vehicleType=vehicle.type;
        if (this.#capacityPerSection[vehicleType]<=this.#currentCapacityPerSection[vehicleType]){
            throw new LotFullError();
        }
        if(this.#vehicleDetails[vehicle.plate.trim()]!==undefined){
            throw new DuplicateError();
        }
        if (vehicle.plate.trim()===""){
            throw new InvalidVehicleError();
        }
        const result={
            entryTime:Date.now(),
            totalDuration:0,
            exitTime:null,
        };
        this.#journal[vehicle.plate]=(result);
        this.#currentCapacityPerSection[vehicleType]+=1;
    }

    public leave(vehilce:Vehicle):void{
        const plate=vehilce.plate;
        const vehicleType=vehilce.type;
        if (this.#vehicleDetails[plate]===undefined){
            throw new NotFoundError();
        }
        const currVehicleJournal=this.#journal[vehilce.plate] as journalInterface;
        currVehicleJournal.exitTime=Date.now();
        currVehicleJournal.totalDuration=currVehicleJournal.exitTime-currVehicleJournal.entryTime;
        this.#currentCapacityPerSection[vehicleType]-=1;
    }

    public avaliableSpots(type:VehicleType):number{
        const totalCapacity=this.#capacityPerSection[type] as number;
        const currentCapacity=this.#currentCapacityPerSection[type] as number;
        return totalCapacity-currentCapacity;
    }
}