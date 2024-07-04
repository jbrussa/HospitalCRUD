const express = require("express");
const router = express.Router();
const { Op, ValidationError } = require("sequelize");
const db = require("../base-orm/sequelize-init");

/* METODOS Pacientes (Ezequiel)*/

// Obtener todos los empleados
router.get("/api/pacientes", async function (req, res, next) {
  let where = {};
  if (req.query.Nombre != undefined && req.query.Nombre !== "") {
    where.Nombre = {
      [Op.like]: "%" + req.query.Nombre + "%",
    };
  }

  let data = await db.Pacientes.findAll({
    attributes: [
      "NumDocumento",
      "Nombre",
      "Apellido",
      "FechaNacimiento",
      "Activo",
      "IdObraSocial",
    ],
    order: [["Nombre", "ASC"]],
    where,
    include: "obraSocial",
  });
  res.json(
    data
  ); /* data es un array y sus propiedades son sus atributos ejemplo data[1].Nombre */
});

/* Metodo GET (por id, seria por dni) */
router.get("/api/pacientes/:id", async function (req, res, next) {
  let items = await db.Pacientes.findOne({
    attributes: [
      "NumDocumento",
      "Nombre",
      "Apellido",
      "FechaNacimiento",
      "Activo",
      "IdObraSocial",
    ],
    where: { NumDocumento: req.params.id },
    include: "obraSocial",
  });
  res.json(items);
});

/* Metodo POST */
router.post("/api/pacientes/", async (req, res) => {
  try {
    let data = await db.Pacientes.create({
      NumDocumento: req.body.NumDocumento,
      Nombre: req.body.Nombre,
      Apellido: req.body.Apellido,
      FechaNacimiento: req.body.FechaNacimiento,
      IdObraSocial: req.body.IdObraSocial,
      Activo: req.body.Activo,
    });
    res.status(200).json(data.dataValues);
  } catch (err) {
    if (err instanceof ValidationError) {
      let messages = "";
      err.errors.forEach(
        (x) => (messages += (x.path ?? "campo") + ": " + x.message + "\n")
      );
      res.status(400).json({
        message: messages,
      });
    } else {
      throw err;
    }
  }
});

/* Metodo PUT (buscando por id, o sea dni) */
router.put("/api/pacientes/:id", async (req, res) => {
  try {
    let item = await db.Pacientes.findOne({
      /* busco en la tabla salas lo que cumple con el where de abajo*/
      attributes: [
        "NumDocumento",
        "Nombre",
        "Apellido",
        "FechaNacimiento",
        "IdObraSocial",
        "Activo",
      ],
      where: { NumDocumento: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Paciente no encontrado" });
      return;
    }
    item.NumDocumento = req.body.NumDocumento ?? item.NumDocumento;
    item.Nombre = req.body.Nombre ?? item.Nombre;
    item.Apellido = req.body.Apellido ?? item.Apellido;
    item.FechaNacimiento = req.body.FechaNacimiento ?? item.FechaNacimiento;
    item.IdObraSocial = req.body.IdObraSocial ?? item.IdObraSocial;
    item.Activo = req.body.Activo ?? item.Activo;
    /*  usamos el ?? para que si no se ingresan los datos, se mantengan los anteriores al put */
    await item.save();
    res.sendStatus(204);
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validación, los devolvemos
      let messages = "";
      err.errors.forEach((x) => (messages += x.path + ": " + x.message + "\n"));
      res.status(400).json({ message: messages });
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

/* Metodo DELETE (buscando por id)  */
router.delete("/api/pacientes/:id", async (req, res) => {
  let bajaFisica = false;

  if (bajaFisica) {
    // baja fisica
    let filasBorradas = await db.Pacientes.destroy({
      /* guardo las filas borradas para corroborar que solo sea 1 la borrada */
      where: { NumDocumento: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
    // baja lógica
    try {
      let data = await db.sequelize.query(
        "UPDATE pacientes SET Activo = case when Activo = 1 then 0 else 1 end WHERE NumDocumento = :NumDocumento" /* invierte el valor de Activo*/,
        {
          replacements: {
            NumDocumento: +req.params.id,
          },
        } /* reemplazo en la consulta NumDocumento por +req.params.id */
      );
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ValidationError) {
        // si son errores de validación, los devolvemos
        const messages = err.errors.map((x) => x.message);
        res.status(400).json(messages);
      } else {
        // si son errores desconocidos, los dejamos que los controle el middleware de errores
        throw err;
      }
    }
  }
});

module.exports = router;
