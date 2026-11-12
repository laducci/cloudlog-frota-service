import { DriverProps } from "../../../Domain/Driver/Driver";
import { ValidationError } from "../../../Domain/Errors";
import { DriverRepository } from "../../../Domain/Ports";

export class ListDriversUseCase {
  constructor(private readonly deps: { drivers: DriverRepository }) {}

  async execute(query: { active?: string; search?: string } = {}): Promise<{ items: DriverProps[]; total: number }> {
    let active: boolean | undefined;
    if (query.active !== undefined && query.active !== "") {
      if (!["true", "false"].includes(query.active)) throw new ValidationError('O filtro "active" deve ser true ou false.');
      active = query.active === "true";
    }
    const items = await this.deps.drivers.list({ active, search: query.search?.trim() || undefined });
    return { items: items.map((d) => d.toPrimitives()), total: items.length };
  }
}
