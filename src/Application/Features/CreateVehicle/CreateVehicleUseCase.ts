import { ConflictError } from "../../../Domain/Errors";
import { Clock, IdGenerator, VehicleRepository } from "../../../Domain/Ports";
import { Vehicle, VehicleData, VehicleProps } from "../../../Domain/Vehicle/Vehicle";

export class CreateVehicleUseCase {
  constructor(private readonly deps: { vehicles: VehicleRepository; clock: Clock; ids: IdGenerator }) {}

  async execute(input: VehicleData): Promise<VehicleProps> {
    const vehicle = Vehicle.create(input, this.deps.ids.next(), this.deps.clock.now());
    if (await this.deps.vehicles.findByPlate(vehicle.plate)) throw new ConflictError(`A placa ${vehicle.plate} já está cadastrada.`);
    await this.deps.vehicles.add(vehicle);
    return vehicle.toPrimitives();
  }
}
