const request = require("supertest");
const app = require("../index");

const salaAlta = {
  IdSala: Math.trunc(Math.random() * 90 + 10), /* creo un numero aleatorio, math trunc me da un numero de 0 a 1, * 90 pq quiero que sea de 0 a 90, y + 10 pq no quiero que ocupen los 10 primeros que ya tengo */
  Ala: "norte",
  FechaUltimoControl: new Date().toISOString(),
  NumTipoSala: 2,
  Activo: 1,
};
const salaModificacion = {
  IdSala: 5,
  Ala: "este",
  FechaUltimoControl: new Date().toISOString(), /* modifico fecha */
  NumTipoSala: 2,
  Activo: 1,
};

describe("GET /api/salas", function () {
  it("Devolveria todas las salas", async function () {
    const res = await request(app)
      .get("/api/salas")
      .set("content-type", "application/json");
    expect(res.headers["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          IdSala: expect.any(Number),
          Ala: expect.any(String),
          FechaUltimoControl: expect.any(String),
          NumTipoSala: expect.any(Number),
          Activo: expect.any(Boolean),
        }),
      ])
    );
  });
});

describe("GET /api/salas/:id", function () {
  it("Responde con un json conteniendo una sola sala", async function () {
    const res = await request(app).get("/api/salas/5");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdSala: 5,
        Ala: expect.any(String),
        FechaUltimoControl: expect.any(String),
        NumTipoSala: expect.any(Number),
        Activo: expect.any(Boolean),
      })
    );
  });
});

describe("POST /api/salas", () => {
  it("Deberia devolver la sala que acabo de crear", async () => {
    const res = await request(app).post("/api/salas").send(salaAlta);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdSala: expect.any(Number),
        Ala: expect.any(String),
        FechaUltimoControl: expect.any(String),
        NumTipoSala: expect.any(Number),
        Activo: expect.any(Boolean),
      })
    );
  });
});

describe("PUT /api/salas/:id", () => {
  it("Deberia devolver la sala con el IdSala 5 modificada", async () => {
    const res = await request(app)
      .put("/api/salas/5")
      .send(salaModificacion);
    expect(res.statusCode).toEqual(204);
  });
});

describe("DELETE /api/salas/:id", () => {
  it("Debería devolver la sala con el IdSala 6 borrado", async () => {
    const res = await request(app).delete("/api/salas/6");
    expect(res.statusCode).toEqual(200);
  });
});
