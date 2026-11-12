import { Driver } from "../Driver/Driver";
import { Vehicle, VehicleStatusValue } from "../Vehicle/Vehicle";

export interface VehicleRepository {
  add(v: Vehicle): Promise<void>;
  save(v: Vehicle): Promise<void>;
  findById(id: string): Promise<Vehicle | null>;
  findByPlate(plate: string): Promise<Vehicle | null>;
  list(filter: { status?: VehicleStatusValue; search?: string }): Promise<Vehicle[]>;
  remove(id: string): Promise<void>;
}

export interface DriverRepository {
  add(d: Driver): Promise<void>;
  save(d: Driver): Promise<void>;
  findById(id: string): Promise<Driver | null>;
  findByCnh(cnh: string): Promise<Driver | null>;
  list(filter: { active?: boolean; search?: string }): Promise<Driver[]>;
  remove(id: string): Promise<void>;
}

export interface Clock { now(): Date }
export interface IdGenerator { next(): string }
