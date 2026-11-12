import { Driver } from "../../Domain/Driver/Driver";
import { NotFoundError } from "../../Domain/Errors";
import { DriverRepository, VehicleRepository } from "../../Domain/Ports";
import { Vehicle } from "../../Domain/Vehicle/Vehicle";

export async function findVehicleOrFail(repo: VehicleRepository, id: string): Promise<Vehicle> {
  const v = await repo.findById(String(id ?? "").trim());
  if (!v) throw new NotFoundError("Veículo não encontrado.");
  return v;
}

export async function findDriverOrFail(repo: DriverRepository, id: string): Promise<Driver> {
  const d = await repo.findById(String(id ?? "").trim());
  if (!d) throw new NotFoundError("Motorista não encontrado.");
  return d;
}
