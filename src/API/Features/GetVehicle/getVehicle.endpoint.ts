import { Router } from "express";
import { GetVehicleUseCase } from "../../../Application/Features/GetVehicle/GetVehicleUseCase";
import { asyncHandler } from "../../Http/asyncHandler";

export function mapGetVehicle(router: Router, useCase: GetVehicleUseCase) {
  router.get("/vehicles/:id", asyncHandler(async (req, res) => {
    res.json(await useCase.execute(req.params.id));
  }));
}
