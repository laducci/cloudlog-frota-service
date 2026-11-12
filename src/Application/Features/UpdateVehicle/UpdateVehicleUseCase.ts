import { ConflictError, ValidationError } from "../../../Domain/Errors";
import { Clock, VehicleRepository } from "../../../Domain/Ports";
import { VehicleData, VehicleProps } from "../../../Domain/Vehicle/Vehicle";
import { findVehicleOrFail } from "../../Common/loaders";

export class UpdateVehicleUseCase {
  constructor(private readonly deps: { vehicles: VehicleRepository; clock: Clock }) {}

  async execute(id: string, changes: VehicleData): Promise<VehicleProps> {
    if (!changes || !Object.keys(changes).length) throw new ValidationError("Informe ao menos um campo para alterar.");
    const vehicle = await findVehicleOrFail(this.deps.vehicles, id);
    vehicle.update(changes, this.deps.clock.now());
    const sameplate = await this.deps.vehicles.findByPlate(vehicle.plate);
    if (sameplate && sameplate.id !== vehicle.id) throw new ConflictError(`A placa ${vehicle.plate} já está cadastrada.`);
    await this.deps.vehicles.save(vehicle);
    return vehicle.toPrimitives();
  }
}
