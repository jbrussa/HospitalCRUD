const express = require("express");
const router = express.Router();

const db = require("../base-orm/sequelize-init");



/* Metodo GET */
router.get("/api/tiposalas", async function (req, res, next) {
  let data = await db.TipoSalas.findAll({
    attributes: [
      "IdTipoSala",
      "NombreTipoSala",
      "Activo",
    ] 
  });
  res.json(
    data
  ); 
});

module.exports = router;