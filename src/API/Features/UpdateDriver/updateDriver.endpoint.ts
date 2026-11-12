import { Router } from "express";
import { UpdateDriverUseCase } from "../../../Application/Features/UpdateDriver/UpdateDriverUseCase";
import { asyncHandler } from "../../Http/asyncHandler";

export function mapUpdateDriver(router: Router, useCase: UpdateDriverUseCase) {
  router.put("/drivers/:id", asyncHandler(async (req, res) => {
    res.json(await useCase.execute(req.params.id, req.body ?? {}));
  }));
}
