const express = require("express");
const router = express.Router();

const db = require("../base-orm/sequelize-init");

/* Metodo GET */
router.get("/api/obraSociales", async function (req, res, next) {
    let data = await db.ObraSociales.findAll({
      attributes: [
        "IdObraSocial",
        "Nombre",
        "Activo",
      ],
    });
    res.json(data);
  });

module.exports = router;