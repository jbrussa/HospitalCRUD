const express = require("express");
const router = express.Router();

const db = require("../base-orm/sequelize-init");

/* METODOS medicamentos (Octi)/

/ Metodo GET */
router.get("/api/tipomedicamentos", async function (req, res, next) {
  let data = await db.TipoMedicamentos.findAll({
    attributes: [
      "IdTipoMedicamento",
      "Nombre",
      "Activo",
    ],
  });
  res.json(data);
});

module.exports = router;