import { Driver, DriverProps } from "../../../Domain/Driver/Driver";
import { DriverRepository, VehicleRepository } from "../../../Domain/Ports";
import { Vehicle, VehicleProps, VehicleStatusValue } from "../../../Domain/Vehicle/Vehicle";

export class InMemoryVehicleRepository implements VehicleRepository {
  private readonly rows = new Map<string, VehicleProps>();
  async add(v: Vehicle) { this.rows.set(v.id, v.toPrimitives()); }
  async save(v: Vehicle) { this.rows.set(v.id, v.toPrimitives()); }
  async findById(id: string) { const r = this.rows.get(id); return r ? Vehicle.restore(r) : null; }
  async findByPlate(plate: string) { const r = [...this.rows.values()].find((x) => x.plate === plate); return r ? Vehicle.restore(r) : null; }
  async list(f: { status?: VehicleStatusValue; search?: string }) {
    const t = f.search?.toLowerCase();
    return [...this.rows.values()]
      .filter((r) => (!f.status || r.status === f.status) && (!t || `${r.plate} ${r.model}`.toLowerCase().includes(t)))
      .map((r) => Vehicle.restore(r));
  }
  async remove(id: string) { this.rows.delete(id); }
}

export class InMemoryDriverRepository implements DriverRepository {
  private readonly rows = new Map<string, DriverProps>();
  async add(d: Driver) { this.rows.set(d.id, d.toPrimitives()); }
  async save(d: Driver) { this.rows.set(d.id, d.toPrimitives()); }
  async findById(id: string) { const r = this.rows.get(id); return r ? Driver.restore(r) : null; }
  async findByCnh(cnh: string) { const r = [...this.rows.values()].find((x) => x.cnh === cnh); return r ? Driver.restore(r) : null; }
  async list(f: { active?: boolean; search?: string }) {
    const t = f.search?.toLowerCase();
    return [...this.rows.values()]
      .filter((r) => (f.active === undefined || r.active === f.active) && (!t || r.name.toLowerCase().includes(t)))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((r) => Driver.restore(r));
  }
  async remove(id: string) { this.rows.delete(id); }
}
