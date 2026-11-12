import { Driver } from "../../src/Domain/Driver/Driver";
import { BusinessRuleError, ValidationError } from "../../src/Domain/Errors";
import { Vehicle } from "../../src/Domain/Vehicle/Vehicle";
import { driver, truck } from "../support";

const now = new Date("2026-11-12T12:00:00Z");

describe("Entidade Vehicle", () => {
  it("normaliza a placa e começa Disponível", () => {
    expect(Vehicle.create(truck(), "v1", now).toPrimitives()).toMatchObject({ plate: "BRA2E19", status: "Disponível" });
  });
  it("aceita placa antiga e Mercosul e rejeita placa inválida", () => {
    expect(() => Vehicle.create(truck({ plate: "ABC1234" }), "v", now)).not.toThrow();
    expect(() => Vehicle.create(truck({ plate: "12ABC" }), "v", now)).toThrow(ValidationError);
  });
  it("valida capacidade e status", () => {
    expect(() => Vehicle.create(truck({ capacityKg: 0 }), "v", now)).toThrow(ValidationError);
    expect(() => Vehicle.create(truck({ status: "Voando" }), "v", now)).toThrow(ValidationError);
  });
  it("veículo em uso não pode ser excluído e só carrega se estiver disponível e couber", () => {
    const v = Vehicle.create(truck({ capacityKg: 1000 }), "v", now);
    expect(v.canCarry(900)).toBe(true);
    expect(v.canCarry(1500)).toBe(false);
    v.update({ status: "Em uso" }, now);
    expect(v.canCarry(10)).toBe(false);
    expect(() => v.assertCanBeDeleted()).toThrow(BusinessRuleError);
  });
});

describe("Entidade Driver", () => {
  it("normaliza CNH, categoria e telefone", () => {
    expect(Driver.create(driver(), "d1", now).toPrimitives()).toMatchObject({ cnh: "12345678901", cnhCategory: "E", phone: "41999990000", active: true });
  });
  it("rejeita dados inválidos", () => {
    expect(() => Driver.create(driver({ cnh: "123" }), "d", now)).toThrow(ValidationError);
    expect(() => Driver.create(driver({ cnhCategory: "A" }), "d", now)).toThrow(ValidationError);
    expect(() => Driver.create(driver({ name: "Jo" }), "d", now)).toThrow(ValidationError);
  });
  it("CNH não pode ser alterada e categoria B não dirige caminhão", () => {
    const d = Driver.create(driver({ cnhCategory: "B" }), "d", now);
    expect(d.canDriveTruck()).toBe(false);
    expect(() => d.update({ cnh: "99999999999" }, now)).toThrow(BusinessRuleError);
  });
});
