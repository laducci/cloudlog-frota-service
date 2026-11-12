import { CNH_CATEGORIES } from "../../Domain/Driver/Driver";
import { VEHICLE_STATUS_VALUES } from "../../Domain/Vehicle/Vehicle";

const error = { type: "object", properties: { error: { type: "string" } } };
const err = (description: string) => ({ description, content: { "application/json": { schema: error } } });
const idParam = { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } };
const json = (schema: object) => ({ "application/json": { schema } });
const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const listOf = (name: string) => ({ type: "object", properties: { items: { type: "array", items: ref(name) }, total: { type: "integer" } } });

function crud(tag: string, base: string, entity: string, input: string, listParams: object[]) {
  return {
    [base]: {
      get: { tags: [tag], summary: `Listar ${tag.toLowerCase()}`, parameters: listParams, responses: { 200: { description: "Lista", content: json(listOf(entity)) }, 400: err("Filtro inválido") } },
      post: { tags: [tag], summary: `Cadastrar ${entity === "Vehicle" ? "veículo" : "motorista"}`, requestBody: { required: true, content: json(ref(input)) },
        responses: { 201: { description: "Criado", content: json(ref(entity)) }, 400: err("Dados inválidos"), 409: err("Duplicado") } },
    },
    [`${base}/{id}`]: {
      get: { tags: [tag], summary: "Buscar por id", parameters: [idParam], responses: { 200: { description: "OK", content: json(ref(entity)) }, 404: err("Não encontrado") } },
      put: { tags: [tag], summary: "Alterar", parameters: [idParam], requestBody: { required: true, content: json(ref(input)) },
        responses: { 200: { description: "Alterado", content: json(ref(entity)) }, 400: err("Dados inválidos"), 404: err("Não encontrado"), 409: err("Duplicado"), 422: err("Regra de negócio") } },
      delete: { tags: [tag], summary: "Excluir", parameters: [idParam], responses: { 204: { description: "Excluído" }, 404: err("Não encontrado"), 422: err("Regra de negócio") } },
    },
  };
}

/** Documento OpenAPI 3 (Swagger) do microserviço de Frota. */
export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "CloudLog · Microserviço de Frota",
    version: "1.0.0",
    description: "Veículos e Motoristas da frota, persistidos no Azure SQL Database. Alunos: Camilla Augusta Uber, João Davi, Laura Guillarducci.",
  },
  tags: [{ name: "Veículos" }, { name: "Motoristas" }],
  paths: {
    ...crud("Veículos", "/vehicles", "Vehicle", "VehicleInput", [
      { name: "status", in: "query", schema: { type: "string", enum: VEHICLE_STATUS_VALUES } },
      { name: "search", in: "query", description: "Placa ou modelo", schema: { type: "string" } },
    ]),
    ...crud("Motoristas", "/drivers", "Driver", "DriverInput", [
      { name: "active", in: "query", schema: { type: "boolean" } },
      { name: "search", in: "query", description: "Nome", schema: { type: "string" } },
    ]),
    "/health": { get: { tags: ["Veículos"], summary: "Health check", responses: { 200: { description: "OK" } } } },
  },
  components: {
    schemas: {
      VehicleInput: {
        type: "object", required: ["plate", "model", "capacityKg"],
        properties: {
          plate: { type: "string", example: "BRA2E19" }, model: { type: "string", example: "Volvo FH 540" },
          capacityKg: { type: "number", example: 25000 }, status: { type: "string", enum: VEHICLE_STATUS_VALUES },
        },
      },
      Vehicle: {
        type: "object",
        properties: {
          id: { type: "string" }, plate: { type: "string" }, model: { type: "string" }, capacityKg: { type: "number" },
          status: { type: "string", enum: VEHICLE_STATUS_VALUES }, createdAt: { type: "string" }, updatedAt: { type: "string" },
        },
      },
      DriverInput: {
        type: "object", required: ["name", "cnh", "cnhCategory", "phone"],
        properties: {
          name: { type: "string", example: "Marcos Pereira" }, cnh: { type: "string", example: "12345678901", description: "Não pode ser alterada" },
          cnhCategory: { type: "string", enum: CNH_CATEGORIES }, phone: { type: "string", example: "41999990000" }, active: { type: "boolean" },
        },
      },
      Driver: {
        type: "object",
        properties: {
          id: { type: "string" }, name: { type: "string" }, cnh: { type: "string" }, cnhCategory: { type: "string", enum: CNH_CATEGORIES },
          phone: { type: "string" }, active: { type: "boolean" }, createdAt: { type: "string" }, updatedAt: { type: "string" },
        },
      },
    },
  },
};
