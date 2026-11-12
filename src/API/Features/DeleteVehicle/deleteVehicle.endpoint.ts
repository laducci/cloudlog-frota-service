import { Router } from "express";
import { DeleteVehicleUseCase } from "../../../Application/Features/DeleteVehicle/DeleteVehicleUseCase";
import { asyncHandler } from "../../Http/asyncHandler";

export function mapDeleteVehicle(router: Router, useCase: DeleteVehicleUseCase) {
  router.delete("/vehicles/:id", asyncHandler(async (req, res) => {
    await useCase.execute(req.params.id);
    res.status(204).end();
  }));
}
