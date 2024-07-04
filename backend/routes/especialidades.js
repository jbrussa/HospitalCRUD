const express = require("express");
const router = express.Router();

const db = require("../base-orm/sequelize-init");

/* METODOS especialidad (Aye)*/

/* Metodo GET */
router.get("/api/especialidades", async function (req, res, next) {
  let data = await db.Especialidades.findAll({
    attributes: [
      "IdEspecialidad",
      "Nombre",
      "Activo",
    ],
  });
  res.json(data);
});

module.exports = router;
