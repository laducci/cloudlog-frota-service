import { Router } from "express";
import { ListDriversUseCase } from "../../../Application/Features/ListDrivers/ListDriversUseCase";
import { asyncHandler } from "../../Http/asyncHandler";

export function mapListDrivers(router: Router, useCase: ListDriversUseCase) {
  router.get("/drivers", asyncHandler(async (req, res) => {
    const q = req.query as Record<string, string | undefined>;
    res.json(await useCase.execute({ active: q.active, search: q.search }));
  }));
}
