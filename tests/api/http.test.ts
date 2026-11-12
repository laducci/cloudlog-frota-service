import request from "supertest";
import { createApp } from "../../src/API/app";
import { driver, makeTestContext, truck } from "../support";

describe("API HTTP (Express)", () => {
  const app = createApp(makeTestContext().useCases);

  it("CRUD de veículos com status HTTP corretos", async () => {
    const { body } = await request(app).post("/vehicles").send(truck()).expect(201);
    await request(app).get(`/vehicles/${body.id}`).expect(200);
    await request(app).post("/vehicles").send(truck()).expect(409);
    await request(app).post("/vehicles").send({ plate: "x" }).expect(400);
    await request(app).put(`/vehicles/${body.id}`).send({ status: "Em uso" }).expect(200);
    await request(app).delete(`/vehicles/${body.id}`).expect(422);
    await request(app).put(`/vehicles/${body.id}`).send({ status: "Disponível" }).expect(200);
    await request(app).delete(`/vehicles/${body.id}`).expect(204);
    await request(app).get(`/vehicles/${body.id}`).expect(404);
  });

  it("CRUD de motoristas", async () => {
    const { body } = await request(app).post("/drivers").send(driver()).expect(201);
    expect((await request(app).get("/drivers").expect(200)).body.total).toBe(1);
    await request(app).put(`/drivers/${body.id}`).send({ cnh: "00000000000" }).expect(422);
    await request(app).put(`/drivers/${body.id}`).send({ phone: "41988887777" }).expect(200);
    await request(app).delete(`/drivers/${body.id}`).expect(204);
  });

  it("expõe Swagger e health", async () => {
    await request(app).get("/docs/").expect(200);
    expect(Object.keys((await request(app).get("/openapi.json")).body.paths)).toEqual(["/vehicles", "/vehicles/{id}", "/drivers", "/drivers/{id}", "/health"]);
    await request(app).get("/health").expect(200);
  });
});
