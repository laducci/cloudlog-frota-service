import { VehicleRepository } from "../../../Domain/Ports";
import { Vehicle, VehicleStatusValue } from "../../../Domain/Vehicle/Vehicle";
import { SqlConnection, sql } from "./SqlConnection";

interface VehicleRow { Id: string; Plate: string; Model: string; CapacityKg: number; Status: string; CreatedAt: Date; UpdatedAt: Date }

const toEntity = (r: VehicleRow) =>
  Vehicle.restore({
    id: r.Id, plate: r.Plate, model: r.Model, capacityKg: Number(r.CapacityKg), status: r.Status as VehicleStatusValue,
    createdAt: new Date(r.CreatedAt).toISOString(), updatedAt: new Date(r.UpdatedAt).toISOString(),
  });

/** Adaptador Azure SQL para Veículos (Database per Service). */
export class SqlVehicleRepository implements VehicleRepository {
  constructor(private readonly db: SqlConnection) {}

  private async request(v?: Vehicle) {
    const req = (await this.db.pool()).request();
    if (v) {
      const p = v.toPrimitives();
      req.input("Id", sql.NVarChar(36), p.id).input("Plate", sql.NVarChar(7), p.plate).input("Model", sql.NVarChar(100), p.model)
        .input("CapacityKg", sql.Decimal(10, 2), p.capacityKg).input("Status", sql.NVarChar(20), p.status)
        .input("CreatedAt", sql.DateTime2, new Date(p.createdAt)).input("UpdatedAt", sql.DateTime2, new Date(p.updatedAt));
    }
    return req;
  }

  async add(v: Vehicle) {
    await (await this.request(v)).query(
      "INSERT INTO dbo.Vehicles (Id, Plate, Model, CapacityKg, Status, CreatedAt, UpdatedAt) VALUES (@Id, @Plate, @Model, @CapacityKg, @Status, @CreatedAt, @UpdatedAt)");
  }

  async save(v: Vehicle) {
    await (await this.request(v)).query(
      "UPDATE dbo.Vehicles SET Plate=@Plate, Model=@Model, CapacityKg=@CapacityKg, Status=@Status, UpdatedAt=@UpdatedAt WHERE Id=@Id");
  }

  async findById(id: string) {
    const r = await (await this.request()).input("Id", sql.NVarChar(36), id).query<VehicleRow>("SELECT * FROM dbo.Vehicles WHERE Id=@Id");
    return r.recordset[0] ? toEntity(r.recordset[0]) : null;
  }

  async findByPlate(plate: string) {
    const r = await (await this.request()).input("Plate", sql.NVarChar(7), plate).query<VehicleRow>("SELECT * FROM dbo.Vehicles WHERE Plate=@Plate");
    return r.recordset[0] ? toEntity(r.recordset[0]) : null;
  }

  async list(filter: { status?: VehicleStatusValue; search?: string }) {
    const req = await this.request();
    const where: string[] = [];
    if (filter.status) { req.input("Status", sql.NVarChar(20), filter.status); where.push("Status=@Status"); }
    if (filter.search) { req.input("Search", sql.NVarChar(110), `%${filter.search}%`); where.push("(Plate LIKE @Search OR Model LIKE @Search)"); }
    const r = await req.query<VehicleRow>(`SELECT * FROM dbo.Vehicles ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY CreatedAt DESC`);
    return r.recordset.map(toEntity);
  }

  async remove(id: string) {
    await (await this.request()).input("Id", sql.NVarChar(36), id).query("DELETE FROM dbo.Vehicles WHERE Id=@Id");
  }
}
