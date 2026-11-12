import { Router } from "express";
import { ListVehiclesUseCase } from "../../../Application/Features/ListVehicles/ListVehiclesUseCase";
import { asyncHandler } from "../../Http/asyncHandler";

export function mapListVehicles(router: Router, useCase: ListVehiclesUseCase) {
  router.get("/vehicles", asyncHandler(async (req, res) => {
    const q = req.query as Record<string, string | undefined>;
    res.json(await useCase.execute({ status: q.status, search: q.search }));
  }));
}
