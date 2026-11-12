import { BusinessRuleError, ValidationError } from "../Errors";

export const VehicleStatus = { AVAILABLE: "Disponível", IN_USE: "Em uso", MAINTENANCE: "Manutenção" } as const;
export type VehicleStatusValue = (typeof VehicleStatus)[keyof typeof VehicleStatus];
export const VEHICLE_STATUS_VALUES = Object.values(VehicleStatus) as VehicleStatusValue[];

export interface VehicleProps {
  id: string;
  plate: string;
  model: string;
  capacityKg: number;
  status: VehicleStatusValue;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleData { plate?: unknown; model?: unknown; capacityKg?: unknown; status?: unknown }

/** Placa no padrão antigo (ABC1234) ou Mercosul (ABC1D23). */
const PLATE = /^[A-Z]{3}\d[A-Z0-9]\d{2}$/;

const parsePlate = (v: unknown) => {
  const plate = String(v ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!PLATE.test(plate)) throw new ValidationError("Placa inválida. Use ABC1234 ou ABC1D23.");
  return plate;
};
const parseModel = (v: unknown) => {
  const model = String(v ?? "").trim();
  if (!model) throw new ValidationError('O campo "model" é obrigatório.');
  return model;
};
const parseCapacity = (v: unknown) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0 || n > 60000) throw new ValidationError("Capacidade deve estar entre 1 e 60000 kg.");
  return n;
};
export const parseVehicleStatus = (v: unknown): VehicleStatusValue => {
  if (!VEHICLE_STATUS_VALUES.includes(v as VehicleStatusValue)) {
    throw new ValidationError(`Status inválido. Use: ${VEHICLE_STATUS_VALUES.join(", ")}.`);
  }
  return v as VehicleStatusValue;
};

/** Entidade Veículo da frota. */
export class Vehicle {
  private constructor(private props: VehicleProps) {}

  static create(data: VehicleData, id: string, now: Date): Vehicle {
    return new Vehicle({
      id,
      plate: parsePlate(data.plate),
      model: parseModel(data.model),
      capacityKg: parseCapacity(data.capacityKg),
      status: data.status === undefined ? VehicleStatus.AVAILABLE : parseVehicleStatus(data.status),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  }

  static restore(props: VehicleProps) { return new Vehicle({ ...props }); }

  get id() { return this.props.id; }
  get plate() { return this.props.plate; }

  update(data: VehicleData, now: Date): void {
    const next = { ...this.props };
    if (data.plate !== undefined) next.plate = parsePlate(data.plate);
    if (data.model !== undefined) next.model = parseModel(data.model);
    if (data.capacityKg !== undefined) next.capacityKg = parseCapacity(data.capacityKg);
    if (data.status !== undefined) next.status = parseVehicleStatus(data.status);
    next.updatedAt = now.toISOString();
    this.props = next;
  }

  /** Regra: veículo em uso não pode sair da frota. */
  assertCanBeDeleted(): void {
    if (this.props.status === VehicleStatus.IN_USE) throw new BusinessRuleError("Veículo em uso não pode ser excluído.");
  }

  /** Regra: só é possível alocar veículo disponível que comporte a carga. */
  canCarry(weightKg: number): boolean {
    return this.props.status === VehicleStatus.AVAILABLE && weightKg <= this.props.capacityKg;
  }

  toPrimitives(): VehicleProps { return { ...this.props }; }
}
