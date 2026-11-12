import { ConflictError, NotFoundError, ValidationError } from "../../src/Domain/Errors";
import { driver, makeTestContext, truck } from "../support";

describe("Casos de uso de Veículos", () => {
  it("cria, busca, lista, altera e exclui", async () => {
    const { useCases: uc } = makeTestContext();
    const v = await uc.createVehicle.execute(truck());
    expect((await uc.getVehicle.execute(v.id)).plate).toBe("BRA2E19");
    expect((await uc.listVehicles.execute({ search: "volvo" })).total).toBe(1);
    expect((await uc.updateVehicle.execute(v.id, { status: "Manutenção" })).status).toBe("Manutenção");
    await uc.deleteVehicle.execute(v.id);
    await expect(uc.getVehicle.execute(v.id)).rejects.toBeInstanceOf(NotFoundError);
  });
  it("não aceita placa duplicada (cadastro ou alteração)", async () => {
    const { useCases: uc } = makeTestContext();
    await uc.createVehicle.execute(truck());
    const other = await uc.createVehicle.execute(truck({ plate: "ABC1234" }));
    await expect(uc.createVehicle.execute(truck())).rejects.toBeInstanceOf(ConflictError);
    await expect(uc.updateVehicle.execute(other.id, { plate: "BRA2E19" })).rejects.toBeInstanceOf(ConflictError);
  });
  it("valida filtro de status e alteração vazia", async () => {
    const { useCases: uc } = makeTestContext();
    const v = await uc.createVehicle.execute(truck());
    await expect(uc.listVehicles.execute({ status: "x" })).rejects.toBeInstanceOf(ValidationError);
    await expect(uc.updateVehicle.execute(v.id, {})).rejects.toBeInstanceOf(ValidationError);
  });
});

describe("Casos de uso de Motoristas", () => {
  it("cria, busca, lista por ativo, altera e exclui", async () => {
    const { useCases: uc } = makeTestContext();
    const d = await uc.createDriver.execute(driver());
    expect((await uc.getDriver.execute(d.id)).name).toBe("Marcos Pereira");
    await uc.updateDriver.execute(d.id, { active: false });
    expect((await uc.listDrivers.execute({ active: "true" })).total).toBe(0);
    expect((await uc.listDrivers.execute({ active: "false" })).total).toBe(1);
    await uc.deleteDriver.execute(d.id);
    await expect(uc.getDriver.execute(d.id)).rejects.toBeInstanceOf(NotFoundError);
  });
  it("não aceita CNH duplicada nem filtro inválido", async () => {
    const { useCases: uc } = makeTestContext();
    await uc.createDriver.execute(driver());
    await expect(uc.createDriver.execute(driver({ name: "Outro Nome" }))).rejects.toBeInstanceOf(ConflictError);
    await expect(uc.listDrivers.execute({ active: "talvez" })).rejects.toBeInstanceOf(ValidationError);
  });
});
