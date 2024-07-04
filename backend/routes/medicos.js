const express = require("express");
const router = express.Router();
const { Op, ValidationError } = require("sequelize");

const db = require("../base-orm/sequelize-init");

/* METODOS medicos (Aye)*/
// Obtener todos los medicos
router.get("/api/medicos", async function (req, res, next) {
  let where = {};
  if (req.query.Nombre != undefined && req.query.Nombre !== "") {
    where.Nombre = {
      [Op.like]: "%" + req.query.Nombre + "%",
    };
  }

  let data = await db.Medicos.findAll({
    attributes: [
      "IdMedico",
      "Nombre",
      "Apellido",
      "FechaIngreso",
      "IdEspecialidad",
      "Activo",
    ],
    order: [["IdMedico", "ASC"]],
    where,
    include: "especialidad",
  });
  res.json(
    data
  ); /* data es un array y sus propiedades son sus atributos ejemplo data[1].Nombre */
});

/* Metodo GET (por id, seria por dni) */
router.get("/api/medicos/:id", async function (req, res, next) {
  let items = await db.Medicos.findOne({
    attributes: [
      "IdMedico",
      "Nombre",
      "Apellido",
      "FechaIngreso",
      "IdEspecialidad",
      "Activo",
    ],
    where: { IdMedico: req.params.id },
    include: "especialidad",
  });
  res.json(items);
});

/* Metodo POST */
router.post("/api/medicos/", async (req, res) => {
  try {
    let data = await db.Medicos.create({
      IdMedico: req.body.IdMedico,
      Nombre: req.body.Nombre,
      Apellido: req.body.Apellido,
      FechaIngreso: req.body.FechaIngreso,
      IdEspecialidad: req.body.IdEspecialidad,
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

/* Metodo PUT (buscando por id) */
router.put("/api/medicos/:id", async (req, res) => {
  try {
    let item = await db.Medicos.findOne({
      /* busco en la tabla salas lo que cumple con el where de abajo*/
      attributes: [
        "IdMedico",
        "Nombre",
        "Apellido",
        "FechaIngreso",
        "IdEspecialidad",
        "Activo",
      ],
      where: { IdMedico: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Medico no encontrado" });
      return;
    }
    item.IdMedico = req.body.IdMedico ?? item.IdMedico;
    item.Nombre = req.body.Nombre ?? item.Nombre;
    item.Apellido = req.body.Apellido ?? item.Apellido;
    item.FechaIngreso = req.body.FechaIngreso ?? item.FechaIngreso;
    item.IdEspecialidad = req.body.IdEspecialidad ?? item.IdEspecialidad;
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
router.delete("/api/medicos/:id", async (req, res) => {
  let bajaFisica = false;

  if (bajaFisica) {
    // baja fisica
    let filasBorradas = await db.Medicos.destroy({
      /* guardo las filas borradas para corroborar que solo sea 1 la borrada */
      where: { IdMedico: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
    // baja lógica
    try {
      let data = await db.sequelize.query(
        "UPDATE medicos SET Activo = case when Activo = 1 then 0 else 1 end WHERE IdMedico = :IdMedico" /* invierte el valor de Activo*/,
        {
          replacements: {
            IdMedico: +req.params.id,
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
