import { Router } from "express";
import { CreateVehicleUseCase } from "../../../Application/Features/CreateVehicle/CreateVehicleUseCase";
import { asyncHandler } from "../../Http/asyncHandler";

export function mapCreateVehicle(router: Router, useCase: CreateVehicleUseCase) {
  router.post("/vehicles", asyncHandler(async (req, res) => {
    res.status(201).json(await useCase.execute(req.body ?? {}));
  }));
}
