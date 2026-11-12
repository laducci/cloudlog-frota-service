import { Router } from "express";
import { CreateDriverUseCase } from "../../../Application/Features/CreateDriver/CreateDriverUseCase";
import { asyncHandler } from "../../Http/asyncHandler";

export function mapCreateDriver(router: Router, useCase: CreateDriverUseCase) {
  router.post("/drivers", asyncHandler(async (req, res) => {
    res.status(201).json(await useCase.execute(req.body ?? {}));
  }));
}
