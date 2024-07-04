const express = require("express");
const router = express.Router();
const { Op, ValidationError } = require("sequelize");
const db = require("../base-orm/sequelize-init");

/* METODOS SALAS (juli)*/

/* Metodo GET */
router.get("/api/salas", async function (req, res, next) {
  let where = {};
  if (req.query.Ala != undefined && req.query.Ala !== "") {
    where.Ala = {
      [Op.like]: "%" + req.query.Ala + "%",
    };
  }

  let data = await db.Salas.findAll({
    attributes: [
      "IdSala",
      "Ala",
      "FechaUltimoControl",
      "NumTipoSala",
      "Activo",
    ],
    order: [["IdSala", "ASC"]],
    where,
    include: "tipoSala",
  });
  res.json(
    data
  ); /* data es un array y sus propiedades son sus atributos ejemplo data[1].Nombre */
});

/* Metodo GET (por id) */
router.get("/api/salas/:id", async function (req, res, next) {
  let items = await db.Salas.findOne({
    attributes: [
      "IdSala",
      "Ala",
      "FechaUltimoControl",
      "NumTipoSala",
      "Activo",
    ],
    where: { IdSala: req.params.id },
    include: "tipoSala",
  });
  res.json(items);
});

/* Metodo POST */
router.post("/api/salas/", async (req, res) => {
  try {
    let data = await db.Salas.create({
      /* data es el objeto que tiene el registro que quiero subir, db.tabla.funcion  */
      IdSala: req.body.IdSala,
      Ala: req.body.Ala,
      FechaUltimoControl: req.body.FechaUltimoControl,
      NumTipoSala: req.body.NumTipoSala,
      Activo: req.body.Activo,
    });
    res
      .status(200)
      .json(
        data.dataValues
      ); /* dataValues son todos los atributos con sus valores. si quiero llamar a nombre pongo data.dataValues.Nombre */
  } catch (err) {
    if (err instanceof ValidationError) {
      /* ValidationError es una clase, err seria una instancia de esa clase. validation en sequelize-init seria la validacion */
      // si son errores de validación, lo aviso, sino no se que es entonces le tiro error
      let messages = "";
      err.errors.forEach(
        /* recorrer todos los errores */
        (x) =>
          (messages +=
            (x.path ?? "campo") +
            ": " +
            x.message +
            "\n") /* por cada error pongo el path (si no lo tiene pone "campo") y le agrega el mensaje de error */
      );
      res.status(400).json({
        message: messages,
      }); /* devuelvo como mensaje la tupla de mensajes con errores */
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

/* Metodo PUT (buscando por id) */
router.put("/api/salas/:id", async (req, res) => {
  try {
    let item = await db.Salas.findOne({
      /* busco en la tabla salas lo que cumple con el where de abajo*/
      attributes: [
        "IdSala",
        "Ala",
        "FechaUltimoControl",
        "NumTipoSala",
        "Activo",
      ],
      where: { IdSala: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Sala no encontrada" });
      return;
    }
    item.IdSala = req.body.IdSala ?? item.IdSala;
    item.Ala = req.body.Ala ?? item.Ala;
    item.FechaUltimoControl =
      req.body.FechaUltimoControl ?? item.FechaUltimoControl;
    item.NumTipoSala = req.body.NumTipoSala ?? item.NumTipoSala;
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

/* Metodo DELETE (buscando por id)*/
router.delete("/api/salas/:id", async (req, res) => {
  let bajaFisica = false; /* Este valor se cambia segun la baja que se necesite */

  if (bajaFisica) {
    let filasBorradas = await db.Salas.destroy({
      /* guardo las filas borradas para corroborar que solo sea 1 la borrada */
      where: { IdSala: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
    // baja lógica
    try {
      let data = await db.sequelize.query(
        "UPDATE Salas SET Activo = case when Activo = 1 then 0 else 1 end WHERE IdSala = :IdSala" /* invierte el valor de Activo*/,
        {
          replacements: {
            IdSala: +req.params.id,
          },
        } /* reemplazo en la consulta IdSala por +req.params.id */
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
