import { Router } from "express";
import { DeleteDriverUseCase } from "../../../Application/Features/DeleteDriver/DeleteDriverUseCase";
import { asyncHandler } from "../../Http/asyncHandler";

export function mapDeleteDriver(router: Router, useCase: DeleteDriverUseCase) {
  router.delete("/drivers/:id", asyncHandler(async (req, res) => {
    await useCase.execute(req.params.id);
    res.status(204).end();
  }));
}
