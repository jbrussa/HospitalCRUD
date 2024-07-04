const request = require("supertest");
const app = require("../index");

const pacienteAlta = {
  NumDocumento: Math.trunc(Math.random() * 10000),
  Nombre: "Ezequiel",
  Apellido: "Di Pietro",
  FechaNacimiento: new Date().toISOString(),
  IdObraSocial: 2,
  Activo: 1
};
const pacienteModificacion = {
  NumDocumento: 12340987,
  Nombre: "Daniela",
  Apellido: "Torres",
  FechaNacimiento: new Date().toISOString(),
  IdObraSocial: 2,
  Activo: 1
};

describe("GET /api/pacientes", function () {
  it("Devolveria todos los pacientes", async function () {
    const res = await request(app)
      .get("/api/pacientes")
      .set("content-type", "application/json");
    expect(res.headers["content-type"]).toEqual(
      "application/json; charset=utf-8"
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          NumDocumento: expect.any(Number),
          Nombre: expect.any(String),
          Apellido: expect.any(String),
          FechaNacimiento: expect.any(String),
          IdObraSocial: expect.any(Number),
          Activo: expect.any(Boolean),
        }),
      ])
    );
  });
});


describe("GET /api/pacientes/:id", function () {
  it("Responde con un json conteniendo un solo paciente", async function () {
    const res = await request(app)
      .get("/api/pacientes/12340987");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        NumDocumento: 12340987,
        Nombre: expect.any(String),
        Apellido: expect.any(String),
        FechaNacimiento: expect.any(String),
        IdObraSocial: expect.any(Number),
        Activo: expect.any(Boolean),
      })
    );
  });
});


describe("POST /api/pacientes", () => {
  it("Deberia devolver el paciente que acabo de crear", async () => {
    const res = await request(app).post("/api/pacientes").send(pacienteAlta);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        NumDocumento: expect.any(Number),
        Nombre: expect.any(String),
        Apellido: expect.any(String),
        FechaNacimiento: expect.any(String),
        IdObraSocial: expect.any(Number),
        Activo: expect.any(Boolean),
      })
    );
  });
});


describe("PUT /api/pacientess/:id", () => {
  it("Deberia devolver el paciente con el NumDocumento 12340987 modificado", async () => {
    const res = await request(app)
      .put("/api/pacientes/12340987")
      .send(pacienteModificacion);
    expect(res.statusCode).toEqual(204);
  });
});

describe("DELETE /api/pacientes/:id", () => {
  it("Debería devolver el paciente con el NumDocumento 89012345 borrado", async () => {
    const res = await request(app).delete("/api/pacientes/89012345");
    expect(res.statusCode).toEqual(200);
  });
});
