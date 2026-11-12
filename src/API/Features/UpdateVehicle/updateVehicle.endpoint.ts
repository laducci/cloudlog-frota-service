import { Router } from "express";
import { UpdateVehicleUseCase } from "../../../Application/Features/UpdateVehicle/UpdateVehicleUseCase";
import { asyncHandler } from "../../Http/asyncHandler";

export function mapUpdateVehicle(router: Router, useCase: UpdateVehicleUseCase) {
  router.put("/vehicles/:id", asyncHandler(async (req, res) => {
    res.json(await useCase.execute(req.params.id, req.body ?? {}));
  }));
}
