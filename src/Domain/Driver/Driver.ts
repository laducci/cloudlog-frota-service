import { BusinessRuleError, ValidationError } from "../Errors";

export const CNH_CATEGORIES = ["B", "C", "D", "E"] as const;
export type CnhCategory = (typeof CNH_CATEGORIES)[number];

export interface DriverProps {
  id: string;
  name: string;
  cnh: string;
  cnhCategory: CnhCategory;
  phone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DriverData { name?: unknown; cnh?: unknown; cnhCategory?: unknown; phone?: unknown; active?: unknown }

const parseName = (v: unknown) => {
  const name = String(v ?? "").trim().replace(/\s+/g, " ");
  if (name.length < 3) throw new ValidationError("Nome do motorista deve ter ao menos 3 letras.");
  return name;
};
const parseCnh = (v: unknown) => {
  const cnh = String(v ?? "").replace(/\D/g, "");
  if (cnh.length !== 11) throw new ValidationError("CNH deve ter 11 dígitos.");
  return cnh;
};
const parseCategory = (v: unknown): CnhCategory => {
  const c = String(v ?? "").trim().toUpperCase();
  if (!CNH_CATEGORIES.includes(c as CnhCategory)) throw new ValidationError("Categoria da CNH deve ser B, C, D ou E.");
  return c as CnhCategory;
};
const parsePhone = (v: unknown) => {
  const phone = String(v ?? "").replace(/\D/g, "");
  if (phone.length < 10 || phone.length > 11) throw new ValidationError("Telefone deve ter DDD + número.");
  return phone;
};
const parseActive = (v: unknown) => {
  if (typeof v === "boolean") return v;
  if (v === "true" || v === 1) return true;
  if (v === "false" || v === 0) return false;
  throw new ValidationError('O campo "active" deve ser true ou false.');
};

/** Entidade Motorista. */
export class Driver {
  private constructor(private props: DriverProps) {}

  static create(data: DriverData, id: string, now: Date): Driver {
    return new Driver({
      id,
      name: parseName(data.name),
      cnh: parseCnh(data.cnh),
      cnhCategory: parseCategory(data.cnhCategory),
      phone: parsePhone(data.phone),
      active: data.active === undefined ? true : parseActive(data.active),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });
  }

  static restore(props: DriverProps) { return new Driver({ ...props }); }

  get id() { return this.props.id; }
  get cnh() { return this.props.cnh; }

  update(data: DriverData, now: Date): void {
    if (data.cnh !== undefined) throw new BusinessRuleError("A CNH não pode ser alterada; cadastre um novo motorista.");
    const next = { ...this.props };
    if (data.name !== undefined) next.name = parseName(data.name);
    if (data.cnhCategory !== undefined) next.cnhCategory = parseCategory(data.cnhCategory);
    if (data.phone !== undefined) next.phone = parsePhone(data.phone);
    if (data.active !== undefined) next.active = parseActive(data.active);
    next.updatedAt = now.toISOString();
    this.props = next;
  }

  /** Regra: caminhão exige CNH C, D ou E. */
  canDriveTruck(): boolean { return this.props.active && this.props.cnhCategory !== "B"; }

  toPrimitives(): DriverProps { return { ...this.props }; }
}
