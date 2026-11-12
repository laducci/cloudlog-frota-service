import { VehicleRepository } from "../../../Domain/Ports";
import { VehicleProps } from "../../../Domain/Vehicle/Vehicle";
import { findVehicleOrFail } from "../../Common/loaders";

export class GetVehicleUseCase {
  constructor(private readonly deps: { vehicles: VehicleRepository }) {}
  async execute(id: string): Promise<VehicleProps> {
    return (await findVehicleOrFail(this.deps.vehicles, id)).toPrimitives();
  }
}
