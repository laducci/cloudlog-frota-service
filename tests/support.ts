import { composeUseCases } from "../src/API/Composition";
import { InMemoryDriverRepository, InMemoryVehicleRepository } from "../src/Infrastructure/Persistence/InMemory/InMemoryRepositories";

export function makeTestContext() {
  let i = 0;
  const vehicles = new InMemoryVehicleRepository();
  const drivers = new InMemoryDriverRepository();
  const useCases = composeUseCases({ vehicles, drivers, clock: { now: () => new Date("2026-11-12T12:00:00Z") }, ids: { next: () => `id-${++i}` } });
  return { vehicles, drivers, useCases };
}

export const truck = (over: Record<string, unknown> = {}) => ({ plate: "bra-2e19", model: "Volvo FH 540", capacityKg: 25000, ...over });
export const driver = (over: Record<string, unknown> = {}) => ({ name: "Marcos Pereira", cnh: "123.456.789-01", cnhCategory: "e", phone: "(41) 99999-0000", ...over });
