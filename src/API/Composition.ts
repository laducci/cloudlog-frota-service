import { CreateVehicleUseCase } from "../Application/Features/CreateVehicle/CreateVehicleUseCase";
import { GetVehicleUseCase } from "../Application/Features/GetVehicle/GetVehicleUseCase";
import { ListVehiclesUseCase } from "../Application/Features/ListVehicles/ListVehiclesUseCase";
import { UpdateVehicleUseCase } from "../Application/Features/UpdateVehicle/UpdateVehicleUseCase";
import { DeleteVehicleUseCase } from "../Application/Features/DeleteVehicle/DeleteVehicleUseCase";
import { CreateDriverUseCase } from "../Application/Features/CreateDriver/CreateDriverUseCase";
import { GetDriverUseCase } from "../Application/Features/GetDriver/GetDriverUseCase";
import { ListDriversUseCase } from "../Application/Features/ListDrivers/ListDriversUseCase";
import { UpdateDriverUseCase } from "../Application/Features/UpdateDriver/UpdateDriverUseCase";
import { DeleteDriverUseCase } from "../Application/Features/DeleteDriver/DeleteDriverUseCase";
import { Infrastructure } from "../Infrastructure/buildInfrastructure";

/** Composition Root: liga cada caso de uso aos adaptadores concretos. */
export function composeUseCases(infra: Pick<Infrastructure, "vehicles" | "drivers" | "clock" | "ids">) {
  const { vehicles, drivers, clock, ids } = infra;
  return {
    createVehicle: new CreateVehicleUseCase({ vehicles, clock, ids }),
    getVehicle: new GetVehicleUseCase({ vehicles }),
    listVehicles: new ListVehiclesUseCase({ vehicles }),
    updateVehicle: new UpdateVehicleUseCase({ vehicles, clock }),
    deleteVehicle: new DeleteVehicleUseCase({ vehicles }),
    createDriver: new CreateDriverUseCase({ drivers, clock, ids }),
    getDriver: new GetDriverUseCase({ drivers }),
    listDrivers: new ListDriversUseCase({ drivers }),
    updateDriver: new UpdateDriverUseCase({ drivers, clock }),
    deleteDriver: new DeleteDriverUseCase({ drivers }),
  };
}

export type UseCases = ReturnType<typeof composeUseCases>;
