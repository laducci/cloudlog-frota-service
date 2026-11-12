import { CnhCategory, Driver } from "../../../Domain/Driver/Driver";
import { DriverRepository } from "../../../Domain/Ports";
import { SqlConnection, sql } from "./SqlConnection";

interface DriverRow { Id: string; Name: string; Cnh: string; CnhCategory: string; Phone: string; Active: boolean; CreatedAt: Date; UpdatedAt: Date }

const toEntity = (r: DriverRow) =>
  Driver.restore({
    id: r.Id, name: r.Name, cnh: r.Cnh, cnhCategory: r.CnhCategory as CnhCategory, phone: r.Phone, active: Boolean(r.Active),
    createdAt: new Date(r.CreatedAt).toISOString(), updatedAt: new Date(r.UpdatedAt).toISOString(),
  });

/** Adaptador Azure SQL para Motoristas. */
export class SqlDriverRepository implements DriverRepository {
  constructor(private readonly db: SqlConnection) {}

  private async request(d?: Driver) {
    const req = (await this.db.pool()).request();
    if (d) {
      const p = d.toPrimitives();
      req.input("Id", sql.NVarChar(36), p.id).input("Name", sql.NVarChar(120), p.name).input("Cnh", sql.NVarChar(11), p.cnh)
        .input("CnhCategory", sql.NVarChar(2), p.cnhCategory).input("Phone", sql.NVarChar(11), p.phone).input("Active", sql.Bit, p.active)
        .input("CreatedAt", sql.DateTime2, new Date(p.createdAt)).input("UpdatedAt", sql.DateTime2, new Date(p.updatedAt));
    }
    return req;
  }

  async add(d: Driver) {
    await (await this.request(d)).query(
      "INSERT INTO dbo.Drivers (Id, Name, Cnh, CnhCategory, Phone, Active, CreatedAt, UpdatedAt) VALUES (@Id, @Name, @Cnh, @CnhCategory, @Phone, @Active, @CreatedAt, @UpdatedAt)");
  }

  async save(d: Driver) {
    await (await this.request(d)).query(
      "UPDATE dbo.Drivers SET Name=@Name, CnhCategory=@CnhCategory, Phone=@Phone, Active=@Active, UpdatedAt=@UpdatedAt WHERE Id=@Id");
  }

  async findById(id: string) {
    const r = await (await this.request()).input("Id", sql.NVarChar(36), id).query<DriverRow>("SELECT * FROM dbo.Drivers WHERE Id=@Id");
    return r.recordset[0] ? toEntity(r.recordset[0]) : null;
  }

  async findByCnh(cnh: string) {
    const r = await (await this.request()).input("Cnh", sql.NVarChar(11), cnh).query<DriverRow>("SELECT * FROM dbo.Drivers WHERE Cnh=@Cnh");
    return r.recordset[0] ? toEntity(r.recordset[0]) : null;
  }

  async list(filter: { active?: boolean; search?: string }) {
    const req = await this.request();
    const where: string[] = [];
    if (filter.active !== undefined) { req.input("Active", sql.Bit, filter.active); where.push("Active=@Active"); }
    if (filter.search) { req.input("Search", sql.NVarChar(130), `%${filter.search}%`); where.push("Name LIKE @Search"); }
    const r = await req.query<DriverRow>(`SELECT * FROM dbo.Drivers ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY Name`);
    return r.recordset.map(toEntity);
  }

  async remove(id: string) {
    await (await this.request()).input("Id", sql.NVarChar(36), id).query("DELETE FROM dbo.Drivers WHERE Id=@Id");
  }
}
