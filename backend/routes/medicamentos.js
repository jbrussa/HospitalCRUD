const express = require("express");
const router = express.Router();
const { Op, ValidationError } = require("sequelize");

const db = require("../base-orm/sequelize-init");

/* METODOS medicamentos (Octi)*/

/* Metodo GET */
router.get("/api/medicamentos", async function (req, res, next) {
  let where = {};
  if (req.query.Nombre != undefined && req.query.Nombre !== "") {
    where.Nombre = {
      [Op.like]: "%" + req.query.Nombre + "%",
    };
  }
  let data = await db.Medicamentos.findAll({
    attributes: [
      "IdMedicamento",
      "Nombre",
      "Precio",
      "FechaLanzamiento",
      "IdTipoMedicamento",
      "Activo",
    ],
    order: [["IdMedicamento", "ASC"]],
    where,
    include: "tipoMedicamento",
  });
  res.json(data);
});

/* Metodo GET (por id) */
router.get("/api/medicamentos/:id", async function (req, res, next) {
  let items = await db.Medicamentos.findOne({
    attributes: [
      "IdMedicamento",
      "Nombre",
      "Precio",
      "FechaLanzamiento",
      "IdTipoMedicamento",
      "Activo",
    ],
    where: { IdMedicamento: req.params.id },
    include: "tipoMedicamento",
  });
  res.json(items);
});

/* Metodo POST */
router.post("/api/medicamentos/", async (req, res) => {
  try {
    let data = await db.Medicamentos.create({
      IdMedicamento: req.body.IdMedicamento,
      Nombre: req.body.Nombre,
      Precio: req.body.Precio,
      FechaLanzamiento: req.body.FechaLanzamiento,
      IdTipoMedicamento: req.body.IdTipoMedicamento,
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
router.put("/api/medicamentos/:id", async (req, res) => {
  try {
    let item = await db.Medicamentos.findOne({
      /* busco en la tabla salas lo que cumple con el where de abajo*/
      attributes: [
        "IdMedicamento",
        "Nombre",
        "Precio",
        "FechaLanzamiento",
        "IdTipoMedicamento",
        "Activo",
      ],
      where: { IdMedicamento: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Medicamento no encontrado" });
      return;
    }
    item.IdMedicamento = req.body.IdMedico ?? item.IdMedicamento;
    item.Nombre = req.body.Nombre ?? item.Nombre;
    item.Precio = req.body.Precio ?? item.Precio;
    item.FechaLanzamiento = req.body.FechaLanzamiento ?? item.FechaLanzamiento;
    item.IdTipoMedicamento =
      req.body.IdTipoMedicamento ?? item.IdTipoMedicamento;
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
router.delete("/api/medicamentos/:id", async (req, res) => {
  let bajaFisica = false;

  if (bajaFisica) {
    // baja fisica
    let filasBorradas = await db.Medicamentos.destroy({
      /* guardo las filas borradas para corroborar que solo sea 1 la borrada */
      where: { IdMedicamento: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
    // baja lógica
    try {
      let data = await db.sequelize.query(
        "UPDATE medicamentos SET Activo = case when Activo = 1 then 0 else 1 end WHERE IdMedicamento = :IdMedicamento" /* invierte el valor de Activo*/,
        {
          replacements: {
            IdMedicamento: +req.params.id,
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
