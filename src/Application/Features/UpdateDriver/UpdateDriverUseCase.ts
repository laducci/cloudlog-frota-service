import { DriverData, DriverProps } from "../../../Domain/Driver/Driver";
import { ValidationError } from "../../../Domain/Errors";
import { Clock, DriverRepository } from "../../../Domain/Ports";
import { findDriverOrFail } from "../../Common/loaders";

export class UpdateDriverUseCase {
  constructor(private readonly deps: { drivers: DriverRepository; clock: Clock }) {}

  async execute(id: string, changes: DriverData): Promise<DriverProps> {
    if (!changes || !Object.keys(changes).length) throw new ValidationError("Informe ao menos um campo para alterar.");
    const driver = await findDriverOrFail(this.deps.drivers, id);
    driver.update(changes, this.deps.clock.now());
    await this.deps.drivers.save(driver);
    return driver.toPrimitives();
  }
}
