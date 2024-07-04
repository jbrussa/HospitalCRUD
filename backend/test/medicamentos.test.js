const request = require("supertest");
const app = require("../index");
const { DECIMAL } = require("sequelize");

const medicamentoAlta = {
  IdMedicamento: Math.trunc(Math.random() * 90 + 10), /* creo un numero aleatorio, math trunc me da un numero de 0 a 1, * 90 pq quiero que sea de 0 a 90, y + 10 pq no quiero que ocupen los 10 primeros que ya tengo */
  Nombre: "Paracetamol",
  Precio: 5.99,
  FechaLanzamiento: new Date().toISOString(),
  IdTipoMedicamento: 1,
  Activo: 1,
};
const medicamentoModificacion = {
    IdMedicamento: Math.trunc(Math.random() * 90 + 10), /* creo un numero aleatorio, math trunc me da un numero de 0 a 1, * 90 pq quiero que sea de 0 a 90, y + 10 pq no quiero que ocupen los 10 primeros que ya tengo */
    Nombre: "Ibuprofeno",
    Precio: 8.0,
    FechaLanzamiento: new Date().toISOString(),
    IdTipoMedicamento: 1,
    Activo: 1,
};

describe("GET /api/medicamentos", function () {
  it("Devolveria todos los medicamentos", async function () {
    const res = await request(app)
      .get("/api/medicamentos")
      .set("content-type", "application/json");
    expect(res.headers["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          IdMedicamento: expect.any(Number),
          Nombre: expect.any(String),
          Precio: expect.any(Number),
          FechaLanzamiento: expect.any(String),
          IdTipoMedicamento: expect.any(Number),
          Activo: expect.any(Boolean),
        }),
      ])
    );
  });
});

describe("GET /api/medicamentos/:id", function () {
  it("Responde con un json conteniendo un solo medicamento", async function () {
    const res = await request(app).get("/api/medicamentos/5");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdMedicamento: 5,
        Nombre: expect.any(String),
        Precio: expect.any(Number),
        FechaLanzamiento: expect.any(String),
        IdTipoMedicamento: expect.any(Number),
        Activo: expect.any(Boolean),
      })
    );
  });
});

describe("POST /api/medicamentos", () => {
  it("Deberia devolver el medicamento que acabo de crear", async () => {
    const res = await request(app).post("/api/medicamentos").send(medicamentoAlta);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdMedicamento: expect.any(Number),
        Nombre: expect.any(String),
        Precio: expect.any(Number),
        FechaLanzamiento: expect.any(String),
        IdTipoMedicamento: expect.any(Number),
        Activo: expect.any(Boolean),
      })
    );
  });
});

describe("PUT /api/medicamentos/:id", () => {
  it("Deberia devolver el medicamento con el IdMedicamento 5 modificado", async () => {
    const res = await request(app)
      .put("/api/medicamentos/5")
      .send(medicamentoModificacion);
    expect(res.statusCode).toEqual(204);
  });
});

describe("DELETE /api/medicamentos/:id", () => {
  it("Debería devolver el medicamento con el IdMedicamento 6 borrado", async () => {
    const res = await request(app).delete("/api/medicamentos/6");
    expect(res.statusCode).toEqual(200);
  });
});