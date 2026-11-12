import { Router } from "express";
import { GetDriverUseCase } from "../../../Application/Features/GetDriver/GetDriverUseCase";
import { asyncHandler } from "../../Http/asyncHandler";

export function mapGetDriver(router: Router, useCase: GetDriverUseCase) {
  router.get("/drivers/:id", asyncHandler(async (req, res) => {
    res.json(await useCase.execute(req.params.id));
  }));
}
