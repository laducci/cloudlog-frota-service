import { VehicleRepository } from "../../../Domain/Ports";
import { findVehicleOrFail } from "../../Common/loaders";

export class DeleteVehicleUseCase {
  constructor(private readonly deps: { vehicles: VehicleRepository }) {}
  async execute(id: string): Promise<void> {
    const vehicle = await findVehicleOrFail(this.deps.vehicles, id);
    vehicle.assertCanBeDeleted();
    await this.deps.vehicles.remove(vehicle.id);
  }
}
