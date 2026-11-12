import { DriverProps } from "../../../Domain/Driver/Driver";
import { DriverRepository } from "../../../Domain/Ports";
import { findDriverOrFail } from "../../Common/loaders";

export class GetDriverUseCase {
  constructor(private readonly deps: { drivers: DriverRepository }) {}
  async execute(id: string): Promise<DriverProps> {
    return (await findDriverOrFail(this.deps.drivers, id)).toPrimitives();
  }
}
