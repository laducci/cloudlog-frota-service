import cors from "cors";
import express, { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { UseCases } from "./Composition";
import { openApiDocument } from "./Docs/openapi";
import { mapCreateVehicle } from "./Features/CreateVehicle/createVehicle.endpoint";
import { mapGetVehicle } from "./Features/GetVehicle/getVehicle.endpoint";
import { mapListVehicles } from "./Features/ListVehicles/listVehicles.endpoint";
import { mapUpdateVehicle } from "./Features/UpdateVehicle/updateVehicle.endpoint";
import { mapDeleteVehicle } from "./Features/DeleteVehicle/deleteVehicle.endpoint";
import { mapCreateDriver } from "./Features/CreateDriver/createDriver.endpoint";
import { mapGetDriver } from "./Features/GetDriver/getDriver.endpoint";
import { mapListDrivers } from "./Features/ListDrivers/listDrivers.endpoint";
import { mapUpdateDriver } from "./Features/UpdateDriver/updateDriver.endpoint";
import { mapDeleteDriver } from "./Features/DeleteDriver/deleteDriver.endpoint";
import { errorHandler } from "./Http/errorHandler";

export function createApp(useCases: UseCases, info: Record<string, string> = {}) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => res.redirect("/docs"));
  app.get("/health", (_req, res) => res.json({ status: "ok", service: "cloudlog-frota-service", ...info }));
  app.get("/openapi.json", (_req, res) => res.json(openApiDocument));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument, { customSiteTitle: "CloudLog · Frota API" }));

  const router = Router();
  mapListVehicles(router, useCases.listVehicles);
  mapGetVehicle(router, useCases.getVehicle);
  mapCreateVehicle(router, useCases.createVehicle);
  mapUpdateVehicle(router, useCases.updateVehicle);
  mapDeleteVehicle(router, useCases.deleteVehicle);
  mapListDrivers(router, useCases.listDrivers);
  mapGetDriver(router, useCases.getDriver);
  mapCreateDriver(router, useCases.createDriver);
  mapUpdateDriver(router, useCases.updateDriver);
  mapDeleteDriver(router, useCases.deleteDriver);
  app.use(router);

  app.use((_req, res) => res.status(404).json({ error: "Rota não encontrada." }));
  app.use(errorHandler);
  return app;
}
