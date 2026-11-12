import { VehicleRepository } from "../../../Domain/Ports";
import { VehicleProps, parseVehicleStatus } from "../../../Domain/Vehicle/Vehicle";

export class ListVehiclesUseCase {
  constructor(private readonly deps: { vehicles: VehicleRepository }) {}

  async execute(query: { status?: string; search?: string } = {}): Promise<{ items: VehicleProps[]; total: number }> {
    const items = await this.deps.vehicles.list({
      status: query.status ? parseVehicleStatus(query.status) : undefined,
      search: query.search?.trim() || undefined,
    });
    return { items: items.map((v) => v.toPrimitives()), total: items.length };
  }
}
