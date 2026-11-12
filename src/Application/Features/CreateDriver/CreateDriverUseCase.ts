import { Driver, DriverData, DriverProps } from "../../../Domain/Driver/Driver";
import { ConflictError } from "../../../Domain/Errors";
import { Clock, DriverRepository, IdGenerator } from "../../../Domain/Ports";

export class CreateDriverUseCase {
  constructor(private readonly deps: { drivers: DriverRepository; clock: Clock; ids: IdGenerator }) {}

  async execute(input: DriverData): Promise<DriverProps> {
    const driver = Driver.create(input, this.deps.ids.next(), this.deps.clock.now());
    if (await this.deps.drivers.findByCnh(driver.cnh)) throw new ConflictError("Já existe motorista com essa CNH.");
    await this.deps.drivers.add(driver);
    return driver.toPrimitives();
  }
}
