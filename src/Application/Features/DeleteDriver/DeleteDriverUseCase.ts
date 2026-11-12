import { DriverRepository } from "../../../Domain/Ports";
import { findDriverOrFail } from "../../Common/loaders";

export class DeleteDriverUseCase {
  constructor(private readonly deps: { drivers: DriverRepository }) {}
  async execute(id: string): Promise<void> {
    const driver = await findDriverOrFail(this.deps.drivers, id);
    await this.deps.drivers.remove(driver.id);
  }
}
