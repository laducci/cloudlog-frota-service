import { Clock, DriverRepository, IdGenerator, VehicleRepository } from "../Domain/Ports";
import { InMemoryDriverRepository, InMemoryVehicleRepository } from "./Persistence/InMemory/InMemoryRepositories";
import { SqlConnection } from "./Persistence/Sql/SqlConnection";
import { SqlDriverRepository } from "./Persistence/Sql/SqlDriverRepository";
import { SqlVehicleRepository } from "./Persistence/Sql/SqlVehicleRepository";
import { SystemClock, UuidGenerator } from "./Time/SystemClock";

export interface Infrastructure {
  vehicles: VehicleRepository;
  drivers: DriverRepository;
  clock: Clock;
  ids: IdGenerator;
  description: { repository: string };
}

export function buildInfrastructure(env: NodeJS.ProcessEnv = process.env): Infrastructure {
  const useSql = (env.FLEET_REPOSITORY ?? (env.SQL_SERVER ? "sql" : "memory")) === "sql";
  const base = { clock: new SystemClock(), ids: new UuidGenerator() };
  if (!useSql) {
    return { ...base, vehicles: new InMemoryVehicleRepository(), drivers: new InMemoryDriverRepository(), description: { repository: "memory" } };
  }
  const db = new SqlConnection({
    server: env.SQL_SERVER ?? "", database: env.SQL_DATABASE ?? "cloudlog-frota",
    user: env.SQL_USER ?? "", password: env.SQL_PASSWORD ?? "", port: env.SQL_PORT ? Number(env.SQL_PORT) : undefined,
  });
  return { ...base, vehicles: new SqlVehicleRepository(db), drivers: new SqlDriverRepository(db), description: { repository: "azure-sql" } };
}
