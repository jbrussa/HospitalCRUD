const request = require("supertest");
const app = require("../index");

const medicoAlta = {
  IdMedico: Math.trunc(Math.random() * 1000),
  Nombre: "Cristina",
  Apellido: "Yang",
  FechaIngreso: new Date().toISOString(),
  IdEspecialidad: 1,
  Activo: 1
};
const medicoModificacion = {
  IdMedico: 172,
  Nombre: "Lexie",
  Apellido: "Grey",
  FechaIngreso: new Date().toISOString(),
  IdEspecialidad: 2,
  Activo: 1
};

describe("GET /api/medicos", function () {
  it("Devolveria todos los medicos", async function () {
    const res = await request(app)
      .get("/api/medicos")
      .set("content-type", "application/json");
    expect(res.headers["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          IdMedico: expect.any(Number),
          Nombre: expect.any(String),
          Apellido: expect.any(String),
          FechaIngreso: expect.any(String),
          IdEspecialidad: expect.any(Number),
          Activo: expect.any(Boolean),
        }),
      ])
    );
  });
});


describe("GET /api/medicos/:id", function () {
  it("Responde con un json conteniendo un solo medico", async function () {
    const res = await request(app)
      .get("/api/medicos/172");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdMedico: 172,
        Nombre: expect.any(String),
        Apellido: expect.any(String),
        FechaIngreso: expect.any(String),
        IdEspecialidad: expect.any(Number),
        Activo: expect.any(Boolean),
      })
    );
  });
});


describe("POST /api/medicos", () => {
  it("Deberia devolver el medico que acabo de crear", async () => {
    const res = await request(app).post("/api/medicos").send(medicoAlta);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        IdMedico: expect.any(Number),
        Nombre: expect.any(String),
        Apellido: expect.any(String),
        FechaIngreso: expect.any(String),
        IdEspecialidad: expect.any(Number),
        Activo: expect.any(Boolean),
      })
    );
  });
});


describe("PUT /api/medicos/:id", () => {
  it("Deberia devolver el medico con el NumDocumento 172 modificado", async () => {
    const res = await request(app)
      .put("/api/medicos/172")
      .send(medicoModificacion);
    expect(res.statusCode).toEqual(204);
  });
});

describe("DELETE /api/medicos/:id", () => {
  it("Debería devolver el medico con el id 5 borrado", async () => {
    const res = await request(app).delete("/api/medicos/5");
    expect(res.statusCode).toEqual(200);
  });
});
